import React from "react";
import type { DashboardSnapshot } from "../../shared/domain/vault-model";

type Props = { snapshot: DashboardSnapshot };

export function DashboardPage({ snapshot }: Props): JSX.Element {
  return (
    <section>
      <h1>Dashboard</h1>
      <p data-testid="vault-path">{snapshot.activeVaultPath}</p>
      <p data-testid="company-count">Companies: {snapshot.companyCount}</p>
      <p data-testid="contact-count">Contacts: {snapshot.contactCount}</p>
      <p data-testid="task-status">Tasks: {snapshot.taskIntegrationStatus}</p>
    </section>
  );
}
