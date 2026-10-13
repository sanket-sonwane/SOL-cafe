import { cafeConfig } from "@/data/cafe";
import { formatDateLong, formatTime, parseIsoDateLocal, todayIsoLocal } from "@/lib/format";
import type { ReservationDraft, ReservationValidation } from "@/types";

/* ---------------------------------------------------------------------------
   Reservation enquiry (PRD §6.11 / FR-08).

   This module prepares and validates an *enquiry*. It deliberately has no
   concept of availability, capacity or confirmation — the only honest claims
   the interface can make are "your message is ready" and "this is not yet a
   booking".
   --------------------------------------------------------------------------- */

export const RESERVATION_LIMITS = {
  minPartySize: 1,
  maxNotesLength: 500,
} as const;

export const EMPTY_RESERVATION: ReservationDraft = {
  name: "",
  partySize: "2",
  date: "",
  time: "19:00",
  contact: "",
  notes: "",
};

export interface ValidateOptions {
  /** Injectable so tests do not depend on the wall clock. */
  today?: Date;
  maxPartySize?: number;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateReservation(
  draft: ReservationDraft,
  options: ValidateOptions = {},
): ReservationValidation {
  const today = options.today ?? new Date();
  const maxPartySize = options.maxPartySize ?? cafeConfig.reservationMaxPartySize;
  const errors: ReservationValidation["errors"] = {};

  // Name -------------------------------------------------------------------
  const name = draft.name.trim();
  if (!name) {
    errors.name = "Please tell us who the table is for.";
  } else if (name.length < 2) {
    errors.name = "That name looks a little short.";
  } else if (name.length > 80) {
    errors.name = "Please keep the name under 80 characters.";
  }

  // Party size -------------------------------------------------------------
  const partySize = Number(draft.partySize);
  if (!draft.partySize.trim()) {
    errors.partySize = "How many are joining?";
  } else if (!Number.isInteger(partySize)) {
    errors.partySize = "Please enter a whole number.";
  } else if (partySize < RESERVATION_LIMITS.minPartySize) {
    errors.partySize = `We can seat at least ${RESERVATION_LIMITS.minPartySize}.`;
  } else if (partySize > maxPartySize) {
    errors.partySize = `For more than ${maxPartySize} guests, please message us directly.`;
  }

  // Date -------------------------------------------------------------------
  if (!draft.date.trim()) {
    errors.date = "Which day are you thinking of?";
  } else {
    const parsed = parseIsoDateLocal(draft.date);
    if (!parsed) {
      errors.date = "That date doesn't look right.";
    } else {
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (parsed.getTime() < startOfToday.getTime()) {
        errors.date = "Please choose today or a future date.";
      }
    }
  }

  // Time -------------------------------------------------------------------
  if (!draft.time.trim()) {
    errors.time = "What time would suit you?";
  } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time.trim())) {
    errors.time = "Please pick a valid time.";
  }

  // Contact (optional, but validated when given) ---------------------------
  const contact = draft.contact.trim();
  if (contact) {
    const digits = contact.replace(/\D/g, "");
    const looksLikePhone = digits.length >= 10 && digits.length <= 15;
    const looksLikeEmail = EMAIL_PATTERN.test(contact);
    if (!looksLikePhone && !looksLikeEmail) {
      errors.contact = "Please add a phone number or an email address we can reply to.";
    }
  }

  // Notes (optional) -------------------------------------------------------
  if (draft.notes.length > RESERVATION_LIMITS.maxNotesLength) {
    errors.notes = `Please keep notes under ${RESERVATION_LIMITS.maxNotesLength} characters.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * The exact text pre-filled into WhatsApp. It states plainly that this is an
 * enquiry, so the message itself cannot be mistaken for a confirmation.
 */
export function buildReservationMessage(draft: ReservationDraft): string {
  const lines = [
    `Reservation enquiry for ${cafeConfig.name}`,
    "",
    `Name: ${draft.name.trim()}`,
    `Party size: ${Number(draft.partySize)}`,
    `Date: ${draft.date ? formatDateLong(draft.date) : "—"}`,
    `Time: ${draft.time ? formatTime(draft.time) : "—"}`,
  ];

  if (draft.contact.trim()) lines.push(`Contact: ${draft.contact.trim()}`);
  if (draft.notes.trim()) lines.push(`Notes: ${draft.notes.trim()}`);

  lines.push("", "This is an enquiry only — not a confirmed booking.");

  return lines.join("\n");
}

/** The single sentence the confirmation screen must show. (PRD §6.11) */
export const RESERVATION_CONFIRMATION_NOTICE =
  "Your enquiry is ready to send. Your reservation is not confirmed until the café replies.";

export { todayIsoLocal };
