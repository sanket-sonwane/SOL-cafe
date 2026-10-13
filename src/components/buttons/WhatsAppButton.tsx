import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { cafeConfig } from "@/data/cafe";
import { buildTelUrl, buildWhatsAppUrl } from "@/lib/whatsapp";
import { ButtonLink, type ButtonSize, type ButtonVariant } from "@/components/buttons/Button";

/**
 * The WhatsApp action, with the fallback the PRD requires (FR-07).
 *
 * Two independent safety nets:
 *  1. If no plausible number is configured, no WhatsApp link is rendered at all —
 *     the visitor is given the plain contact details instead;
 *  2. Even when WhatsApp is configured, the phone number and email address are
 *     always shown beneath it, because opening a messaging app can fail for
 *     reasons the page cannot detect.
 *
 * Opening WhatsApp only ever *prepares* a message. Nothing here — and nothing in
 * the confirmation state — claims a message was sent or an order was placed.
 */
export function WhatsAppButton({
  message,
  children,
  variant = "primary",
  size = "lg",
  className,
  fullWidth = false,
}: {
  message: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  fullWidth?: boolean;
}) {
  const whatsappUrl = buildWhatsAppUrl(message);
  const telUrl = buildTelUrl();

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {whatsappUrl ? (
        <ButtonLink
          href={whatsappUrl}
          external
          variant={variant}
          size={size}
          className={cn(fullWidth && "w-full")}
        >
          <MessageCircle aria-hidden="true" className="size-4" />
          {children}
        </ButtonLink>
      ) : (
        <p className="text-sm text-current/70">
          Messaging isn&rsquo;t configured yet — please call or email us instead.
        </p>
      )}

      <p className="text-caption text-current/70">
        {telUrl ? (
          <>
            Prefer to call?{" "}
            <a href={telUrl} className="link-underline">
              {cafeConfig.phoneDisplay}
            </a>
          </>
        ) : null}
        {telUrl ? " · " : null}
        <a href={`mailto:${cafeConfig.email}`} className="link-underline">
          {cafeConfig.email}
        </a>
      </p>
    </div>
  );
}
