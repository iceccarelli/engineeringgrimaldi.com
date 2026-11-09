# Wedge A — target list (how to build it; no names in this repository)

The public control engine never holds organisation names. The private CRM does. This file says how the first fifty rows of that CRM are built, so the list is reproducible and the segments on /energy/customers mean the same thing every week.

## Segments, in priority order, with the public source for each

| Segment | Why first | Public source to build the list | Size band rule |
|---|---|---|---|
| Stadtwerke with own storage or Mieterstrom portfolio | Budget owner is reachable (Leiter Energiewirtschaft); one house, one decision | Marktstammdatenregister (MaStR) filter: Stromspeicher ≥ 500 kWh, Betreiber contains "Stadtwerke" / "Energieversorgung"; VKU member list for cross-check | micro < 20k Zähler · small 20–100k · mid 100–500k · large > 500k |
| Mieterstrom / GGV operators | §42b EnWG rule change creates a live pain now | MaStR: PV plants with Mieterstrom flag; BNetzA Mieterstrom reports; Wohnungswirtschaft (GdW regional associations) | by units served: micro < 200 · small 200–2k · mid 2k–10k · large > 10k |
| Small BESS operators (0.5–20 MWh) | Direct € gap, short sales cycle | MaStR Stromspeicher 0.5–20 MWh, Betreiber not a Direktvermarkter | by MWh |
| C&I energy operators with storage | Clear budget owner (Energiemanager) | MaStR + ISO 50001 certified companies (public registers) | by MWh |
| Aggregators / Direktvermarkter | They already optimise — they are the competitor as often as the customer; talk to them last | BNetzA Direktvermarkter list | — |

Do not start with DSOs (wedge C) — procurement cycles and NIS2 scope make them the wrong first customer.

## The CRM row (private)

`ref` (this is what the public record cites) · organisation · person · role · email · phone · segment · Bundesland · size band · source of the lead · first contact date · stage · the five answers verbatim · next step · owner.

## Weekly cadence

- 10 outbound contacts per week, by email, four sentences, one question ("Was kostet Sie heute der Fahrplan Ihrer Speicher?"), one link to /energy/wedge.
- Every reply → 20-minute call using `DISCOVERY_SCRIPT.de.md`.
- Every call → one anonymised record in `lib/energy/customers.ts` the same day.
- Friday: the CEO report counts them. Nothing else counts.
