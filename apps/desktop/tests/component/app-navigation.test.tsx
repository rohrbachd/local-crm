import { describe, expect, it } from "vitest";
import { APP_ROUTES } from "../../src/app/routes";

describe("app navigation routes", () => {
  it("contains all phase 0 routes", () => {
    expect(APP_ROUTES.dashboard).toBe("/dashboard");
    expect(APP_ROUTES.companies).toBe("/companies");
    expect(APP_ROUTES.contacts).toBe("/contacts");
    expect(APP_ROUTES.leads).toBe("/leads");
    expect(APP_ROUTES.settings).toBe("/settings");
  });
});
