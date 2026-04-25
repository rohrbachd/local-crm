import { describe, expect, it } from "vitest";
import { hasOpenOnlyMutation } from "../../src/shared/services/vault-rules";

describe("open-only mutation guard", () => {
  it("detects no mutation when snapshots are identical", () => {
    const before = [{ path: "a.md", mtimeMs: 1, size: 100 }];
    const after = [{ path: "a.md", mtimeMs: 1, size: 100 }];
    expect(hasOpenOnlyMutation(before, after)).toBe(false);
  });

  it("detects mutation when timestamp changes", () => {
    const before = [{ path: "a.md", mtimeMs: 1, size: 100 }];
    const after = [{ path: "a.md", mtimeMs: 2, size: 100 }];
    expect(hasOpenOnlyMutation(before, after)).toBe(true);
  });
});
