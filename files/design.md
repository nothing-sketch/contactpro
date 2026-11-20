# design.md — ContractPro Design System

One consistent system: **navy sidebar, light content area, blue primary actions**, clear tables, search/filter controls, status labels, responsive layouts, reusable forms. Derived from the dashboard mockups; mockups are illustrative, so tune values on first build.

---

## 1. Color

### Brand and layout
| Token | Hex | Use |
|---|---|---|
| `--navy-900` | `#0B1B3A` | Sidebar, top header, table header on dark cards |
| `--navy-800` | `#10244A` | Sidebar hover, module card headers |
| `--navy-700` | `#1B3366` | Sidebar active background |
| `--primary-600` | `#2563EB` | Primary buttons, links, active nav, chart line (profit) |
| `--primary-700` | `#1D4FD7` | Primary hover |
| `--primary-50` | `#EFF4FF` | Info callouts, selected rows |
| `--bg-app` | `#F4F6FB` | Page background |
| `--surface` | `#FFFFFF` | Cards, tables, forms |
| `--border` | `#E3E8F2` | Card and table borders |
| `--text-strong` | `#0F172A` | Headings |
| `--text` | `#334155` | Body text |
| `--text-muted` | `#64748B` | Labels, captions |

### Semantic (status)
| Meaning | Text/Icon | Background | Used for |
|---|---|---|---|
| Success | `#15803D` | `#DCFCE7` | Paid, Confirmed, Received, Running, Balanced |
| Warning | `#B45309` / accent `#F59E0B` | `#FEF3C7` | Pending, Due soon, Trial |
| Danger | `#B91C1C` | `#FEE2E2` | Overdue, Disputed, Short payment, errors |
| Info | `#1D4ED8` | `#DBEAFE` | Draft, informational |
| Neutral | `#475569` | `#F1F5F9` | Not sent, Closed, Cancelled |

### Domain color coding (from the system map)
| Group | Text | Fill | Border |
|---|---|---|---|
| **AI agents (draft only)** | `#3C3489` | `#EDEBFC` | `#5B4FC4` |
| **Rules and records (core, money)** | `#0F6E56` | `#E1F5EE` | `#0F8A68` |
| **Inputs and outputs** | `#1F2937` | `#FAFAF9` | `#D4D4D0` |

AI-generated content must always carry the purple treatment (badge "AI draft") so it is never mistaken for approved data.

### KPI card gradients (dashboard)
| Card | Gradient |
|---|---|
| Contracts | `#2563EB → #1D4ED8` (blue) |
| Profit | `#10B981 → #059669` (green) |
| Received (cheques) | `#7C3AED → #6D28D9` (purple) |
| Pending / follow-ups | `#F59E0B → #F97316` (orange) |

Charts: Profit `#2563EB`, Expenses `#F59E0B`, Received `#7C3AED`, extra `#10B981`. Never rely on color alone: pair with icon or text label.

### Dark mode
Not in v1. Define tokens as CSS variables so it can be added later. Public portal stays light.

---

## 2. Fonts and Typography

### Font families
- **UI and body:** `Inter`, fallback `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- **Numbers in tables/ledgers:** Inter with `font-variant-numeric: tabular-nums`
- **Bangla text (if used):** `Noto Sans Bengali` (fallback `Hind Siliguri`)
- **Code / IDs / tokens:** `JetBrains Mono`, fallback `ui-monospace, monospace`

### Type scale
| Style | Size / Line | Weight | Use |
|---|---|---|---|
| Display | 30 / 38 | 700 | Login, empty-state hero |
| H1 page title | 24 / 32 | 700 | Page header |
| H2 section | 20 / 28 | 600 | Card/section title |
| H3 | 16 / 24 | 600 | Sub-section, module header |
| Body | 14 / 22 | 400 | Default text, tables |
| Body large | 16 / 24 | 400 | Portal (subcontractor) pages, mobile |
| Label | 12 / 16 | 500 | Form labels, table headers (uppercase optional, `0.02em` tracking) |
| Caption | 12 / 16 | 400 | Helper text, timestamps |
| KPI number | 28 / 32 | 700 | Dashboard cards |

Rules: max line length ~70 characters for prose; sentence case for headings and buttons; right-align numeric columns; money format `৳1,23,456.00` (Bangladeshi digit grouping via `en-BD`, always 2 decimals in ledgers, may omit in KPI cards); dates `DD-MM-YYYY` or `22 Nov 2026`, consistently.

---

## 3. Spacing, Shape, Elevation

- Spacing scale: 4, 8, 12, 16, 24, 32, 48 px (Tailwind `1, 2, 3, 4, 6, 8, 12`).
- Radius: inputs/buttons `8px`, cards `12px`, badges `999px`, modals `16px`.
- Shadow: cards `0 1px 2px rgba(15,23,42,.06)`; modals/popovers `0 10px 30px rgba(15,23,42,.18)`.
- Borders: 1px `--border`; focus ring 2px `--primary-600` with 2px offset.
- Layout: sidebar 240px (collapsible to 72px, drawer on mobile), top bar 64px, content max width 1440px, 12-column grid, 24px gutters.

---

## 4. Components

### Layout
- **Sidebar:** navy, grouped (Core, Money out, Reports & AI), active item `--navy-700` with left accent `--primary-600`, icon + label.
- **Top bar:** page title, global search, notification bell with red count badge, user menu.
- **Page header:** title, breadcrumb, primary action on the right.

### Buttons
| Type | Style |
|---|---|
| Primary | `--primary-600` fill, white text |
| Secondary | white, 1px border, dark text |
| Danger | red fill (delete, reject) |
| Success | green fill (Confirm, Approve payment) |
| Ghost | text only (table row actions) |
Height 40px (44px on mobile portal). Disabled at 50% opacity with `not-allowed`. Loading state shows spinner and blocks double submit.

### Tables
White card, header `#F8FAFC` with muted uppercase labels, row height 48px, hover `--primary-50`, sticky header, pagination, search + filter bar above, row actions as icon buttons (edit, delete, view). Mobile: horizontal scroll or card list.

### Status badges
Pill shape, 12px text, semantic colors above. Standard labels:
`Draft` (info) · `Trial` (warning) · `Running` (success) · `Work Complete` (primary) · `Billed` (purple) · `Cheque Received` (success) · `Sub Paid` (success) · `Closed` (neutral) · `Cancelled` (neutral) · `Pending Confirmation` (warning) · `Confirmed` (success) · `Disputed` (danger).

### Forms
Label above field, 40px inputs, helper text under, inline error in red with icon, required marker, Zod-driven validation, money inputs with ৳ prefix, percent inputs with % suffix, selects for master data with search.

### Cards
- **KPI card:** gradient, icon, big number, small trend (↑ 12%).
- **Module/Info card:** white, 12px radius, header row with title and action.
- **Progress bar:** 8px, green fill, % label, milestone dots.

### Feedback
Toasts (top-right), inline alerts, confirm modals for irreversible actions (Approve, Confirm, Close contract), skeleton loaders, friendly empty states with next action.

### AI draft review screen
Two-pane: original document (left), extracted fields (right) each with confidence chip (High green / Medium amber / Low red) and "view source" link; buttons **Save Draft · Edit · Approve**. Purple "AI draft" banner on top. Uncertain amounts are never pre-accepted.

### Charts
Recharts, rounded line/bar, light grid `#E5E7EB`, tooltips with ৳ values, legend on top, accessible labels.

---

## 5. Subcontractor Portal (public, mobile-first)

- Light background, large type (16px body), 44px+ tap targets, single column, max width 480px.
- Header: ContractPro logo + subcontractor name.
- Payment card: contract ref, amount (KPI size), date, method, reference, Already paid, Due.
- PIN/OTP step with numeric keypad input, attempts remaining text.
- Buttons: **Confirm** (green), **Dispute** (red outline) with reason field.
- Result screen: large green check "Payment Confirmed", date and amount, "View my history".
- Error screens (expired / invalid / already confirmed): neutral, friendly text, "Contact the office", no technical detail.
- No sensitive bank data on the page.

---

## 6. Iconography and Imagery

- lucide-react, 20px default, 1.75 stroke; consistent per module (contracts: file-text, rules: settings, payments: wallet, cheques: credit-card, agents: bot/sparkles, alerts: bell).
- Logo: handshake mark on navy; "ContractPro — Automate · Track · Calculate · Grow".
- Mockups are illustrative; never use live-looking fake prices or tenders in production UI. Mark sample data clearly.

---

## 7. Responsiveness and Accessibility

- Breakpoints: 640 / 768 / 1024 / 1280 px. Mobile-first for portal and approvals.
- Text contrast WCAG AA (4.5:1) minimum; status never conveyed by color alone.
- Keyboard navigable, visible focus, labels on every input, `aria-live` for toasts, reduced-motion respected.
- Motion: 150–200ms ease-out transitions only; no decorative animation.

---

## 8. Tailwind Token Starter

```ts
// tailwind.config.ts (excerpt)
theme: {
  extend: {
    colors: {
      navy: { 900: '#0B1B3A', 800: '#10244A', 700: '#1B3366' },
      primary: { 50: '#EFF4FF', 600: '#2563EB', 700: '#1D4FD7' },
      app: '#F4F6FB',
      ai: { text: '#3C3489', bg: '#EDEBFC', border: '#5B4FC4' },
      rules: { text: '#0F6E56', bg: '#E1F5EE', border: '#0F8A68' },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      bn: ['Noto Sans Bengali', 'Hind Siliguri', 'sans-serif'],
      mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
    },
    borderRadius: { card: '12px', control: '8px' },
  },
}
```
