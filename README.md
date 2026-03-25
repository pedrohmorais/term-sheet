# TermSheet — Real Estate Deal Manager

A clean, scalable Angular 17 application for managing real estate deals.

## Tech Stack

- **Angular 17** (standalone components, no NgModules)
- **RxJS** — BehaviorSubject-driven state management
- **Reactive Forms** — typed form controls with validation
- **SCSS** — design tokens via CSS custom properties
- **Lazy-loaded routes** — each feature loads on demand

## Getting Started

```bash
npm install
npm start
# → http://localhost:4200
```

### Demo Credentials

| Username | Password  |
|----------|-----------|
| admin    | admin123  |
| demo     | demo123   |

## Project Structure

```
src/
├── app/
│   ├── core/                     # Singleton services, guards, models
│   │   ├── guards/
│   │   │   └── auth.guard.ts     # authGuard + publicGuard (functional)
│   │   ├── models/
│   │   │   ├── deal.model.ts     # Deal, CreateDealDto, DealFilters
│   │   │   └── user.model.ts     # User, LoginCredentials, AuthState
│   │   ├── services/
│   │   │   ├── auth.service.ts   # Session auth with BehaviorSubject state
│   │   │   └── deal.service.ts   # Deal CRUD + reactive filter pipeline
│   │   └── utils/
│   │       └── uuid.util.ts      # Lightweight ID generator
│   │
│   ├── shared/                   # Reusable, feature-agnostic pieces
│   │   ├── components/
│   │   │   ├── header/           # App shell header
│   │   │   └── highlight-text/   # Search term highlighting component
│   │   └── pipes/
│   │       ├── usd-currency.pipe.ts   # $1,234,000 formatter
│   │       └── cap-rate-status.pipe.ts # low | healthy | high
│   │
│   └── features/
│       ├── auth/
│       │   └── login/            # Login page
│       └── deals/
│           ├── deal-list/        # Main table view
│           ├── deal-filters/     # Filter bar (name + price range)
│           └── deal-form/        # Add deal form with cap rate preview
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.scss                   # Global design system tokens + base styles
```

## Architecture Decisions

### Standalone Components (Angular 17)
Every component uses `standalone: true`, eliminating NgModules entirely. This is the Angular 17 recommended approach — simpler tree-shaking, explicit dependency declarations, and better lazy loading.

### BehaviorSubject State Management
Rather than introducing NgRx for an app of this size, state is managed via `BehaviorSubject` streams inside services:

- `AuthService._state$` — holds full `AuthState` (user, isLoading, error)
- `DealService._deals$` — source of truth for all deals
- `DealService._filters$` — filter criteria
- `DealService.filteredDeals$` — derived via `combineLatest`, auto-updates whenever deals or filters change

This pattern mirrors the Redux idea (single source of truth, derived state) without the boilerplate.

### Reactive Forms + Typed Controls
All forms use `FormBuilder` with explicit types. Validation is declared in the model layer, not the template.

### Cap Rate is Always Computed
`capRate` is never stored as user input — it is always `(noi / purchasePrice) * 100`, computed both:
- Live in the form as a preview while the user types
- At save time inside `DealService.addDeal()`

### Lazy Routing
Both `LoginComponent` and `DealListComponent` are loaded via `loadComponent()`, ensuring the initial bundle is minimal.

### Path Aliases
`tsconfig.json` defines `@core/*`, `@shared/*`, `@features/*` aliases so imports never rely on fragile relative paths like `../../../../`.

### Highlight Pipe / Component
`HighlightTextComponent` escapes HTML first (XSS-safe), then injects `<mark class="highlight">` tags around matching text. Used in the deal table to visually highlight the search term inside deal names.

### Cap Rate Color Coding
A realistic cap rate is 5–12%. The app communicates this:
- **Yellow badge** — below 5% (low yield)
- **Green badge** — 5–12% (healthy)
- **Blue badge** — above 12% (unusually high, may signal risk)
This logic lives in `CapRateStatusPipe` — a pure, testable transformation.

## 🧪 End-to-End Testing (Cypress)

This project uses **Cypress** for end-to-end (E2E) testing to ensure that critical user flows work as expected from a real user’s perspective.

**Cypress** is a modern testing framework that runs directly in the browser, providing fast, reliable, and consistent test execution. It is widely used in frontend applications because it allows developers to simulate real user interactions, catch regressions early, and improve overall application quality.

---

### 📦 Available Scripts

```bash
# Opens Cypress in interactive mode (GUI)
npm run e2e

# Runs all tests in headless mode (terminal only)
npm run e2e:headless

# Starts the application and runs E2E tests automatically
npm run e2e:dev
