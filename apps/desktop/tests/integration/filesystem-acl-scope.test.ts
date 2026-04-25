import { describe, expect, it } from "vitest";
import { NodeFilesystemAdapter } from "../../src/shared/services/filesystem-adapter";

describe("filesystem acl scope", () => {
  it("rejects out-of-scope paths", async () => {
    const fs = new NodeFilesystemAdapter(["D:/allowed/root"]);
    await expect(fs.fileExists("D:/outside/path/file.txt")).rejects.toBeTruthy();
  });
});
