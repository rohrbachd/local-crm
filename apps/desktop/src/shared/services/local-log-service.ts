import * as path from "node:path";
import { APP_LOG_FILE, LOG_RETENTION_DAYS } from "../constants/vault";
import type { StructuredLogEvent } from "../domain/vault-model";
import type { FilesystemAdapter } from "./filesystem-adapter";

export async function logEvent(fs: FilesystemAdapter, appDataPath: string, event: StructuredLogEvent): Promise<void> {
  const logPath = path.join(appDataPath, APP_LOG_FILE);
  const line = JSON.stringify(event);

  let current = "";
  if (await fs.fileExists(logPath)) {
    current = await fs.readFile(logPath);
  }
  const next = current.length > 0 ? `${current}\n${line}` : line;
  await fs.writeFile(logPath, next);

  await enforceLogRetention(fs, appDataPath, LOG_RETENTION_DAYS);
}

export async function enforceLogRetention(fs: FilesystemAdapter, appDataPath: string, retentionDays: number): Promise<void> {
  const logPath = path.join(appDataPath, APP_LOG_FILE);
  if (!(await fs.fileExists(logPath))) return;
  const raw = await fs.readFile(logPath);
  const threshold = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  const kept = raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => {
      try {
        const parsed = JSON.parse(line) as { timestamp?: string };
        if (!parsed.timestamp) return false;
        return Date.parse(parsed.timestamp) >= threshold;
      } catch {
        return false;
      }
    });

  await fs.writeFile(logPath, kept.join("\n"));
}
