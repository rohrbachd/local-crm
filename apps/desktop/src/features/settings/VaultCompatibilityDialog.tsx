import React from "react";

type Props = {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function VaultCompatibilityDialog({ isOpen, message, onConfirm, onCancel }: Props): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="vault-compatibility-dialog">
      <h2>Compatibility Warning</h2>
      <p>{message}</p>
      <button onClick={onConfirm}>Initialize This Folder</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
