import { describe, expect, it } from "vitest";
import {
  buildGeneralEnquiryMessage,
  buildItemEnquiryMessage,
  buildTelUrl,
  buildWhatsAppUrl,
  isPlausibleWhatsAppNumber,
  isWhatsAppConfigured,
  normalisePhone,
} from "@/lib/whatsapp";

describe("normalisePhone", () => {
  it("keeps digits only", () => {
    expect(normalisePhone("+91 98765 43210")).toBe("919876543210");
    expect(normalisePhone("(020) 1234-5678")).toBe("02012345678");
  });

  it("survives an empty or missing value", () => {
    expect(normalisePhone("")).toBe("");
    expect(normalisePhone(undefined as unknown as string)).toBe("");
  });
});

describe("isPlausibleWhatsAppNumber", () => {
  it("accepts international-format numbers between 10 and 15 digits", () => {
    expect(isPlausibleWhatsAppNumber("919876543210")).toBe(true);
    expect(isPlausibleWhatsAppNumber("+91 98765 43210")).toBe(true);
    expect(isPlausibleWhatsAppNumber("123456789012345")).toBe(true);
  });

  it("rejects numbers that are too short or too long", () => {
    expect(isPlausibleWhatsAppNumber("987654321")).toBe(false);
    expect(isPlausibleWhatsAppNumber("1234567890123456")).toBe(false);
  });

  it("rejects numbers starting with a trunk zero", () => {
    expect(isPlausibleWhatsAppNumber("09876543210")).toBe(false);
  });

  it("rejects an empty value", () => {
    expect(isPlausibleWhatsAppNumber("")).toBe(false);
  });
});

describe("buildWhatsAppUrl", () => {
  it("encodes the message rather than hand-building the query string", () => {
    const url = buildWhatsAppUrl("Hello SŌL & friends\nSecond line", "919876543210");

    expect(url).not.toBeNull();
    expect(url).toContain("https://wa.me/919876543210?text=");
    expect(url).toContain("%26");
    expect(url).toContain("%0A");
    expect(url).not.toContain("\n");
    expect(url).not.toContain(" ");
  });

  it("returns null when no plausible number is configured, so callers can fall back", () => {
    expect(buildWhatsAppUrl("hello", "")).toBeNull();
    expect(buildWhatsAppUrl("hello", "12345")).toBeNull();
    expect(buildWhatsAppUrl("hello", "0100000000000")).toBeNull();
  });

  it("uses the configured café number by default", () => {
    // The shipped demonstration number is intentionally unreachable but plausible.
    expect(isWhatsAppConfigured()).toBe(true);
    expect(buildWhatsAppUrl("hello")).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });
});

describe("buildTelUrl", () => {
  it("builds an E.164-style tel link", () => {
    expect(buildTelUrl("+91 98765 43210")).toBe("tel:+919876543210");
  });

  it("returns null when the number is unusably short", () => {
    expect(buildTelUrl("1234567")).toBeNull();
    expect(buildTelUrl("")).toBeNull();
  });
});

describe("enquiry messages", () => {
  it("asks about availability without implying an order was placed or a system exists", () => {
    const message = buildItemEnquiryMessage("Flat White", "₹220");
    expect(message).toContain("Flat White");
    expect(message).toContain("₹220");
    expect(message.toLowerCase()).toContain("ask about");
    expect(message.toLowerCase()).toContain("available");
    expect(message.toLowerCase()).not.toContain("order");
  });

  it("produces a plain, readable general enquiry", () => {
    expect(buildGeneralEnquiryMessage()).toContain("SŌL");
  });
});
