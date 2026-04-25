import React from "react";

type Props = {
  title: string;
  details: string;
};

export function VaultRecoveryPanel({ title, details }: Props): JSX.Element {
  return (
    <aside aria-label="vault-recovery-panel">
      <h2>{title}</h2>
      <p>{details}</p>
      <ul>
        <li>Select another folder</li>
        <li>Reinitialize current folder</li>
        <li>Retry after permission fix</li>
      </ul>
    </aside>
  );
}
