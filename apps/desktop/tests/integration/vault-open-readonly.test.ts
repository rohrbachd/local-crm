import { describe, expect, it } from "vitest";
import { shouldBlockReadonlyOrInaccessiblePath } from "../../src/shared/services/vault-rules";

describe("read-only and inaccessible path handling", () => {
  it("blocks readonly path", () => {
    expect(shouldBlockReadonlyOrInaccessiblePath(false, true)).toBe(true);
  });

  it("blocks inaccessible path", () => {
    expect(shouldBlockReadonlyOrInaccessiblePath(true, false)).toBe(true);
  });

  it("allows writable and accessible path", () => {
    expect(shouldBlockReadonlyOrInaccessiblePath(true, true)).toBe(false);
  });
});
