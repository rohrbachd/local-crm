import { describe, expect, it } from "vitest";
import { validateStructuredLogEvent } from "../../src/shared/domain/validators";

describe("settings reset logging schema", () => {
  it("validates required structured log fields", () => {
    const event = {
      level: "error",
      code: "SETTINGS_RESET",
      timestamp: new Date().toISOString(),
      message: "reset"
    };
    expect(validateStructuredLogEvent(event)).toBe(true);
  });
});
