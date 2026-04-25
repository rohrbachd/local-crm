import { describe, expect, it } from "vitest";
import { getDashboardSnapshot } from "../../src/shared/services/dashboard-client";

describe("dashboard snapshot", () => {
  it("returns required fields for phase 0", async () => {
    const snapshot = await getDashboardSnapshot();
    expect(snapshot.companyCount).toBeGreaterThanOrEqual(0);
    expect(snapshot.contactCount).toBeGreaterThanOrEqual(0);
    expect(snapshot.taskIntegrationStatus).toBe("not_configured");
  });
});
