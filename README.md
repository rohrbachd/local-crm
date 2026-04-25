# local-crm

## Run Locally

### 1. Install dependencies

```powershell
cd apps/desktop
npm install
```

### 2. Start the app (web shell)

```powershell
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

### 3. Run validation checks

```powershell
npm run test
npm run lint
npm run build
```

## Native Desktop (Tauri) Optional

If you want to run the native desktop shell instead of web-only Vite:

1. Install Rust and Cargo.
2. Install Tauri CLI:

```powershell
cargo install tauri-cli --version "^2.0.0"
```

3. From `apps/desktop/src-tauri`, run:

```powershell
cargo tauri dev
```

## Phase 0 Manual Test Flow

Use `specs/001-vault-shell-setup/quickstart.md` for the full create/open/recovery validation checklist.
