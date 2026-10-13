import type { OpeningHoursRow, OpeningInterval } from "@/types";

/* ---------------------------------------------------------------------------
   Formatting helpers.
   Prices, times and dates appear in several places, so they are formatted in
   exactly one way. (PRD FR-04 / FR-06)
   --------------------------------------------------------------------------- */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** `240` → `"₹240"`. Prices are whole rupees in this data model. */
export function formatINR(amount: number): string {
  if (!Number.isFinite(amount)) return "—";
  return inrFormatter.format(amount).replace(/\u00a0/g, " ");
}

const longDateFormatter = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDateLong(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return longDateFormatter.format(date);
}

/**
 * `"08:30"` → `"8:30 AM"`.
 * Parsed by hand rather than with Intl so the output never depends on the
 * visitor's locale (the café's hours are always shown in English).
 */
export function formatTime(value: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = match[2];
  if (Number.isNaN(hours) || hours > 23) return value;

  const period = hours >= 12 ? "PM" : "AM";
  const twelveHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${twelveHour}:${minutes} ${period}`;
}

export function formatInterval(interval: OpeningInterval): string {
  return `${formatTime(interval.opens)} – ${formatTime(interval.closes)}`;
}

/** Handles split hours by joining each interval with a comma. */
export function formatHoursRow(row: OpeningHoursRow): string {
  return row.intervals.map(formatInterval).join(", ");
}

/**
 * Today's date as `YYYY-MM-DD` in the *visitor's* local time.
 * Used as the `min` attribute for the reservation date field so it lines up with
 * `validateReservation`, which also compares local dates.
 */
export function todayIsoLocal(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses a `YYYY-MM-DD` value as a local date (never UTC midnight). */
export function parseIsoDateLocal(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  // Reject overflow such as 2026-02-31.
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/** A short, unambiguous label: "240 g", "12 oz". Not currently used but kept
 *  beside the other formatters so units stay consistent if the menu grows. */
export function formatAmount(value: number, unit: string): string {
  return `${value} ${unit}`;
}
