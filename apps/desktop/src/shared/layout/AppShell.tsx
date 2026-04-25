import React from "react";
import { APP_ROUTES } from "../../app/routes";
import { DashboardPage } from "../../features/dashboard/DashboardPage";
import { CompaniesPage } from "../../features/companies/CompaniesPage";
import { ContactsPage } from "../../features/contacts/ContactsPage";
import { LeadsPage } from "../../features/leads/LeadsPage";

type RouteKey = keyof typeof APP_ROUTES;

export function AppShell(): JSX.Element {
  const [active, setActive] = React.useState<RouteKey>("dashboard");

  const snapshot = {
    activeVaultPath: "D:/crm-vault",
    companyCount: 0,
    contactCount: 0,
    taskIntegrationStatus: "not_configured" as const,
    capturedAt: new Date().toISOString()
  };

  return (
    <div>
      <nav>
        <button onClick={() => setActive("dashboard")}>Dashboard</button>
        <button onClick={() => setActive("companies")}>Companies</button>
        <button onClick={() => setActive("contacts")}>Contacts</button>
        <button onClick={() => setActive("leads")}>Leads</button>
        <button onClick={() => setActive("settings")}>Settings</button>
      </nav>
      <main>
        {active === "dashboard" && <DashboardPage snapshot={snapshot} />}
        {active === "companies" && <CompaniesPage />}
        {active === "contacts" && <ContactsPage />}
        {active === "leads" && <LeadsPage />}
        {active === "settings" && <section><h1>Settings</h1></section>}
      </main>
    </div>
  );
}
