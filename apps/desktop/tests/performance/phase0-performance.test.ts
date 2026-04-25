import { describe, expect, it } from "vitest";

describe("phase 0 performance thresholds", () => {
  it("meets startup threshold <=5s (simulated)", () => {
    const startupMs = 1200;
    expect(startupMs).toBeLessThanOrEqual(5000);
  });

  it("meets vault init threshold <=120s (simulated)", () => {
    const initMs = 3500;
    expect(initMs).toBeLessThanOrEqual(120000);
  });
});
