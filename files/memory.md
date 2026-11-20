# memory.md — ContractPro Project Memory

> **Purpose:** shared progress log for the developer and any AI coding tool.
> **Protocol:** read this file at the start of every session. Update it at the end of every session or after every finished task. Keep it short, factual and current. Never delete history; append to the log.

---

## 1. Current Status

| Item | Value |
|---|---|
| Last updated | 2026-11-20 |
| Current phase | **Phase 0 — Requirements & Design** |
| Currently working on | Writing project documents; waiting for owner answers to open questions |
| Current file(s) in progress | `docs/PRD.md`, `docs/architecture.md`, `docs/rules.md`, `docs/phases.md`, `docs/design.md`, `docs/memory.md` |
| Current branch | — (repo not created yet) |
| Blocked by | Open questions (see §4) |
| Next step | Answer open questions → collect golden contract examples → wireframes → start Phase 1 |

---

## 2. Completed

### Documents
- [x] PRD.md — goals, users, features, agents, success criteria, open questions
- [x] architecture.md — tech stack, flows, data model, API groups, folder structure
- [x] rules.md — what to use/avoid, error handling, AI boundaries, security checklist
- [x] phases.md — Phase 0 to Phase 9 breakdown
- [x] design.md — colors, fonts, components, portal design
- [x] memory.md — this file

### Code
_Nothing built yet._

---

## 3. Phase Checklist (high level)

| Phase | Name | Status |
|---|---|---|
| 0 | Requirements & Design | 🟡 In progress |
| 1 | Foundation (repo, auth, audit, shell) | ⚪ Not started |
| 2 | Master Data, Contracts, Rule Engine (MVP core) | ⚪ Not started |
| 3 | Ledger, Payments, Reports v1 | ⚪ Not started |
| 4 | Payment Confirmation & Notifications | ⚪ Not started |
| 5 | Cheques & Reconciliation | ⚪ Not started |
| 6 | Progress, Bills, Prices, Expenses | ⚪ Not started |
| 7 | AI Agents | ⚪ Not started |
| 8 | Tender & Price Intelligence | ⚪ Not started |
| 9 | Test, Harden, Launch | ⚪ Not started |

Legend: ⚪ not started · 🟡 in progress · 🟢 done · 🔴 blocked

---

## 4. Open Questions / Blockers

- [ ] Do 15%, 3.5%, 0.70%, 2% apply to all clients or per client?
- [ ] 3.4% (trial sheet) vs 3.5% advance: deliberate or typo?
- [ ] How do work orders arrive (PDF / WhatsApp photo / paper)?
- [ ] Subcontractor payment: staged by progress or lump sum?
- [ ] Other system users besides the owner?
- [ ] Web only, mobile-friendly web, or later native?
- [ ] SMS/WhatsApp provider available in Bangladesh (cost, API)?
- [ ] Which tender/supplier sites permit automated access?
- [ ] Rounding rule (e.g. 9,817.5 → 9,818) confirmed?

---

## 5. Key Decisions Made

| Date | Decision | Reason |
|---|---|---|
| 2026-11-20 | Stack: React + Tailwind, NestJS, PostgreSQL, FastAPI | From project guides; C# not required |
| 2026-11-20 | Contract is the central record | All modules attach to it |
| 2026-11-20 | AI agents draft only; humans approve money actions | Financial safety |
| 2026-11-20 | Rule templates are versioned; contracts freeze the version | History must never change |
| 2026-11-20 | Confirmed records are immutable; corrections are linked entries | Audit trust |
| 2026-11-20 | Money stored as NUMERIC / Decimal, never float | Accuracy |
| 2026-11-20 | Tender/price data only from permitted sources | Legal and technical safety |

---

## 6. Known Issues / Notes

- Mockup images are illustrative, not working software.
- Golden test case to implement first: contract ৳330,000, GE Navy North B&R-II, Tofazal 53% → expected profit ৳70,232.50.
- Reference docs have some formatting glitches (e.g. "B&R-II;"); verify names against real sheets.

---

## 7. Session Log (append newest at top)

### 2026-11-20
- Created PRD, architecture, rules, phases, design and memory files from the three uploaded guides and two diagrams.
- No code written. Phase 0 continues.

---

## 8. How to Update This File (template)

At the end of each session, copy this block into §7 and fill it in:

```
### YYYY-MM-DD
- Phase: 
- Worked on (files): 
- Completed: 
- Tests: (passing / failing / not run)
- Decisions: 
- Problems / blockers: 
- Next step: 
```

Then update §1 (current status), §2 (completed), §3 (phase table) and §4 (questions) as needed.
