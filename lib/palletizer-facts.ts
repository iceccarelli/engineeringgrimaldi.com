/**
 * Facts about the palletizer repository, read from the repository — not
 * from its README's marketing paragraphs. Each line names where it was
 * read. Re-count when PALLETIZER_ENGINE_COMMIT in lib/pilot.ts moves.
 *
 * Counted at 6c5e9d9 (2026-09-01):
 *   grep -rn "def test_" tests | wc -l            → 93
 *   grep -rln "def test_" tests | wc -l           → 16
 *   grep -c "def test_" tests/test_optimizer.py   → 9
 *   .github/workflows/ci.yml                      → ruff + pytest, Python 3.11 / 3.12 / 3.13
 *   pyproject.toml                                → version = "0.2.0"
 *   palletizer_full/optimizer.py:237              → stability_score = 0.6 * support_score + 0.4 * com_score
 *   scripts/verify_engine_parity.py               → beverage / pharma / ecomm36 IDENTICAL (run by hand, not in CI)
 *   tests/                                        → no test imports core/connectors/ur_bridge.py or the OPC UA mock
 */

import type { Localized } from './i18n';

export const REPO_FACTS = {
  version: '0.2.0',
  pypi: 'palletizer-full-stack',
  cli: 'palletize-optimize',
  testFunctions: 93,
  testFiles: 16,
  optimizerTests: 9,
  ciPythons: ['3.11', '3.12', '3.13'],
  parityFixtures: ['beverage', 'pharma', 'ecomm36'],
  parityInCi: false,
  driverTests: 0,
} as const;

export type HonestyLine = { text: Localized; where?: string };

export const SHIPPED: HonestyLine[] = [
  { text: { en: 'optimize_pallet() in Python, palletize-optimize on the CLI, pip install palletizer-full-stack (v0.2.0)', de: 'optimize_pallet() in Python, palletize-optimize auf der CLI, pip install palletizer-full-stack (v0.2.0)' }, where: 'palletizer_full/optimizer.py · pyproject.toml' },
  { text: { en: 'Rotation 0/90°, volumetric density, density vs a naive baseline on the same boxes', de: 'Rotation 0/90°, Volumendichte, Dichte gegen eine naive Basislinie auf denselben Kartons' }, where: 'optimizer.py' },
  { text: { en: 'stability = 0.6 · base-support + 0.4 · centre-of-mass score', de: 'Stabilität = 0,6 · Auflage + 0,4 · Schwerpunkt-Score' }, where: 'optimizer.py:237' },
  { text: { en: 'TypeScript port bit-identical to Python on three documented fixtures (beverage, pharma, ecomm36) — verified by script, not yet in CI', de: 'TypeScript-Portierung bit-identisch zu Python auf drei dokumentierten Fixtures (beverage, pharma, ecomm36) — per Skript verifiziert, noch nicht in CI' }, where: 'scripts/verify_engine_parity.py · DEMO_REBUILD.md' },
  { text: { en: '93 test functions in 16 files, 9 of them on the optimizer; CI runs ruff + pytest on Python 3.11, 3.12 and 3.13', de: '93 Testfunktionen in 16 Dateien, 9 davon am Optimierer; CI führt ruff + pytest auf Python 3.11, 3.12 und 3.13 aus' }, where: 'tests/ · .github/workflows/ci.yml' },
  { text: { en: 'Live optimizer in the browser: CSV in, plan + numbers out', de: 'Live-Optimierer im Browser: CSV hinein, Plan + Zahlen heraus' }, where: 'palletizer-app.vercel.app' },
];

export const NOT_SHIPPED: HonestyLine[] = [
  { text: { en: 'Certified UR / Fanuc / ABB drivers — a URScript compiler and an OPC UA mock exist as stubs; no test exercises them', de: 'Zertifizierte UR- / Fanuc- / ABB-Treiber — ein URScript-Compiler und ein OPC-UA-Mock existieren als Stubs; kein Test prüft sie' }, where: 'core/connectors/ur_bridge.py · core/simulation/opcua_robot_mock.py' },
  { text: { en: 'A lights-out cell. There is no cell. A browser canvas is not a robot.', de: 'Eine Lights-out-Zelle. Es gibt keine Zelle. Ein Browser-Canvas ist kein Roboter.' } },
  { text: { en: 'Food-grade washdown hardware', de: 'Lebensmitteltaugliche Washdown-Hardware' } },
  { text: { en: 'Customer ROI in dollars. “$187k” and “18 %” on the live site are reference geometry on fixtures.', de: 'Kunden-ROI in Dollar. „$187k“ und „18 %“ auf der Live-Seite sind Referenzgeometrie auf Fixtures.' } },
  { text: { en: 'Hours-to-deploy claims. The README slogan is struck through on /lab and nowhere else.', de: 'Behauptungen über Inbetriebnahme in Stunden. Der README-Slogan ist auf /lab durchgestrichen und sonst nirgends.' } },
];
