import { cafeConfig } from "@/data/cafe";

/* ---------------------------------------------------------------------------
   WhatsApp enquiry links (PRD FR-07).

   Rules this module enforces:
   - the number lives in one place (cafeConfig) and is never hard-coded;
   - the message is URL-encoded by `encodeURIComponent`, never by hand;
   - an unconfigured or implausible number produces `null`, so the UI can show a
     real fallback instead of a broken link;
   - opening a link is treated as *preparing* a message. Nothing here claims a
     message was sent, or that a reservation exists.
   --------------------------------------------------------------------------- */

/** Digits only, as required by wa.me. */
export function normalisePhone(raw: string): string {
  return (raw ?? "").replace(/\D/g, "");
}

/**
 * A cheap sanity check, not a validity guarantee: 10–15 digits, not starting
 * with `0` (which no international number may). This keeps obviously fake
 * placeholders from producing a plausible-looking link.
 */
export function isPlausibleWhatsAppNumber(raw: string): boolean {
  const digits = normalisePhone(raw);
  if (digits.length < 10 || digits.length > 15) return false;
  if (digits.startsWith("0")) return false;
  return true;
}

export function isWhatsAppConfigured(raw: string = cafeConfig.whatsappNumber): boolean {
  return isPlausibleWhatsAppNumber(raw);
}

/**
 * Returns an `https://wa.me/...` URL with the message pre-filled, or `null` when
 * WhatsApp is not configured. Callers must handle `null`.
 */
export function buildWhatsAppUrl(
  message: string,
  raw: string = cafeConfig.whatsappNumber,
): string | null {
  if (!isPlausibleWhatsAppNumber(raw)) return null;
  const digits = normalisePhone(raw);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** The plain `tel:` fallback used when WhatsApp is unavailable. */
export function buildTelUrl(raw: string = cafeConfig.phoneHref): string | null {
  const digits = normalisePhone(raw);
  if (digits.length < 8) return null;
  return `tel:+${digits}`;
}

/** A short enquiry used by the generic "chat with us" actions. */
export function buildGeneralEnquiryMessage(): string {
  return `Hello ${cafeConfig.name}! I'd like to ask about visiting the café.`;
}

/**
 * Per-item enquiry used by the menu, so the café knows what is being asked about.
 *
 * Phrased as a question about availability rather than a request to buy: there is
 * no ordering system, and the interface must not imply one exists (PRD §2, §10.4).
 */
export function buildItemEnquiryMessage(itemName: string, price: string): string {
  return `Hello ${cafeConfig.name}! I'd like to ask about: ${itemName} (${price}). Is it available?`;
}
