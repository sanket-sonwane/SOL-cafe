import { describe, expect, it } from "vitest";
import {
  buildReservationMessage,
  EMPTY_RESERVATION,
  RESERVATION_CONFIRMATION_NOTICE,
  RESERVATION_LIMITS,
  validateReservation,
} from "@/lib/reservation";
import type { ReservationDraft } from "@/types";

const TODAY = new Date(2026, 4, 20); // 20 May 2026, local time.

function draft(overrides: Partial<ReservationDraft> = {}): ReservationDraft {
  return {
    name: "Asha",
    partySize: "2",
    date: "2026-05-22",
    time: "19:00",
    contact: "",
    notes: "",
    ...overrides,
  };
}

describe("validateReservation", () => {
  it("accepts a complete, sensible enquiry", () => {
    const result = validateReservation(draft(), { today: TODAY });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("reports every required field on an empty draft", () => {
    const result = validateReservation(
      { ...EMPTY_RESERVATION, date: "", partySize: "" },
      { today: TODAY },
    );

    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.partySize).toBeTruthy();
    expect(result.errors.date).toBeTruthy();
  });

  it("rejects a date in the past but allows today", () => {
    expect(validateReservation(draft({ date: "2026-05-19" }), { today: TODAY }).errors.date).toBeTruthy();
    expect(validateReservation(draft({ date: "2026-05-20" }), { today: TODAY }).valid).toBe(true);
  });

  it("rejects an impossible date", () => {
    expect(validateReservation(draft({ date: "2026-02-31" }), { today: TODAY }).errors.date).toBeTruthy();
  });

  it("bounds the party size", () => {
    expect(
      validateReservation(draft({ partySize: "0" }), { today: TODAY }).errors.partySize,
    ).toBeTruthy();
    expect(
      validateReservation(draft({ partySize: "2.5" }), { today: TODAY }).errors.partySize,
    ).toBeTruthy();
    expect(
      validateReservation(draft({ partySize: "40" }), { today: TODAY, maxPartySize: 12 }).errors
        .partySize,
    ).toBeTruthy();
  });

  it("rejects a time that is not a real 24-hour value", () => {
    expect(validateReservation(draft({ time: "25:00" }), { today: TODAY }).errors.time).toBeTruthy();
  });

  it("treats contact as optional but validates it when present", () => {
    expect(validateReservation(draft({ contact: "not a contact" }), { today: TODAY }).errors.contact)
      .toBeTruthy();
    expect(validateReservation(draft({ contact: "9876543210" }), { today: TODAY }).valid).toBe(true);
    expect(validateReservation(draft({ contact: "asha@example.com" }), { today: TODAY }).valid).toBe(
      true,
    );
  });

  it("rejects notes that are too long", () => {
    const notes = "a".repeat(RESERVATION_LIMITS.maxNotesLength + 1);
    expect(validateReservation(draft({ notes }), { today: TODAY }).errors.notes).toBeTruthy();
  });
});

describe("buildReservationMessage", () => {
  it("summarises the request and states plainly that it is not a confirmation", () => {
    const message = buildReservationMessage(
      draft({ contact: "asha@example.com", notes: "Window seat if possible" }),
    );

    expect(message).toContain("Asha");
    expect(message).toContain("Party size: 2");
    expect(message).toContain("7:00 PM");
    expect(message).toContain("asha@example.com");
    expect(message).toContain("Window seat if possible");
    expect(message).toContain("not a confirmed booking");
  });

  it("omits optional lines that were not filled in", () => {
    const message = buildReservationMessage(draft());
    expect(message).not.toContain("Contact:");
    expect(message).not.toContain("Notes:");
  });
});

describe("RESERVATION_CONFIRMATION_NOTICE", () => {
  it("is the exact sentence the interface must show", () => {
    expect(RESERVATION_CONFIRMATION_NOTICE).toBe(
      "Your enquiry is ready to send. Your reservation is not confirmed until the café replies.",
    );
  });
});
