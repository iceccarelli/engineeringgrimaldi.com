# Wedge A — the offer (working draft, D-009)

**Name (working):** GridOS Dispatch Review — Fahrplan-Check für Speicher und Energiegemeinschaften

**For whom:** Stadtwerke with own storage or Mieterstrom / gemeinschaftliche Gebäudeversorgung portfolios; small BESS operators (0.5–20 MWh); Mieterstrom operators under §42b EnWG.

**The one sentence:** We take your last 90 days of schedules, prices and asset limits, run the same MILP optimizer against them, and hand you a written number: how many euros your schedule left on the table, where, and why — with every assumption listed.

## What the customer gets in four weeks

| Week | Deliverable |
|---|---|
| 1 | Data-sharing agreement signed; CSV / API export of schedules, prices, SoC and connection limits received; data-quality note returned within 48 h |
| 2 | Baseline reproduced: we reproduce the customer's own realised revenue from their data to within an agreed tolerance — nothing else is credible until this matches |
| 3 | Optimized counterfactual: MILP dispatch under the same constraints; € gap per day, per asset; constraint report (SoC, power, grid connection, §42b allocation where relevant) |
| 4 | Written review in German (PDF + CSV): € gap with confidence band, the three schedule rules that cost the most, the assumptions, and what a weekly recommendation would look like — plus one call to walk through it |

## What we do NOT do in the trial

No write path to inverters or BMS. No portal, no login. No new forecasting model — persistence baseline only, stated as such. No claim about the future: the review is on their past data.

## Price hypothesis (to be tested in the first ten conversations, not announced)

- Review: fixed fee, payable at week 1. Hypothesis band €2.5k–€7.5k depending on portfolio size; the first three reviews may be priced at cost to buy reference data.
- Follow-on: weekly dispatch recommendation (still RECOMMEND stage, no write path), monthly fee sized as a share of the measured gap. Not offered until the review has produced a number the customer accepts.

## ROI metric — the only one

€ per month vs the customer's own schedule, measured on their data, with assumptions listed. If the gap is below the fee, we say so and the follow-on is not offered.

## Why this wedge and not another

- Only asset with a live paid-intake path (energie-teilen Stripe).
- MILP dispatch already exists in GridOS (121 tests, owner-stated) — build is glue, not research.
- No write path → no NeuralBridge dependency → not blocked by D-007.
- Stops at RECOMMEND, which is exactly where the safety chain says the cluster stops today.

## Kill condition

Ten discovery conversations without one budget owner naming a cost → the wedge is killed (new decision), and B or C is re-evaluated. Not "reworked" — killed.
