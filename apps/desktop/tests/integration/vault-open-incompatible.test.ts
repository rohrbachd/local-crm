import { describe, expect, it } from "vitest";
import { openIncompatibleFolderPolicy } from "../../src/shared/services/vault-rules";

describe("incompatible open conversion option", () => {
  it("blocks open and offers initialize on incompatible folder", () => {
    const policy = openIncompatibleFolderPolicy(false);
    expect(policy.blockOpen).toBe(true);
    expect(policy.canInitializeInstead).toBe(true);
  });

  it("allows open for compatible folder", () => {
    const policy = openIncompatibleFolderPolicy(true);
    expect(policy.blockOpen).toBe(false);
    expect(policy.canInitializeInstead).toBe(false);
  });
});
