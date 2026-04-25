import React from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "./shared/layout/AppShell";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>
);
