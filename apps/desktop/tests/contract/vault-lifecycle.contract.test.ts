import { describe, expect, it } from "vitest";
import { buildInitializeRequest, buildOpenRequest, classifyOpenResponse } from "../../src/shared/services/vault-client";

describe("vault lifecycle contract behavior", () => {
  it("builds initialize request with mandatory fields", () => {
    const req = buildInitializeRequest("D:/crm", true, true);
    expect(req.vaultPath).toBe("D:/crm");
    expect(req.confirmWrite).toBe(true);
  });

  it("builds open request with vault path", () => {
    const req = buildOpenRequest("D:/crm");
    expect(req.vaultPath).toBe("D:/crm");
  });

  it("maps 409 open response to incompatible policy", () => {
    const result = classifyOpenResponse(409);
    expect(result.blockOpen).toBe(true);
    expect(result.canInitializeInstead).toBe(true);
  });
});
