import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { cafeConfig } from "@/data/cafe";
import { todayIsoLocal } from "@/lib/format";
import {
  buildReservationMessage,
  EMPTY_RESERVATION,
  RESERVATION_CONFIRMATION_NOTICE,
  RESERVATION_LIMITS,
  validateReservation,
} from "@/lib/reservation";
import type { ReservationDraft, ReservationErrors, ReservationField } from "@/types";
import { Button } from "@/components/buttons/Button";
import { WhatsAppButton } from "@/components/buttons/WhatsAppButton";

/** The order errors are reported in, so focus always lands on the first problem. */
const FIELD_ORDER: ReservationField[] = ["name", "partySize", "date", "time", "contact", "notes"];

const INPUT_CLASSES = cn(
  // 16px, not 15px: below 16px a mobile browser may zoom the page when a field
  // takes focus, and it is a cramped target to read back what you typed.
  "h-11 w-full rounded-xl border bg-cream px-4 text-base text-espresso",
  "placeholder:text-espresso/65",
  "focus-visible:border-espresso/50 focus-visible:outline-none",
);

/** Returns the id of the error element for a field, used by aria-describedby. */
const errorId = (field: ReservationField) => `reservation-${field}-error`;

interface FieldProps {
  field: ReservationField;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}

function Field({ field, label, error, hint, optional = false, children }: FieldProps) {
  const id = `reservation-${field}`;
  const describedBy = cn(error ? errorId(field) : null, hint ? `${id}-hint` : null) || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.8125rem] font-medium tracking-[0.02em] text-espresso/80">
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal text-espresso/70">(optional)</span>
        ) : (
          <span aria-hidden="true" className="ml-1 text-terracotta">
            *
          </span>
        )}
      </label>

      {children({
        id,
        name: field,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}

      {hint && (
        <p id={`${id}-hint`} className="text-caption text-espresso/70">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId(field)} className="flex items-start gap-1.5 text-caption text-terracotta-deep">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Section K — the reservation enquiry (PRD §6.11).
 *
 * This is an *enquiry*, and the interface never says otherwise. Opening WhatsApp
 * only prepares a message; the confirmation state repeats the exact sentence the
 * PRD requires, offers a visible way back to editing, and — because WhatsApp can
 * fail to open for reasons the page cannot detect — always shows the café's phone
 * number and email as a fallback.
 *
 * Validation is delegated to `lib/reservation.ts` so the rules can be unit tested
 * and so the message that is actually sent and the message that is validated can
 * never disagree.
 */
export function ReservationForm() {
  const [draft, setDraft] = useState<ReservationDraft>(EMPTY_RESERVATION);
  const [errors, setErrors] = useState<ReservationErrors>({});
  const [status, setStatus] = useState<"editing" | "ready">("editing");
  const [minDate, setMinDate] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  /*
   * The earliest selectable date is the visitor's own today, so it is only known
   * on the client. Setting it in an effect (rather than during render) keeps the
   * prerendered markup and the first client render identical — otherwise the
   * `min` attribute would differ whenever the visitor's time zone differs from the
   * build machine's, which is a hydration mismatch.
   */
  useEffect(() => setMinDate(todayIsoLocal()), []);

  const update = (field: ReservationField) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    setDraft((previous) => ({ ...previous, [field]: value }));
    // Clear a resolved error as soon as the visitor fixes it, so the form does not
    // nag while it is being corrected.
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // A second submit while the enquiry is already prepared would open WhatsApp
    // twice. The form is replaced by the confirmation at this point, but the guard
    // stays as a belt-and-braces measure.
    if (status === "ready") return;

    const result = validateReservation(draft);
    if (!result.valid) {
      setErrors(result.errors);

      const firstInvalid = FIELD_ORDER.find((field) => result.errors[field]);
      if (firstInvalid) {
        const control = formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
        control?.focus({ preventScroll: false });
      }
      return;
    }

    setErrors({});
    setStatus("ready");
  };

  const returnToEditing = () => setStatus("editing");

  if (status === "ready") {
    return (
      <div className="rounded-[1.5rem] border border-espresso/12 bg-cream p-6 md:p-9">
        <p className="flex items-center gap-2 text-micro font-medium tracking-[0.18em] text-olive uppercase">
          <Send aria-hidden="true" className="size-3.5" />
          Enquiry prepared
        </p>

        <h3
          className="mt-4 max-w-lg font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] tracking-[-0.015em] text-balance"
          role="status"
        >
          {RESERVATION_CONFIRMATION_NOTICE}
        </h3>

        <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-espresso/75">
          Your details are filled into the message below. Send it in WhatsApp and the team will reply
          to confirm &mdash; or turn it down if the time doesn&rsquo;t work.
        </p>

        <div className="mt-7 flex flex-col gap-4">
          <WhatsAppButton message={buildReservationMessage(draft)} size="lg" fullWidth>
            Open WhatsApp with my enquiry
          </WhatsAppButton>

          <Button variant="outline" onClick={returnToEditing} className="self-start gap-2">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to editing
          </Button>
        </div>

        <div className="mt-7 border-t border-espresso/12 pt-5">
          <p className="text-caption text-espresso/70">
            WhatsApp not opening? Call{" "}
            <a href={`tel:${cafeConfig.phoneHref}`} className="link-underline numeric text-espresso/80">
              {cafeConfig.phoneDisplay}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${cafeConfig.email}`} className="link-underline text-espresso/80">
              {cafeConfig.email}
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[1.5rem] border border-espresso/12 bg-cream p-6 md:p-9"
    >
      <p className="text-caption text-espresso/70">
        Fields marked <span className="text-terracotta">*</span> are required. Everything else helps
        us get it right but is optional.
      </p>

      {errorCount > 0 && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-terracotta/35 bg-terracotta/8 px-4 py-3 text-caption text-espresso/80"
        >
          {errorCount === 1
            ? "One field needs a little attention before we can prepare your enquiry."
            : `${errorCount} fields need a little attention before we can prepare your enquiry.`}
        </p>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field field="name" label="Your name" error={errors.name}>
            {(props) => (
              <input
                {...props}
                type="text"
                value={draft.name}
                onChange={update("name")}
                autoComplete="name"
                placeholder="Who is the table for?"
                className={cn(INPUT_CLASSES, errors.name && "border-terracotta")}
              />
            )}
          </Field>
        </div>

        <Field
          field="partySize"
          label="Party size"
          error={errors.partySize}
          hint={`Up to ${cafeConfig.reservationMaxPartySize} guests`}
        >
          {(props) => (
            <input
              {...props}
              type="number"
              inputMode="numeric"
              min={RESERVATION_LIMITS.minPartySize}
              max={cafeConfig.reservationMaxPartySize}
              step={1}
              value={draft.partySize}
              onChange={update("partySize")}
              className={cn(INPUT_CLASSES, "numeric", errors.partySize && "border-terracotta")}
            />
          )}
        </Field>

        <Field field="date" label="Date" error={errors.date}>
          {(props) => (
            <input
              {...props}
              type="date"
              min={minDate || undefined}
              value={draft.date}
              onChange={update("date")}
              className={cn(INPUT_CLASSES, "numeric", errors.date && "border-terracotta")}
            />
          )}
        </Field>

        <Field field="time" label="Time" error={errors.time}>
          {(props) => (
            <input
              {...props}
              type="time"
              value={draft.time}
              onChange={update("time")}
              className={cn(INPUT_CLASSES, "numeric", errors.time && "border-terracotta")}
            />
          )}
        </Field>

        <Field
          field="contact"
          label="Phone or email"
          error={errors.contact}
          optional
          hint="So the café can reply"
        >
          {(props) => (
            <input
              {...props}
              type="text"
              value={draft.contact}
              onChange={update("contact")}
              autoComplete="tel"
              placeholder="A number or an address"
              className={cn(INPUT_CLASSES, errors.contact && "border-terracotta")}
            />
          )}
        </Field>

        <div className="md:col-span-2">
          <Field field="notes" label="Anything we should know" error={errors.notes} optional>
            {(props) => (
              <textarea
                {...props}
                rows={4}
                value={draft.notes}
                onChange={update("notes")}
                maxLength={RESERVATION_LIMITS.maxNotesLength}
                placeholder="Accessibility needs, a quiet corner, a birthday, a pram…"
                className={cn(INPUT_CLASSES, "h-auto py-3 leading-relaxed", errors.notes && "border-terracotta")}
              />
            )}
          </Field>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4">
        <Button type="submit" size="lg" className="self-start">
          Prepare my enquiry
        </Button>

        <p className="max-w-md text-caption text-espresso/70">
          This prepares a WhatsApp message &mdash; it does not book a table. Your reservation is not
          confirmed until the café replies.
        </p>
      </div>
    </form>
  );
}
