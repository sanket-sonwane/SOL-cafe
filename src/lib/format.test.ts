import { describe, expect, it } from "vitest";
import {
  formatAmount,
  formatDateLong,
  formatHoursRow,
  formatINR,
  formatInterval,
  formatTime,
  parseIsoDateLocal,
  todayIsoLocal,
} from "@/lib/format";

describe("formatINR", () => {
  it("formats whole rupees with the Indian currency symbol and grouping", () => {
    expect(formatINR(240).replace(/\s/g, "")).toBe("₹240");
    expect(formatINR(1200).replace(/\s/g, "")).toBe("₹1,200");
  });

  it("returns a dash for values that are not finite numbers", () => {
    expect(formatINR(Number.NaN)).toBe("—");
    expect(formatINR(Number.POSITIVE_INFINITY)).toBe("—");
  });
});

describe("formatTime", () => {
  it("renders 24-hour input as a 12-hour time", () => {
    expect(formatTime("08:30")).toBe("8:30 AM");
    expect(formatTime("22:00")).toBe("10:00 PM");
    expect(formatTime("00:15")).toBe("12:15 AM");
    expect(formatTime("12:00")).toBe("12:00 PM");
  });

  it("passes through anything it cannot parse instead of guessing", () => {
    expect(formatTime("later")).toBe("later");
    expect(formatTime("25:00")).toBe("25:00");
  });
});

describe("hours formatting", () => {
  it("joins split intervals with a comma", () => {
    const row = {
      id: "split",
      label: "Monday",
      days: [1],
      intervals: [
        { opens: "08:00", closes: "12:00" },
        { opens: "16:00", closes: "22:00" },
      ],
    };

    expect(formatInterval(row.intervals[0])).toBe("8:00 AM – 12:00 PM");
    expect(formatHoursRow(row)).toBe("8:00 AM – 12:00 PM, 4:00 PM – 10:00 PM");
  });
});

describe("dates", () => {
  it("formats a coarse though readable long date", () => {
    const formatted = formatDateLong(new Date(2026, 4, 15));
    expect(formatted).not.toBe("—");
    expect(formatted).toContain("2026");
  });

  it("returns a dash for an invalid date", () => {
    expect(formatDateLong("not-a-date")).toBe("—");
  });

  it("round-trips a local ISO date without drifting a day", () => {
    const iso = todayIsoLocal(new Date(2026, 0, 3));
    expect(iso).toBe("2026-01-03");

    const parsed = parseIsoDateLocal(iso);
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(0);
    expect(parsed?.getDate()).toBe(3);
  });

  it("rejects a date that does not exist", () => {
    expect(parseIsoDateLocal("2026-02-31")).toBeNull();
    expect(parseIsoDateLocal("15/05/2026")).toBeNull();
  });
});

describe("formatAmount", () => {
  it("keeps a value and its unit together", () => {
    expect(formatAmount(240, "g")).toBe("240 g");
  });
});
