import * as path from "node:path";
import * as fs from "node:fs/promises";

export async function rollbackCreatedArtifacts(vaultPath: string, createdRelativePaths: string[]): Promise<{ rollbackComplete: boolean; failedPaths: string[] }> {
  const failedPaths: string[] = [];

  for (const rel of [...createdRelativePaths].reverse()) {
    const target = path.join(vaultPath, rel);
    try {
      await fs.rm(target, { recursive: true, force: true });
    } catch {
      failedPaths.push(target);
    }
  }

  return { rollbackComplete: failedPaths.length === 0, failedPaths };
}
