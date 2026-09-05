# Wedge A — Gesprächsleitfaden (Deutsch, 20 Minuten)

Ziel des Gesprächs ist **eine Zahl** und **ein Name mit Rolle**: Was kostet das Problem heute, und wer hält das Budget. Kein Demo, kein Pitch, keine Folien.

Verboten: „Würden Sie so etwas nutzen?“ — und jede Variante davon.

## 0. Einstieg (1 Minute)

> Ich baue Software, die Fahrpläne für Speicher und Energiegemeinschaften gegen die realen Preise nachrechnet. Bevor ich irgendetwas zeige, will ich verstehen, was Sie das heute kostet. Fünf Fragen, dann sage ich Ihnen ehrlich, ob ich helfen kann.

## 1. Was kostet Sie heute Geld? (5 Minuten)

- Wie wird der Fahrplan Ihrer Speicher heute erstellt? Wer, wie oft, mit welchem Werkzeug?
- Wie oft weicht der realisierte Erlös vom geplanten ab? Wissen Sie es?
- (Mieterstrom / GGV) Wie wird die §42b-Aufteilung gerechnet — und wie lange dauert das pro Abrechnungslauf?

**Zu notieren:** `costsToday` — in ihren Worten.

## 2. Wie viel? (4 Minuten)

- Wenn Sie schätzen müssten: Wie viel Erlös entgeht pro Jahr? Oder wie viele Personentage gehen in die manuelle Rechnung?
- Welche Zahl würde Ihr Geschäftsführer dazu nennen?

**Zu notieren:** `costBand` — eines von `<10k`, `10k-50k`, `50k-250k`, `>250k`, sonst `unknown`. Eine Schätzung des Gesprächspartners zählt; unsere eigene nicht.

## 3. Wer hält das Budget? (3 Minuten)

- Wenn Sie morgen ein Werkzeug dafür kaufen wollten — wer unterschreibt?
- Wo sitzt das im Haushalt: Energiewirtschaft, IT, Netz, Vertrieb?

**Zu notieren:** `budgetOwner` — Rolle, kein Name auf der öffentlichen Seite.

## 4. Wie lösen Sie es heute? (3 Minuten)

- Excel, Dienstleister, Direktvermarkter, eigene Software, gar nicht?
- Was daran ärgert Sie am meisten?

**Zu notieren:** `currentSolution`.

## 5. Was wäre Erfolg wert? (3 Minuten)

- Wenn ich Ihnen in vier Wochen schwarz auf weiß zeige, wie viele Euro Ihr letzter Fahrplan liegen gelassen hat — was wäre Ihnen diese Zahl wert?
- Was müsste in dem Dokument stehen, damit Sie es Ihrem Geschäftsführer zeigen?

**Zu notieren:** `successWorth`.

## 6. Abschluss (1 Minute) — nur wenn 1 bis 5 beantwortet sind

> Ich schlage vor: Sie geben mir 90 Tage Fahrpläne, Preise und Anlagengrenzen als CSV. Ich reproduziere erst Ihren Erlös — wenn das nicht stimmt, ist alles andere wertlos — und dann die Lücke. Vier Wochen, fester Preis, schriftlich. Passt das in Ihr Budget, oder brauchen wir dafür jemand anderen im Raum?

**Ergebnis-Stufe im Register:**
- Fünf Antworten → `conversation`
- Zahl von Budgetverantwortlichem genannt → `cost-named`
- CSV-Übergabe vereinbart → `data-shared`
- Rechnung bezahlt → `paid-trial`
- Nein → `declined` mit Grund. Ein Nein mit Grund ist ein guter Datensatz.

## Nach dem Gespräch (10 Minuten, am selben Tag)

1. CRM-Zeile anlegen (privat, mit Namen).
2. Anonymisierten Datensatz in `lib/energy/customers.ts` ergänzen: `ref`, Datum, Segment, Bundesland, Größenklasse, Stufe, die fünf Antworten in einem Satz je Feld, nächster Schritt.
3. `npm run build`, committen. Der Trichter auf /energy aktualisiert sich von selbst.
