import { describe, expect, it } from "vitest";
import { requiresExplicitConfirmationForNonEmptyFolder } from "../../src/shared/services/vault-rules";

describe("non-empty folder confirmation", () => {
  it("requires explicit confirmation for non-empty folder", () => {
    expect(requiresExplicitConfirmationForNonEmptyFolder(true, false)).toBe(false);
    expect(requiresExplicitConfirmationForNonEmptyFolder(true, true)).toBe(true);
  });

  it("does not require confirmation for empty folder", () => {
    expect(requiresExplicitConfirmationForNonEmptyFolder(false, false)).toBe(true);
  });
});
