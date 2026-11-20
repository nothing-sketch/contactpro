# phases.md — ContractPro Build Phases

Build one module at a time. Each phase ends with tests passing, a staging check with sample data, and an update to `memory.md`. Timelines are estimates for a learning-while-building solo developer; they are not promises.

---

## Phase 0 — Requirements & Design (1–2 weeks)
**Goal:** remove guesswork before code.
- [ ] Answer the open questions (PRD §7), above all the deduction percentages, bases and the 3.5% vs 3.4% advance.
- [ ] Collect 5–10 real contract examples from the Excel sheets with verified profit results (golden cases).
- [ ] List users, roles, contract fields, reports, approval steps.
- [ ] Wireframes (Figma) for Login, Contracts, Rule Engine, Subcontractor ledger, Payment link page.
- [ ] Database ERD, API list, status flow.
- [ ] Choose SMS/WhatsApp provider; choose hosting.

**Exit:** signed-off PRD, ERD, golden test cases.

---

## Phase 1 — Foundation (1–2 weeks)
- [ ] Monorepo, GitHub repo, branch rules, CI (lint, typecheck, test)
- [ ] Docker Compose: Postgres, Redis, API, web
- [ ] Prisma schema + first migrations + seed
- [ ] Auth: login, hashed passwords, JWT, roles (Admin, Accounts, Viewer), account lock
- [ ] Audit log service
- [ ] File storage service
- [ ] Web shell: sidebar, topbar, design tokens, base UI components

**Exit:** admin logs in, role guards proven by tests, audit entries written.

---

## Phase 2 — MVP Core: Master Data → Contracts → Rule Engine (3–4 weeks)
- [ ] Master Data CRUD: units, places, firms, subcontractors, contract types
- [ ] Rule templates with versions, items (percent/fixed, basis)
- [ ] Rule engine pure function + golden tests (৳330,000 → ৳70,232.50)
- [ ] Contract CRUD, statuses, duplicate-CA detection, bulk duplicate, Trial → Running
- [ ] One-contract override with reason + audit
- [ ] Contract detail page showing deduction breakdown
- [ ] Basic dashboard cards

**Exit:** first target met: Admin logs in, adds a subcontractor, creates a contract, picks a template, sees the correct expected profit. Replaces Excel profit work.

---

## Phase 3 — Money Out: Ledger & Payments (2–3 weeks)
- [ ] Subcontractor ledger (assigned, due, paid, balance)
- [ ] Payment recording with overpayment warning
- [ ] Reports v1: State of Piece Contract (K J Enterprise, AGE Kaptai), subcontractor balance; PDF/Excel export
- [ ] Reports reconcile with ledger totals (test)

**Exit:** manual monthly summary work removed.

---

## Phase 4 — Payment Confirmation & Notifications (2–3 weeks)
- [ ] Token generation (hashed, expiring), public confirmation endpoint
- [ ] PIN/OTP verification, attempt limits, Confirm / Dispute
- [ ] Mobile-first portal page + subcontractor history link
- [ ] SMS/WhatsApp integration with job queue
- [ ] Follow-up Agent v1 (rules-based reminders → channel switch → dashboard alert)
- [ ] Notification centre; immutable confirmed records
- [ ] Security tests: expired, reused, invalid, brute-force

**Exit:** payment disputes handled with timestamped confirmations.

---

## Phase 5 — Money In: Cheques & Reconciliation (2 weeks)
- [ ] Cheque recording, expected vs actual
- [ ] Reconciliation (rule-based first, agent summary later)
- [ ] Pending cheque ageing, receivable on dashboard
- [ ] Status auto-advance (Cheque Received → Sub Paid → Closed with close checks)

**Exit:** short payments flagged automatically.

---

## Phase 6 — Operations: Progress, Bills, Prices, Expenses (4 weeks)
- [ ] Progress and milestones, photos, deadline-risk alerts, handover trigger
- [ ] Price Management with history and stale flags
- [ ] Manual bill builder with live preview and PDF export
- [ ] Manual expense entry and actual-profit calculation
- [ ] Full dashboard and extra reports (project profit, expense, annual)

**Exit:** expected vs actual profit per contract.

---

## Phase 7 — AI Agents (4–5 weeks)
Order: Intake → Bill → Expense → Reconciliation summary → Daily Briefing → Profit Watchdog → Monthly Report → Insights.
- [ ] FastAPI service, controlled API client, agent service account
- [ ] Draft review UI: source document beside extracted fields, confidence flags
- [ ] Intake Agent (PDF/photo/WhatsApp text → draft contract)
- [ ] Bill Agent (project PDF → items → rates → totals check)
- [ ] Expense Agent (receipt/message → draft)
- [ ] Daily Briefing, Profit Watchdog, Monthly Report Agent
- [ ] AI Insights (plain-language Q&A from verified data)
- [ ] Extraction accuracy tests against real documents; prompt-injection tests

**Exit:** all agents produce drafts only; approvals and audit logs verified.

---

## Phase 8 — External Sources (P2, 3+ weeks)
- [ ] Verify permission, reliability and data format for each source
- [ ] One approved collector at a time (API/feed/permitted download), manual upload fallback
- [ ] Tender aggregator: list, favourites, deadline alerts, duplicate detection
- [ ] Equipment price comparison: normalised specs, equivalent-only comparison, stale flags, price history

**Exit:** only permitted sources in use; no fabricated data.

---

## Phase 9 — Test, Harden & Launch (2–3 weeks)
- [ ] Role/security tests, calculation tests, duplicate tests, link-expiry tests
- [ ] **Backup and restore drill**
- [ ] Performance check, logging, monitoring, HTTPS/domain
- [ ] User acceptance test with real (copied) data on staging
- [ ] Production deploy, owner training, rollback plan

**Exit:** production release.

---

## Dependency Map

```
P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8 → P9
              (Rule Engine + Contracts block almost everything)
```

## Beginner Learning Alignment (parallel track)
| Weeks | Learn | Used in |
|---|---|---|
| 1–2 | HTML, CSS, JavaScript | P0–P1 |
| 3–4 | Git/GitHub, React, Tailwind | P1–P2 |
| 5–6 | SQL/PostgreSQL | P2 |
| 7–8 | Node.js/NestJS, auth | P1–P2 |
| 9–10 | Testing, rule engine | P2 |
| 11–12 | Security basics, tokens | P4 |
| later | Python/FastAPI, OCR/LLMs | P7 |
| later | Docker, deploy, backups | P9 |
