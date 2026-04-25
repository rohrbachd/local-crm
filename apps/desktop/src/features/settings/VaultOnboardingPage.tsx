import React from "react";

type Props = {
  onCreate: (vaultPath: string) => void;
  onOpen: (vaultPath: string) => void;
};

export function VaultOnboardingPage({ onCreate, onOpen }: Props): JSX.Element {
  const [vaultPath, setVaultPath] = React.useState("");

  return (
    <section>
      <h1>Vault Setup</h1>
      <input
        aria-label="vault-path"
        value={vaultPath}
        onChange={(e) => setVaultPath(e.target.value)}
        placeholder="D:/crm-vault"
      />
      <button onClick={() => onCreate(vaultPath)}>Create CRM Vault</button>
      <button onClick={() => onOpen(vaultPath)}>Open Existing Vault</button>
    </section>
  );
}
