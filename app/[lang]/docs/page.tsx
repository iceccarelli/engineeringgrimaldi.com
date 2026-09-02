import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getDict } from '@/lib/dict';
import { isLang, langHref, pageAlternates, type Lang } from '@/lib/i18n';
import { CSV_HEADER, MAX_BOXES, SAMPLE_CSV, SECONDS_PER_PICK } from '@/lib/mixedsku';
import { PRODUCT_REPO } from '@/lib/site';

/** Docs look like docs: CSV, units, scoring, errors, the state machine. */

type PageProps = { params: { lang: string } };
const PATH = '/docs';

const COPY = {
  en: {
    title: 'Docs — CSV Format, Units, Fault Codes, State Machine',
    description: 'Palletizer documentation: SKU CSV columns and units, how stability and density are scored, fault and hold codes, and the IDLE · RUN · HOLD · FAULT state machine.',
    kicker: 'Docs',
    h1: 'Read the format. Read the states.',
    lead: 'Everything the planner accepts, everything it emits, and what the cell does with it.',
    csvH2: 'SKU CSV',
    csvP: 'Header required. Comma or semicolon delimited; German decimals (8,5) accepted. Column names are matched case-insensitively and a few aliases are understood (length / laenge, weight / gewicht, qty / anzahl).',
    cols: [
      ['sku_id', 'text', 'Required. Repeated across rows or with qty.'],
      ['length_mm', 'mm', 'Required. Footprint along the pallet length before rotation.'],
      ['width_mm', 'mm', 'Required. Footprint along the pallet width before rotation.'],
      ['height_mm', 'mm', 'Required.'],
      ['weight_kg', 'kg', 'Optional, default 0. Drives payload limit, centre of mass and crush load.'],
      ['qty', 'count', 'Optional, default 1. Expands the row.'],
      ['max_stack_kg', 'kg', 'Optional. Maximum mass this box may carry on top. When present, exceeding it is a FAULT.'],
    ],
    thCol: 'Column', thUnit: 'Unit', thNote: 'Note',
    sampleH3: 'Sample',
    capP: `The browser planner accepts up to ${MAX_BOXES} boxes per pallet. Larger lists run in the Python engine.`,
    unitsH2: 'Units and frames',
    units: [
      ['mm', 'All lengths. Pallet origin is the deck corner; x runs along pallet length, y along width, z up from the deck surface.'],
      ['kg', 'All masses. Pallet own weight is not part of the payload limit.'],
      ['rot_deg', '0 or 90. A rotated box swaps its footprint edges; height never changes.'],
      ['layer', '1-based in exports, 0-based in the JSON plan.'],
      ['cycle', `Cycle time is boxes × ${SECONDS_PER_PICK} s, a planning assumption stated next to the number. Measured cycle time replaces it at acceptance.`],
    ],
    scoreH2: 'How the numbers are produced',
    score: [
      'Boxes are grouped into layers from the tallest down; a layer only admits boxes within 10 % of its tallest box so its top face is near-flat. Each layer is shelf-packed first-fit-decreasing by footprint, both orientations tried.',
      'Base support per box is the share of its footprint resting on boxes of the layer below (1.0 on the deck). Centre-of-mass score is 1 minus the weighted offset from the pallet centre over the half diagonal. Stability = 0.6 × mean support + 0.4 × centre-of-mass score.',
      'Density is placed box volume over pallet footprint × stack height. Load on top of a box is the mass of every higher box in proportion to footprint overlap; it is compared against max_stack_kg when given.',
      'The Python engine (palletizer_full/optimizer.py) uses the same packing and scoring; the browser planner additionally applies the 10 % layer-height tolerance and the crush check, which the engine does not yet. Where they differ, this page says so.',
    ],
    codesH2: 'Codes',
    codes: [
      ['E-CSV-EMPTY', 'FAULT', 'Empty input.'],
      ['E-CSV-HEADER', 'FAULT', 'A required column is missing from the header.'],
      ['E-ROW-DIM / E-ROW-KG / E-ROW-QTY / E-ROW-STACK', 'FAULT', 'A row has a non-positive or non-numeric value. The row is skipped and named.'],
      ['F-DECK', 'FAULT', 'A SKU does not fit the deck in either orientation.'],
      ['F-HEIGHT', 'FAULT', 'A SKU is taller than the stack limit.'],
      ['F-CRUSH', 'FAULT', 'Load on a SKU exceeds its max_stack_kg. Copy: "SKU-04 exceeds crush stack."'],
      ['H-HEIGHT / H-PAYLOAD', 'HOLD', 'Boxes left off because the stack or payload limit was reached. They are listed.'],
      ['H-SUPPORT', 'HOLD', 'A layer has under 85 % mean base support.'],
      ['H-COM', 'HOLD', 'Centre-of-mass score under 0.8.'],
      ['H-CSV-CAP', 'HOLD', `List capped at ${MAX_BOXES} boxes.`],
      ['OK', 'RUN', 'All SKUs placed, stability ≥ 0.6, no fault.'],
    ],
    thCode: 'Code', thLevel: 'Level', thMeaning: 'Meaning',
    smH2: 'State machine',
    sm: [
      ['IDLE', 'No plan loaded or planner has no placements. Robot holds at home. Exits to RUN on a valid plan and an operator start.'],
      ['RUN', 'Plan valid, cell executing placements in order. Telemetry: current index, layer, stability of the partial stack. Exits to HOLD on a hold code or an operator pause; to FAULT on a fault code, gripper feedback loss or safety stop.'],
      ['HOLD', 'Motion paused at a safe pose, plan retained. Operator resolves the named condition (re-plan, remove SKU, adjust limit) and returns to RUN, or aborts to IDLE.'],
      ['FAULT', 'Motion stopped, plan invalidated, fault code latched. Requires acknowledge; exits only to IDLE. Safety functions live on the safety PLC, not here.'],
    ],
    thState: 'State', thDef: 'Definition',
    opcP: 'Reference numbering for the OPC UA exposure in the gateway: state 0 IDLE, 1 RUN, 2 HOLD, 3 FAULT, plus the active code string, placement index, layer, stability and density of the stack so far. Confirm node ids against the version you deploy.',
    repo: 'Repository and Python engine',
    planner: 'Open the planner →',
  },
  de: {
    title: 'Dokumentation — CSV-Format, Einheiten, Fehlercodes, Zustandsautomat',
    description: 'Palletizer-Dokumentation: SKU-CSV-Spalten und Einheiten, Bewertung von Stabilität und Dichte, Fehler- und Hold-Codes sowie der Zustandsautomat IDLE · RUN · HOLD · FAULT.',
    kicker: 'Dokumentation',
    h1: 'Das Format lesen. Die Zustände lesen.',
    lead: 'Alles, was der Planer annimmt, alles, was er ausgibt, und was die Zelle damit tut.',
    csvH2: 'SKU-CSV',
    csvP: 'Kopfzeile erforderlich. Komma- oder Semikolon-getrennt; deutsche Dezimalzahlen (8,5) werden akzeptiert. Spaltennamen werden unabhängig von Groß-/Kleinschreibung erkannt, einige Aliasse werden verstanden (length / laenge, weight / gewicht, qty / anzahl).',
    cols: [
      ['sku_id', 'Text', 'Erforderlich. Über Zeilen wiederholt oder mit qty.'],
      ['length_mm', 'mm', 'Erforderlich. Grundfläche entlang der Palettenlänge vor Rotation.'],
      ['width_mm', 'mm', 'Erforderlich. Grundfläche entlang der Palettenbreite vor Rotation.'],
      ['height_mm', 'mm', 'Erforderlich.'],
      ['weight_kg', 'kg', 'Optional, Standard 0. Bestimmt Nutzlastgrenze, Schwerpunkt und Stapellast.'],
      ['qty', 'Anzahl', 'Optional, Standard 1. Vervielfacht die Zeile.'],
      ['max_stack_kg', 'kg', 'Optional. Maximale Masse, die dieser Karton oben tragen darf. Wird sie überschritten, ist das ein FAULT.'],
    ],
    thCol: 'Spalte', thUnit: 'Einheit', thNote: 'Hinweis',
    sampleH3: 'Beispiel',
    capP: `Der Browser-Planer nimmt bis zu ${MAX_BOXES} Kartons pro Palette an. Größere Listen laufen in der Python-Engine.`,
    unitsH2: 'Einheiten und Koordinaten',
    units: [
      ['mm', 'Alle Längen. Ursprung ist die Palettenecke; x entlang der Palettenlänge, y entlang der Breite, z nach oben ab Deckoberfläche.'],
      ['kg', 'Alle Massen. Das Paletteneigengewicht zählt nicht zur Nutzlastgrenze.'],
      ['rot_deg', '0 oder 90. Ein gedrehter Karton tauscht die Kanten seiner Grundfläche; die Höhe bleibt.'],
      ['layer', '1-basiert in Exporten, 0-basiert im JSON-Plan.'],
      ['cycle', `Taktzeit ist Kartons × ${SECONDS_PER_PICK} s — eine Planungsannahme, die neben der Zahl steht. Die gemessene Taktzeit ersetzt sie bei der Abnahme.`],
    ],
    scoreH2: 'Wie die Zahlen entstehen',
    score: [
      'Kartons werden vom höchsten abwärts in Lagen gruppiert; eine Lage nimmt nur Kartons innerhalb von 10 % ihres höchsten Kartons auf, damit ihre Oberseite nahezu eben ist. Jede Lage wird Shelf-Packing First-Fit-Decreasing nach Grundfläche gepackt, beide Ausrichtungen werden geprüft.',
      'Die Auflage pro Karton ist der Anteil seiner Grundfläche, der auf Kartons der darunterliegenden Lage ruht (1,0 auf der Palette). Der Schwerpunkt-Score ist 1 minus der gewichtete Versatz zur Palettenmitte über die halbe Diagonale. Stabilität = 0,6 × mittlere Auflage + 0,4 × Schwerpunkt-Score.',
      'Dichte ist das gesetzte Kartonvolumen über Palettengrundfläche × Stapelhöhe. Die Stapellast auf einem Karton ist die Masse aller höheren Kartons anteilig zur Überlappung der Grundflächen; sie wird gegen max_stack_kg geprüft, wenn angegeben.',
      'Die Python-Engine (palletizer_full/optimizer.py) nutzt dasselbe Packen und Bewerten; der Browser-Planer wendet zusätzlich die 10-%-Lagenhöhentoleranz und die Stapellast-Prüfung an, die die Engine noch nicht hat. Wo sie sich unterscheiden, steht es hier.',
    ],
    codesH2: 'Codes',
    codes: [
      ['E-CSV-EMPTY', 'FAULT', 'Leere Eingabe.'],
      ['E-CSV-HEADER', 'FAULT', 'Eine erforderliche Spalte fehlt in der Kopfzeile.'],
      ['E-ROW-DIM / E-ROW-KG / E-ROW-QTY / E-ROW-STACK', 'FAULT', 'Eine Zeile enthält einen nicht positiven oder nicht numerischen Wert. Die Zeile wird übersprungen und benannt.'],
      ['F-DECK', 'FAULT', 'Eine SKU passt in keiner Ausrichtung auf die Palette.'],
      ['F-HEIGHT', 'FAULT', 'Eine SKU ist höher als die Stapelgrenze.'],
      ['F-CRUSH', 'FAULT', 'Die Last auf einer SKU überschreitet ihr max_stack_kg. Text: „SKU-04 überschreitet die Stapellast.“'],
      ['H-HEIGHT / H-PAYLOAD', 'HOLD', 'Kartons nicht gesetzt, weil Stapel- oder Nutzlastgrenze erreicht wurde. Sie werden aufgelistet.'],
      ['H-SUPPORT', 'HOLD', 'Eine Lage hat unter 85 % mittlere Auflage.'],
      ['H-COM', 'HOLD', 'Schwerpunkt-Score unter 0,8.'],
      ['H-CSV-CAP', 'HOLD', `Liste auf ${MAX_BOXES} Kartons begrenzt.`],
      ['OK', 'RUN', 'Alle SKUs gesetzt, Stabilität ≥ 0,6, kein Fehler.'],
    ],
    thCode: 'Code', thLevel: 'Stufe', thMeaning: 'Bedeutung',
    smH2: 'Zustandsautomat',
    sm: [
      ['IDLE', 'Kein Plan geladen oder Planer ohne Platzierungen. Roboter wartet in Grundstellung. Wechsel nach RUN bei gültigem Plan und Bedienerstart.'],
      ['RUN', 'Plan gültig, Zelle setzt Platzierungen der Reihe nach. Telemetrie: aktueller Index, Lage, Stabilität des Teilstapels. Wechsel nach HOLD bei Hold-Code oder Bedienerpause; nach FAULT bei Fehlercode, Verlust der Greiferrückmeldung oder Sicherheitshalt.'],
      ['HOLD', 'Bewegung in sicherer Pose angehalten, Plan bleibt erhalten. Bediener löst die benannte Bedingung (neu planen, SKU entfernen, Grenze anpassen) und kehrt nach RUN zurück oder bricht nach IDLE ab.'],
      ['FAULT', 'Bewegung gestoppt, Plan ungültig, Fehlercode gespeichert. Quittierung erforderlich; Wechsel nur nach IDLE. Sicherheitsfunktionen liegen auf der Sicherheits-SPS, nicht hier.'],
    ],
    thState: 'Zustand', thDef: 'Definition',
    opcP: 'Referenznummerierung für die OPC-UA-Bereitstellung im Gateway: Zustand 0 IDLE, 1 RUN, 2 HOLD, 3 FAULT, dazu aktiver Code, Platzierungsindex, Lage, Stabilität und Dichte des bisherigen Stapels. Node-IDs gegen die eingesetzte Version prüfen.',
    repo: 'Repository und Python-Engine',
    planner: 'Planer öffnen →',
  },
} as const;

export function generateMetadata({ params }: PageProps): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  return { title: COPY[lang].title, description: COPY[lang].description, alternates: pageAlternates(lang, PATH) };
}

export default function DocsPage({ params }: PageProps) {
  const lang: Lang = isLang(params.lang) ? params.lang : 'en';
  const t = getDict(lang);
  const c = COPY[lang];
  const href = (p: string) => langHref(lang, p);

  return (
    <main>
      <div className="section">
        <Breadcrumbs lang={lang} crumbs={[{ name: 'Grimaldi Engineering', path: '/' }, { name: c.kicker, path: PATH }]} />
        <span className="kicker kicker-signal">{c.kicker}</span>
        <h1>{c.h1}</h1>
        <p className="lead">{c.lead}</p>

        <div className="prose">
          <h2 id="csv">{c.csvH2}</h2>
          <p>{c.csvP}</p>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{c.thCol}</th><th>{c.thUnit}</th><th>{c.thNote}</th></tr></thead>
              <tbody>{c.cols.map(([col, unit, note]) => <tr key={col}><td className="mono">{col}</td><td className="mono">{unit}</td><td>{note}</td></tr>)}</tbody>
            </table>
          </div>
          <h3>{c.sampleH3}</h3>
          <pre tabIndex={0}><code>{SAMPLE_CSV}</code></pre>
          <p style={{ marginTop: 12 }}>{c.capP} <span className="mono">{CSV_HEADER}</span></p>

          <h2 id="units">{c.unitsH2}</h2>
          <dl className="defs">{c.units.map(([k, v]) => [<dt key={`${k}-t`}>{k}</dt>, <dd key={`${k}-d`}>{v}</dd>])}</dl>

          <h2 id="scoring">{c.scoreH2}</h2>
          {c.score.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}

          <h2 id="codes">{c.codesH2}</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{c.thCode}</th><th>{c.thLevel}</th><th>{c.thMeaning}</th></tr></thead>
              <tbody>{c.codes.map(([code, level, meaning]) => (
                <tr key={code}>
                  <td className="mono">{code}</td>
                  <td><span className={`chip ${level === 'FAULT' ? 'chip-fault' : level === 'HOLD' ? 'chip-hold' : 'chip-live'}`}>{level}</span></td>
                  <td>{meaning}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>

          <h2 id="states">{c.smH2}</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{c.thState}</th><th>{c.thDef}</th></tr></thead>
              <tbody>{c.sm.map(([s, d]) => (
                <tr key={s}>
                  <td><span className={`chip ${s === 'RUN' ? 'chip-live' : s === 'HOLD' ? 'chip-hold' : s === 'FAULT' ? 'chip-fault' : 'chip-idle'}`}>{s}</span></td>
                  <td>{d}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <pre tabIndex={0} style={{ marginTop: 12 }}><code>{`IDLE ──plan valid + start──▶ RUN
RUN  ──hold code / pause───▶ HOLD ──resolved──▶ RUN
HOLD ──abort───────────────▶ IDLE
RUN  ──fault code / e-stop─▶ FAULT ──acknowledge──▶ IDLE`}</code></pre>
          <p style={{ marginTop: 12 }}>{c.opcP}</p>
        </div>

        <div className="cta-row">
          <a className="btn btn-signal" href={href('/palletizer')}>{c.planner}</a>
          <a className="btn btn-line" href={PRODUCT_REPO} rel="noopener noreferrer">{c.repo}</a>
        </div>
        <p className="author-block">{t.authorLine}</p>
      </div>
    </main>
  );
}
