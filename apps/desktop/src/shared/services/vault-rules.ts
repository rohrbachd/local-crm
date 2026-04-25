export type FileSnapshot = { path: string; mtimeMs: number; size: number };

export function requiresExplicitConfirmationForNonEmptyFolder(isNonEmpty: boolean, confirmWrite: boolean): boolean {
  return !isNonEmpty || confirmWrite;
}

export function openIncompatibleFolderPolicy(isCompatible: boolean): { blockOpen: boolean; canInitializeInstead: boolean } {
  if (isCompatible) {
    return { blockOpen: false, canInitializeInstead: false };
  }
  return { blockOpen: true, canInitializeInstead: true };
}

export function shouldBlockReadonlyOrInaccessiblePath(isWritable: boolean, isAccessible: boolean): boolean {
  return !isWritable || !isAccessible;
}

export function supportsSpecialCharacterPath(vaultPath: string): boolean {
  return vaultPath.trim().length > 0;
}

export function hasOpenOnlyMutation(before: FileSnapshot[], after: FileSnapshot[]): boolean {
  const beforeMap = new Map(before.map((f) => [f.path, `${f.mtimeMs}:${f.size}`]));
  const afterMap = new Map(after.map((f) => [f.path, `${f.mtimeMs}:${f.size}`]));

  if (beforeMap.size !== afterMap.size) return true;
  for (const [path, sig] of beforeMap.entries()) {
    if (!afterMap.has(path)) return true;
    if (afterMap.get(path) !== sig) return true;
  }
  return false;
}

export function evaluateRollbackResult(createdCount: number, removedCount: number): { rollbackComplete: boolean; markInvalid: boolean } {
  const rollbackComplete = removedCount >= createdCount;
  return {
    rollbackComplete,
    markInvalid: !rollbackComplete
  };
}
