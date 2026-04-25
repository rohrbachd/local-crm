import { describe, expect, it } from "vitest";
import { evaluateRollbackResult } from "../../src/shared/services/vault-rules";

describe("partial initialization rollback", () => {
  it("marks vault invalid when rollback incomplete", () => {
    const result = evaluateRollbackResult(5, 3);
    expect(result.rollbackComplete).toBe(false);
    expect(result.markInvalid).toBe(true);
  });

  it("does not mark invalid when rollback complete", () => {
    const result = evaluateRollbackResult(5, 5);
    expect(result.rollbackComplete).toBe(true);
    expect(result.markInvalid).toBe(false);
  });
});
