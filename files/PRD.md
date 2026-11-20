# PRD — ContractPro
**Contract, Profit & Payment Automation System**
Version 1.0 · Status: Draft for build · Source: Construction Automation System doc, ContractPro Project Guide, Visual System Development Guide

---

## 1. What We Are Making

ContractPro is a web-based business system for a contracting firm (e.g. M/S K J Enterprise) that takes Navy and similar contract work, keeps the money left after office deductions, and passes work to subcontractors (Tofazal, Anis, Tonay, Yousuf).

Today everything is tracked in Excel and profit is calculated by hand. ContractPro replaces that with **one central record, the Contract**, and everything else (rules, progress, bills, cheques, payments, expenses, reports) attaches to it.

### Problem
- Profit is calculated manually for every contract, so errors happen.
- Short or wrong deductions from the office cheque are easy to miss.
- Subcontractors dispute "I never received that cash".
- Information is scattered across many spreadsheets.
- Typing work orders, bills and receipts wastes daily time.

### Goals
1. Replace Excel sheets and hand calculations with structured records.
2. Calculate expected profit consistently with configurable, versioned deduction rules.
3. Track money in (bills, cheques) and money out (subcontractor payments, expenses).
4. End payment disputes with PIN/OTP-verified confirmation links.
5. Use AI agents to read documents and prepare drafts. **A human approves every financial action.**
6. Later: collect permitted public tenders and compare equipment prices.

### Non-goals (v1)
- AI agents that move money, approve bills, confirm receipts or close contracts on their own.
- Scraping websites that do not permit it.
- Native mobile app (mobile-friendly web only).
- Full accounting/tax software.

---

## 2. Targeted Users

| User | Description | Access |
|---|---|---|
| **Admin (Owner)** | Business owner. Approves contracts, rules, bills, payments. | Everything |
| **Accounts / Manager** | Records payments, bills, cheques, expenses. | No rule-template changes, no admin-only actions |
| **Viewer** | Partner or auditor. | Reports and dashboard, read only |
| **Subcontractor** | Tofazal, Anis, Tonay, Yousuf. No login. | Private, expiring, PIN/OTP-protected link showing only their own payments and history |

Primary persona: a non-technical business owner in Bangladesh who works mostly on a phone, receives work orders as PDF, WhatsApp photo or paper, and needs trustworthy numbers fast. Currency is **৳ (BDT)**.

---

## 3. Core Concept: The Contract Lifecycle

```
Work order / Tender → Draft → Rules applied & profit calculated → Approved (Trial/Running)
→ Progress tracked → Work Complete → Bill prepared → Cheque received & reconciled
→ Subcontractor paid & confirmed → Closed → Reports
```

**Status flow:** Draft → Trial → Running → Work Complete → Billed → Cheque Received → Sub Paid → Closed (or Cancelled).

### Two kinds of automation
- **Rule automation** (deterministic): profit calculator, totals, status changes, duplicate checks, reminders. Same input + same rule version = same result.
- **AI agents** (read, extract, suggest): they draft; a human approves.

---

## 4. Features

Priority: **P0** = MVP, **P1** = after MVP, **P2** = later.

### 4.1 Users, Login & Roles — P0
- Password login (hashed), optional second factor.
- Roles: Admin, Accounts/Manager, Viewer; subcontractor link access.
- Account lock after repeated wrong passwords; login history.

### 4.2 Master Data — P0
- Clients/units (GE Navy North B&R-II, GE Navy North E&M, AGE Navy Kaptai).
- Contract places (BSO and Issue Point, Sailors Colony-1, BNS Patenga, Officer Qtr Dockyard).
- Subcontractors: name, phone, WhatsApp, PIN, bank/bKash details, default share %.
- Our firms, contract types (Piece, Trial, DC), suppliers.

### 4.3 Rule Engine — P0 (heart of the system)
- Rule templates, e.g. "GE Navy North, Piece, 53%".
- Each rule: **percentage or fixed**, and **calculation basis** (total contract or cheque amount).
- Versioned: old contracts keep the rule version used at approval.
- Single-contract override only with reason, user and timestamp.
- Instant recalculation; warning if template does not match the unit.

**Reference deductions (from source sheets, to be confirmed by owner):**

| Item | Example | Basis |
|---|---|---|
| EAG office | 15% | Total contract |
| Advance | 3.5% (3.4% on trial sheet, unresolved) | Cheque amount |
| Ex-money | 2% | Total contract |
| CMES | 0.70% | Total contract |
| Contract money | 7,200 | Fixed |
| N.Ju stamp | 1,440 | Fixed |
| Dapci | 2,000 (1,000 on DC contract) | Fixed |
| SDO office | 6,000 / 3,000 / 4,500 | Fixed |
| E-6 / E-4 | 4,000 to 16,000 | Fixed |
| Subcontract share | 53–60% | Total contract, set per job |

**Golden test case:** contract ৳330,000 · GE Navy North B&R-II · Tofazal 53% → EAG 49,500 · cheque 280,500 · advance 9,818 · ex-money 6,600 · CMES 2,310 · subcontract 174,900 · **expected profit ৳70,232.50**.

### 4.4 Contract Management — P0
- Fields: contract no (S.No), unit, CA numbers, place, work description, value, type, rule template, subcontractor, dates, status, documents.
- Bulk duplicate (one amount, many CA numbers).
- One-click Trial → Running.
- Duplicate-CA detection, auto status advance, deadline alerts.

### 4.5 Subcontractor Ledger — P0
- Assigned work, agreed share, total due, total paid, balance, transactions.

### 4.6 Payment Management — P0
- Record date, subcontractor, contract, amount, method (cash/bank/bKash), reference, remarks.
- Overpayment warning against balance due.
- Status starts as Pending Confirmation.

### 4.7 Payment Confirmation & Follow-up — P0/P1
- Unique, expiring, hard-to-guess link sent by SMS/WhatsApp.
- Subcontractor verifies via PIN/OTP, then **Confirm** or **Dispute**, optional receipt photo.
- Confirmed records are locked; corrections are linked adjustments.
- Follow-up Agent: reminder → alternate channel → red dashboard alert. It can remind but **never confirm**.
- Confirmation means acknowledgement of receipt, not proof of bank settlement.

### 4.8 Cheque & Receivable Tracking + Reconciliation — P1
- Expected cheque from Rule Engine vs actual cheque (number, date, amount).
- Flags short payments and wrong deductions; pending list with age.

### 4.9 Project Progress — P1
- Percentage, milestones, photos, deadline-risk warnings, handover confirmation triggers billing.

### 4.10 Bills — P1
- Manual entry with live preview and PDF export.
- Bill Agent: upload project PDF → extract items/quantities → fill rates → check against contract value → human approves.

### 4.11 Price Management — P1
- Item, category, unit, price, source, date; history preserved; stale-price flags.

### 4.12 Daily Expenses — P1
- Receipt photo or message ("cement 12,000 for Patenga") → Expense Agent drafts → human confirms → actual profit updates.

### 4.13 Reports — P0/P1
- State of Piece Contract (K J Enterprise and AGE Kaptai tables).
- Daily, monthly, annual summaries; project profit; receivables; subcontractor balances; expense reports.
- Export PDF and Excel.

### 4.14 Dashboard — P0 (basic) / P1 (full)
- Cards: total contracts, running, investment, expected profit, actual profit, received, receivable, payable.
- Sections: running contracts with progress, drafts awaiting approval, unconfirmed payments, pending cheques, recent expenses, alerts.

### 4.15 Notifications & Daily Briefing — P1
- Alerts: unconfirmed payment, deadline, cheque pending too long, draft/bill awaiting approval, short payment, profit warning.
- Channels: dashboard, SMS, WhatsApp.

### 4.16 Contract Intake Agent — P2
- Work order (PDF, photo, WhatsApp text) → draft contract with source document beside extracted fields, confidence flags, duplicate detection. Admin approves.

### 4.17 Profit Watchdog, Monthly Report Agent, AI Insights — P2
- Watchdog warns when expected profit falls below a set level.
- Insights: plain-language questions ("How much do I owe Tofazal?") answered from verified records with sources; never invents figures.

### 4.18 Tender Aggregator & Equipment Price Intelligence — P2
- Only from official APIs/feeds/permitted sources. Show title, organization, tender ID, dates, source link, deadline alerts.
- Compare only equivalent specifications; show supplier, price, availability, last-updated; never claim full-web coverage or that a tender is open without checking.

### 4.19 Audit, Security & Backup — P0
- Log who/what/when/old/new on every change.
- Locked: confirmed payments, final bills, closed contracts.
- Daily backup and tested restore.

---

## 5. Agent Summary

| Agent | Does | Human control |
|---|---|---|
| Intake | Work order → contract draft | Admin approves |
| Follow-up | Reminds about unconfirmed payments | Admin reviews escalations |
| Bill | Extracts items, looks up rates, drafts bill | Human approves final bill |
| Expense | Receipt/message → expense draft | Human confirms uncertain data |
| Reconciliation | Compares expected vs received cheque | Human investigates mismatch |
| Profit Watchdog | Warns on profit drop | Human decides action |
| Daily/Monthly Report | Prepares briefing and reports | Review before sending |

---

## 6. Success Criteria

- Profit calculator matches independently checked sample calculations (including the ৳70,232.50 golden case).
- Changing a rule version leaves previously approved contracts unchanged.
- Expired, reused, invalid payment links fail safely.
- Every AI-extracted number traces to its source document line.
- Reports reconcile with ledger totals; a backup restore has been tested.
- The owner can see contract status, expected and actual profit, receivables, payables, subcontractor balances and pending approvals in one screen.

---

## 7. Open Questions (must be settled before building the Rule Engine)

1. Do 15%, 3.5%, 0.70%, 2% stay the same across all clients, or does each client have its own set?
2. Is the 3.4% advance on the trial sheet deliberate or a typing difference?
3. How do work orders reach you: PDF, WhatsApp photo, or paper?
4. Are subcontractors paid in stages tied to progress, or lump sum?
5. Who besides the owner will use the system (accountant, partner)?
6. Web only, mobile-friendly web, or later native app?
7. Which SMS/WhatsApp provider is available and affordable in Bangladesh?
8. Which tender/supplier websites permit automated access, and what fields do they provide?
