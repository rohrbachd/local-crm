export const APP_ROUTES = {
  dashboard: "/dashboard",
  companies: "/companies",
  contacts: "/contacts",
  leads: "/leads",
  settings: "/settings"
} as const;

export type AppRouteKey = keyof typeof APP_ROUTES;
