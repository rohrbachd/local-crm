import * as fs from "node:fs/promises";
import * as path from "node:path";
import { FileAccessDeniedError } from "../errors/crm-errors";

export interface FilesystemAdapter {
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: string): Promise<void>;
  fileExists(filePath: string): Promise<boolean>;
  ensureDir(dirPath: string): Promise<void>;
  listDir(dirPath: string): Promise<string[]>;
  stat(filePath: string): Promise<{ mtimeMs: number; size: number }>;
}

export class NodeFilesystemAdapter implements FilesystemAdapter {
  constructor(private readonly allowedRoots: string[] = []) {}

  private assertAllowed(targetPath: string): void {
    if (this.allowedRoots.length === 0) return;
    const absolute = path.resolve(targetPath);
    const allowed = this.allowedRoots.some((root) => absolute.startsWith(path.resolve(root)));
    if (!allowed) {
      throw new FileAccessDeniedError(absolute);
    }
  }

  async readFile(filePath: string): Promise<string> {
    this.assertAllowed(filePath);
    return fs.readFile(filePath, "utf8");
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    this.assertAllowed(filePath);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, "utf8");
  }

  async fileExists(filePath: string): Promise<boolean> {
    this.assertAllowed(filePath);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async ensureDir(dirPath: string): Promise<void> {
    this.assertAllowed(dirPath);
    await fs.mkdir(dirPath, { recursive: true });
  }

  async listDir(dirPath: string): Promise<string[]> {
    this.assertAllowed(dirPath);
    return fs.readdir(dirPath);
  }

  async stat(filePath: string): Promise<{ mtimeMs: number; size: number }> {
    this.assertAllowed(filePath);
    const s = await fs.stat(filePath);
    return { mtimeMs: s.mtimeMs, size: s.size };
  }
}
