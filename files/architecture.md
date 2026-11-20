# architecture.md — ContractPro

## 1. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + TypeScript + Vite, Tailwind CSS | Admin/manager dashboard and subcontractor mobile portal |
| UI state / data | TanStack Query, React Hook Form, Zod, React Router | Server state, forms, validation, routing |
| Main backend | Node.js + NestJS (TypeScript) | APIs, permissions, business rules, transactions. **Source of truth for financial state** |
| Database | PostgreSQL (managed, e.g. Supabase, or VPS) | Contracts, rules, payments, ledgers, audit logs |
| ORM / migrations | Prisma (or TypeORM) | Typed schema and versioned migrations |
| AI service | Python + FastAPI + LLM API (OpenAI) | OCR, document extraction, agents, insights |
| Background jobs | BullMQ + Redis (or pg-boss), scheduler | Reminders, imports, reports, retryable tasks |
| File storage | S3-compatible object storage | Original PDFs, receipts, bills, photos, generated reports |
| Messaging | SMS / WhatsApp provider (verify Bangladesh availability and cost) | Payment links, reminders, alerts |
| Auth | JWT access + refresh tokens, argon2/bcrypt, optional TOTP | Staff login and roles |
| Deployment | Docker, GitHub Actions, VPS/cloud, HTTPS | Repeatable deploys |
| Testing | Jest (API), Vitest + Testing Library (web), Playwright (E2E), pytest (AI) | Quality |
| Dev tools | VS Code/Cursor, GitHub, Figma, Postman | Workflow |

C# is **not** required.

---

## 2. System Flow

### 2.1 High-level architecture

```
                    ┌───────────────────────────┐
                    │  React Web App (Admin)    │
                    │  React Portal (Subcon.)   │
                    └──────────────┬────────────┘
                                   │ HTTPS / REST (JSON)
                    ┌──────────────▼────────────┐
                    │   NestJS API (core)        │
                    │  auth · rules · contracts  │
                    │  payments · ledger · audit │
                    └───┬────────┬───────────┬───┘
                        │        │           │
              ┌─────────▼──┐ ┌───▼─────┐ ┌───▼──────────┐
              │ PostgreSQL │ │ Redis / │ │ Object store │
              │            │ │ Queue   │ │ (PDF, photos)│
              └────────────┘ └───┬─────┘ └──────────────┘
                                 │ jobs
                    ┌────────────▼────────────┐
                    │  Workers + Scheduler    │──► SMS / WhatsApp provider
                    └────────────┬────────────┘
                                 │ controlled API calls only
                    ┌────────────▼────────────┐
                    │ FastAPI AI Service      │──► LLM API / OCR
                    │ agents (draft only)     │
                    └─────────────────────────┘
```

### 2.2 Layers of the product (from the system map)

1. **Inputs:** Work order · Project PDF · Receipt · Office cheque
2. **AI agents (draft only):** Intake · Bill · Expense · Reconciliation
3. **Core (rules and records):** Master Data → Rule Engine → Contracts
4. **Money out / money in:** Subcontractors (ledger) · Payments (PIN, reminders) · Bills (PDF to office) · Cheques (expected, received)
5. **Outputs:** Dashboard · Reports · Alerts (SMS, WhatsApp) · AI Insights

### 2.3 Key flows

**A. Contract creation and profit**
1. Admin (or Intake Agent as draft) creates contract.
2. API loads the selected rule template **version**, calculates deductions, cheque and expected profit.
3. Admin approves → status Trial/Running; rule version is frozen on the contract.

**B. Subcontractor payment confirmation**
1. Accounts records payment (status `PENDING_CONFIRMATION`); API warns if amount exceeds balance.
2. API creates a random token, stores **only its hash** plus expiry.
3. Job sends link via SMS/WhatsApp.
4. Subcontractor opens link → verifies PIN/OTP (rate-limited) → Confirm or Dispute.
5. In **one DB transaction**: validate token, expiry, status; write confirmation; update ledger; write audit event. Record becomes immutable.
6. No response → Follow-up Agent reminds, switches channel, then raises dashboard alert.

**C. AI document flow (Intake / Bill / Expense)**
1. File uploaded to object storage; original is never modified.
2. API enqueues job → AI service extracts fields with per-field confidence and source page/line.
3. AI service posts a **draft** through a controlled API endpoint (never writes financial tables directly).
4. UI shows source document beside extracted fields; low confidence highlighted.
5. Human edits and approves → API saves the real record and triggers Rule Engine.

**D. Cheque reconciliation**
Bill submitted → expected cheque from saved rule version → actual cheque recorded → Reconciliation Agent diffs → flags short payment → human investigates → status advances.

### 2.4 Contract status machine

```
Draft → Trial → Running → Work Complete → Billed → Cheque Received → Sub Paid → Closed
   └──────────────────────────── Cancelled (from any non-closed state)
```
Closing requires: work complete, bill approved, cheque reconciled, sub payments confirmed.

### 2.5 Data model (core tables)

| Table | Key fields |
|---|---|
| users, roles | email, password_hash, role, locked_until, 2fa |
| units, places, firms, contract_types | master reference data |
| subcontractors | name, phone, whatsapp, pin_hash, default_share_pct, payout details |
| rule_templates | name, unit_id, contract_type_id, status |
| rule_template_versions | template_id, version, effective_from, created_by |
| rule_items | version_id, name, kind (`PERCENT`/`FIXED`), value, basis (`CONTRACT`/`CHEQUE`), sort |
| contracts | contract_no, unit_id, place_id, firm_id, type, value, status, template_version_id, subcontractor_id, share_pct, dates |
| contract_cas | contract_id, ca_number (unique per unit) |
| contract_rule_overrides | contract_id, rule_item, old, new, reason, user, at |
| progress_updates, milestones, progress_photos | contract_id, pct, note |
| bills, bill_items | contract_id, status, totals, source_file |
| cheques | contract_id, bill_id, number, date, expected, actual, diff, status |
| payments | contract_id, subcontractor_id, amount, method, reference, status |
| payment_confirmations | payment_id, token_hash, expires_at, verified_at, decision, dispute_reason, ip/device |
| ledger_entries | subcontractor_id, contract_id, type, amount, ref_id, linked_adjustment_id |
| expenses | contract_id, category, vendor, amount, date, source_file, status |
| prices, price_history | item, unit, price, source, effective_date |
| tenders, tender_sources (P2) | source_url, tender_id, deadline, collected_at |
| ai_drafts | type, source_file, extracted_json, confidence_json, status, approved_by |
| notifications, notification_attempts | channel, status, attempts log |
| audit_logs | actor (user/agent), action, entity, old, new, at |
| files | storage_key, hash, mime, uploaded_by |

Money columns use `NUMERIC(14,2)`. Never floats.

### 2.6 API groups (REST, `/api/v1`)

`/auth` · `/users` · `/master/{units,places,firms,subcontractors,types}` · `/rules` · `/contracts` · `/contracts/:id/duplicate` · `/progress` · `/payments` · `/public/payment-confirm/:token` (rate-limited, no staff auth) · `/ledger` · `/bills` · `/cheques` · `/reconciliation` · `/prices` · `/expenses` · `/reports` · `/dashboard` · `/notifications` · `/ai/drafts` · `/audit` · `/files`

---

## 3. Folder and File Structure

Monorepo:

```
contractpro/
├── README.md
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   ├── rules.md
│   ├── phases.md
│   ├── design.md
│   ├── memory.md
│   ├── adr/                      # architecture decision records
│   └── sample-data/              # verified contract calculations (golden cases)
│
├── apps/
│   ├── web/                      # React + Tailwind
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.ts
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── app/              # router, providers, layout shell
│   │       ├── components/
│   │       │   ├── ui/           # Button, Input, Table, Badge, Modal, Card, StatCard
│   │       │   └── layout/       # Sidebar, Topbar, PageHeader
│   │       ├── features/
│   │       │   ├── auth/
│   │       │   ├── master-data/
│   │       │   ├── rules/
│   │       │   ├── contracts/
│   │       │   ├── progress/
│   │       │   ├── subcontractors/
│   │       │   ├── payments/
│   │       │   ├── bills/
│   │       │   ├── cheques/
│   │       │   ├── expenses/
│   │       │   ├── prices/
│   │       │   ├── reports/
│   │       │   ├── dashboard/
│   │       │   ├── notifications/
│   │       │   ├── ai-center/
│   │       │   ├── tenders/
│   │       │   └── audit/
│   │       ├── portal/           # subcontractor confirmation pages (public, mobile-first)
│   │       ├── lib/              # api client, formatters (৳, dates), zod schemas
│   │       ├── hooks/
│   │       └── styles/
│   │
│   └── api/                      # NestJS
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── common/           # guards, decorators, filters, interceptors, pipes
│       │   ├── config/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── master-data/
│       │   │   ├── rules/        # rule templates, versions, calculation engine
│       │   │   ├── contracts/
│       │   │   ├── progress/
│       │   │   ├── subcontractors/
│       │   │   ├── payments/
│       │   │   ├── confirmations/
│       │   │   ├── ledger/
│       │   │   ├── bills/
│       │   │   ├── cheques/
│       │   │   ├── reconciliation/
│       │   │   ├── prices/
│       │   │   ├── expenses/
│       │   │   ├── reports/
│       │   │   ├── dashboard/
│       │   │   ├── notifications/
│       │   │   ├── ai-drafts/    # receives drafts from AI service
│       │   │   ├── tenders/
│       │   │   ├── files/
│       │   │   └── audit/
│       │   ├── jobs/             # queue processors, schedulers
│       │   └── integrations/     # sms, whatsapp, storage clients
│       └── test/
│
├── services/
│   └── ai/                       # Python FastAPI
│       ├── app/
│       │   ├── main.py
│       │   ├── api/              # /extract/work-order, /extract/bill, /extract/expense, /insights
│       │   ├── agents/           # intake, bill, expense, reconciliation, watchdog, report, followup
│       │   ├── extraction/       # pdf text, ocr, schema validation, confidence
│       │   ├── clients/          # core_api client (controlled endpoints), llm client
│       │   ├── prompts/
│       │   └── schemas/          # pydantic models
│       ├── tests/
│       └── requirements.txt
│
├── packages/
│   └── shared/                   # shared TS types, enums (statuses), constants
│
├── infra/
│   ├── docker/
│   │   ├── web.Dockerfile
│   │   ├── api.Dockerfile
│   │   └── ai.Dockerfile
│   ├── docker-compose.yml        # web, api, ai, postgres, redis
│   ├── nginx/
│   └── scripts/                  # backup.sh, restore.sh
│
├── .github/workflows/            # ci.yml, deploy.yml
├── .env.example
└── package.json                  # workspaces
```

---

## 4. Architecture Rules (summary)

- NestJS owns all financial state changes. The AI service calls controlled APIs and never edits financial tables.
- Slow/retryable work (OCR, reminders, imports, reports) goes through the queue.
- Payment confirmation and ledger updates use DB transactions.
- Secrets live in environment variables / secret storage, never in source.
- Rule engine is a pure, unit-tested function: `(contract inputs, rule version) → breakdown`.
- See `rules.md` for the full do/avoid list.
