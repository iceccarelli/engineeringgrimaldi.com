import type { Localized } from "./i18n";
import type { PlateSpec } from "./hub-home";
import { NB_URL, PORTFOLIO_URL, TTP_URL } from "./site";
export type HubPageKey = "time-to-power" | "neuralbridge" | "foundation" | "prospect" | "about";
export type HubPageDef = { path: string; kicker: Localized; title: Localized; description: Localized; externalUrl?: string; externalLabel?: string; hero: PlateSpec; blocks: { heading: Localized; body: Localized; plates: PlateSpec[] }[] };

export const HUB_PAGES: Record<HubPageKey, HubPageDef> = {
  "time-to-power": {
    path: "/time-to-power", kicker: { en: "COMPANY 01 · GRIDFORGE · TIMETOPOWER.AI", de: "UNTERNEHMEN 01 · GRIDFORGE · TIMETOPOWER.AI" },
    title: { en: "Time to Power (Gridforge)", de: "Time to Power (Gridforge)" },
    description: { en: "Power-capacity intelligence for existing AI data-centre halls: binding electrical and thermal constraints, unlockable compute, cost, lead time, and evidence class.", de: "Leistungskapazitäts-Intelligenz für bestehende KI-Rechenzentren: bindende elektrische und thermische Grenzen, freisetzbare Leistung, Kosten, Vorlaufzeit und Evidenzklasse." },
    externalUrl: TTP_URL, externalLabel: "timetopower.ai ↗",
    hero: { src: "/images/cool/01-cinematic-ai-power-capacity.jpg", alt: "Cinematic AI data center power capacity intelligence", code: "TTP 01 · HALL CAPACITY", caption: { en: "Identifying firm and conditional megawatts inside energized AI data-centre halls.", de: "Identifikation fester und bedingter Megawatt-Reserven in bestehenden KI-Hallen." } },
    blocks: [
      { heading: { en: "Finding the binding hall constraint", de: "Den bindenden Hallenengpass bestimmen" },
        body: { en: "Nameplate substation megawatts rarely equal usable rack power. Gridforge models switchgear ampacity, transformer thermal hot-spots, UPS ride-through, harmonics, and cooling rejection — selling zero equipment and grading the evidence behind every figure.", de: "Umspannwerks-Nennleistung entspricht selten nutzbarer Rack-Leistung. Gridforge modelliert Schaltanlagen, Transformator-Thermik, USV-Reserven und Rückkühlung — ohne Hardwareverkauf und mit klarer Evidenzklasse." },
        plates: [
          { src: "/images/companies/01-time-to-power-data-center-hall.jpg", alt: "AI data center hall with power flow overlays showing capacity constraints", code: "TTP 02 · HALL POWER FLOWS", caption: { en: "Feeder loading and distribution constraints across high-density AI halls.", de: "Abgangsbelastung und Verteilgrenzen in hochdichten KI-Hallen." } },
          { src: "/images/critical/01-time-to-power-capacity-intelligence.jpg", alt: "Time to Power capacity intelligence for AI data centers", code: "TTP 03 · EVIDENCE-GRADED HEADROOM", caption: { en: "Unlockable compute evaluated by cost, lead time, and telemetry confidence.", de: "Freisetzbare Leistung bewertet nach Kosten, Vorlaufzeit und Datenqualität." } },
        ] },
      { heading: { en: "The Gridforge capacity envelope", de: "Die Gridforge-Kapazitätshüllkurve" },
        body: { en: "Instead of static derating rules, the capacity envelope evaluates electrical selectivity, winding thermal constants, and ambient cooling rejection jointly.", de: "Statt pauschaler Abschläge bewertet die Hüllkurve Schutzselektivität, thermische Zeitkonstanten und Rückkühlung gemeinsam." },
        plates: [
          { src: "/images/companies/02-gridforge-capacity-envelope.jpg", alt: "GridForge capacity envelope diagram showing electrical and thermal binding constraints", code: "TTP 04 · BINDING ENVELOPE", caption: { en: "Coupled electrical and thermal limits defining safe hall operating regions.", de: "Gekoppelte elektrische und thermische Grenzen des sicheren Hallenbetriebs." } },
          { src: "/images/cool/02-elegant-capacity-envelope.jpg", alt: "Elegant GridForge capacity envelope of data center limits", code: "TTP 05 · OPERATING BOUNDARY", caption: { en: "Separating firm continuous capacity from thermally gated headroom.", de: "Trennung von Dauerleistung und thermisch begrenzten Reserven." } },
        ] },
      { heading: { en: "Interconnection & siting path", de: "Netzanschlusspfad & Standort-Intelligenz" },
        body: { en: "Queue position and regional transmission congestion govern expansion energization dates long before construction begins.", de: "Warteschlangenposition und Übertragungsengpässe bestimmen das Inbetriebnahmedatum lange vor Baubeginn." },
        plates: [
          { src: "/images/companies/03-time-to-power-interconnection-path.jpg", alt: "Time to power visualization: interconnection queue path to energized AI capacity", code: "TTP 06 · QUEUE PATH", caption: { en: "Critical path from interconnection request to energized megawatts.", de: "Kritischer Pfad vom Netzanschlussantrag bis zur Inbetriebnahme." } },
          { src: "/images/cool/03-premium-interconnection-intelligence.jpg", alt: "Premium interconnection intelligence for AI infrastructure", code: "TTP 07 · SITING SIGNAL", caption: { en: "Substation headroom and queue intelligence for AI infrastructure.", de: "Umspannwerksreserven und Warteschlangen-Signale für KI-Standorte." } },
        ] },
    ],
  },
  neuralbridge: {
    path: "/neuralbridge", kicker: { en: "COMPANY 02 · AUTONOMOUS ASSURANCE · NEURALBRIDGE.IO", de: "UNTERNEHMEN 02 · AUTONOMOUS ASSURANCE · NEURALBRIDGE.IO" },
    title: { en: "NeuralBridge", de: "NeuralBridge" },
    description: { en: "Industrial Autonomous Assurance: tamper-evident, hash-chained records matching safety verifications to the actual software and configuration of machines.", de: "Industrial Autonomous Assurance: manipulationssichere, hash-verkettete Nachweise für sicherheitsrelevante Maschinen-Software und Konfigurationen." },
    externalUrl: NB_URL, externalLabel: "neuralbridge.io ↗",
    hero: { src: "/images/companies/04-neuralbridge-machine-safety-verification.jpg", alt: "Industrial machine control panel with safety verification and evidence overlays", code: "NB 01 · SAFETY VERIFICATION", caption: { en: "Keeping safety verification artifacts matched to live machine software states.", de: "Synchronisation von Sicherheitsnachweisen mit dem realen Softwarestand." } },
    blocks: [
      { heading: { en: "Hash-chained, tamper-evident compliance records", de: "Manipulationssichere, hash-verkettete Nachweisketten" },
        body: { en: "When firmware, parameters, or advisories change, static dossiers go stale. NeuralBridge links test artifacts, configuration hashes, and approvals in an append-only chain.", de: "Bei Firmware- oder Parameteränderungen veralten statische Dossiers. NeuralBridge verknüpft Prüfartefakte und Konfigurations-Hashes kryptografisch." },
        plates: [
          { src: "/images/companies/05-neuralbridge-hash-chained-evidence.jpg", alt: "Hash-chained evidence ledger for industrial autonomous assurance", code: "NB 02 · HASH-CHAINED LEDGER", caption: { en: "Append-only linkage across software builds, safety checks, and audit trails.", de: "Lückenlose Verkettung über Software-Builds, Prüfungen und Audits." } },
          { src: "/images/critical/04-neuralbridge-autonomous-assurance.jpg", alt: "NeuralBridge autonomous assurance with hash-chained safety evidence", code: "NB 03 · DRIFT DETECTION", caption: { en: "Immediate visibility when deployed configurations diverge from verified baselines.", de: "Sofortige Erkennung von Abweichungen gegenüber geprüften Baselines." } },
        ] },
      { heading: { en: "Fleet-scale industrial configuration integrity", de: "Konfigurationsintegrität im industriellen Maßstab" },
        body: { en: "Built for machine builders, integrators, and operators whose software affects safety — maintaining audit continuity alongside certified hardware safety PLCs.", de: "Für Maschinenbauer, Integratoren und Betreiber mit sicherheitsrelevanter Software — für durchgängige Auditierbarkeit neben zertifizierten Sicherheitssteuerungen." },
        plates: [
          { src: "/images/companies/06-neuralbridge-industrial-assurance-floor.jpg", alt: "Industrial floor with digital twin overlays for machine configuration integrity", code: "NB 04 · INDUSTRIAL FLOOR", caption: { en: "Configuration lineage across deployed industrial equipment.", de: "Konfigurationsnachweise über reale Industrieanlagen hinweg." } },
          { src: "/images/cool/09-industrial-safety-verification-scale.jpg", alt: "Industrial safety verification at scale", code: "NB 05 · VERIFICATION AT SCALE", caption: { en: "Structured safety evidence across multi-cell operations.", de: "Strukturierte Sicherheitsnachweise über vernetzte Anlagenflotten." } },
        ] },
    ],
  },
  foundation: {
    path: "/foundation", kicker: { en: "SHARED TECHNICAL FOUNDATION", de: "GEMEINSAMES TECHNISCHES FUNDAMENT" },
    title: { en: "Physics-informed power systems & deterministic boundaries", de: "Physikinformierte Energiesysteme & deterministische Grenzen" },
    description: { en: "How AC power-flow physics, thermal-electrical digital twins, and cryptographic verification underpin Time to Power and NeuralBridge.", de: "Wie Netzphysik, thermisch-elektrische digitale Zwillinge und kryptografische Verifikation beide Unternehmen tragen." },
    externalUrl: PORTFOLIO_URL, externalLabel: "igrimaldi.engineering ↗",
    hero: { src: "/images/cool/05-two-companies-one-foundation.jpg", alt: "Two companies sharing one technical foundation", code: "FDN 01 · SHARED ARCHITECTURE", caption: { en: "Conservation laws and verifiable audit trails across power capacity and machine assurance.", de: "Erhaltungssätze und prüfbare Nachweisketten als gemeinsame Basis." } },
    blocks: [
      { heading: { en: "Substation-to-hall physics-informed digital twins", de: "Physikinformierte Zwillinge vom Umspannwerk bis zur Halle" },
        body: { en: "Credible capacity intelligence couples HV grid topology, transformer impedance, protection selectivity, and hall thermal rejection in unified physical models.", de: "Belastbare Kapazitätsaussagen koppeln Hochspannungstopologie, Transformatorimpedanz, Schutzkoordination und Hallenthermik." },
        plates: [
          { src: "/images/companies/08-physics-informed-power-systems.jpg", alt: "Physics-informed digital twin of power systems and grid infrastructure", code: "FDN 02 · GRID PHYSICS", caption: { en: "Power-flow conservation laws grounding substation and feeder models.", de: "Lastflussgleichungen als Fundament für Umspannwerks- und Abgangsmodelle." } },
          { src: "/images/cool/07-physics-informed-data-center-twin.jpg", alt: "Physics-informed digital twin of data center power", code: "FDN 03 · HALL POWER TWIN", caption: { en: "Coupled medium-voltage and thermal state estimation for AI halls.", de: "Gekoppelte elektrische und thermische Zustandsschätzung für Rechenzentren." } },
        ] },
      { heading: { en: "Explicit envelopes & domain separation", de: "Explizite Hüllkurven & klare Domain-Trennung" },
        body: { en: "Outputs state binding physical limits and evidence classes. Personal research monographs and academic testbeds live separately at igrimaldi.engineering.", de: "Ergebnisse benennen physikalische Grenzen und Evidenzklassen. Persönliche Forschungsarbeiten liegen separat auf igrimaldi.engineering." },
        plates: [
          { src: "/images/critical/02-gridforge-capacity-envelope.jpg", alt: "GridForge capacity envelope of electrical and thermal limits", code: "FDN 04 · CAPACITY ENVELOPE", caption: { en: "Joint evaluation of ampacity, short-circuit, harmonic, and thermal ceilings.", de: "Gemeinsame Bewertung von Stromtragfähigkeit, Oberschwingungen und Thermik." } },
          { src: "/images/critical/05-physics-informed-data-center-power.jpg", alt: "Physics-informed digital twin of data center power infrastructure", code: "FDN 05 · END-TO-END PATH", caption: { en: "Electrical path fidelity from utility point of common coupling to compute racks.", de: "Durchgängige Modellierung vom Netzverknüpfungspunkt bis zum Rack." } },
        ] },
    ],
  },
  prospect: {
    path: "/prospect", kicker: { en: "CRITICAL PATH & NEAR-TERM SCALE", de: "KRITISCHER PFAD & SKALIERUNG" },
    title: { en: "Why power capacity and assurance gate near-term scale", de: "Warum Leistungskapazität und Nachweise die Skalierung bestimmen" },
    description: { en: "AI infrastructure buildout is gated by energized megawatts and interconnection queues; software-defined machinery is gated by continuous safety evidence.", de: "KI-Infrastruktur wird durch verfügbare Anschlussleistung begrenzt; softwaredefinierte Maschinen durch kontinuierliche Sicherheitsnachweise." },
    hero: { src: "/images/critical/10-power-capacity-billion-dollar-prospect.jpg", alt: "Power capacity as the critical path for AI data center expansion", code: "PATH 01 · CRITICAL PATH", caption: { en: "Energized megawatts and verified hall headroom define the pace of AI expansion.", de: "Verfügbare Anschlussleistung und geprüfte Hallenreserven bestimmen das Ausbautempo." } },
    blocks: [
      { heading: { en: "Compute ships in quarters; grid upgrades take years", de: "Compute wächst in Quartalen; Netzausbau dauert Jahre" },
        body: { en: "Transformer lead times, congested queues, and static hall derating strand valuable compute capacity. Physics-grounded capacity and siting intelligence unlock safe headroom faster.", de: "Transformator-Lieferzeiten, Warteschlangen und statische Abschläge binden Kapazität. Physikbasierte Analyse hebt sichere Reserven schneller." },
        plates: [
          { src: "/images/cool/06-ai-is-power-bound-cinematic.jpg", alt: "AI infrastructure constrained by electrical capacity", code: "PATH 02 · POWER-BOUND AI", caption: { en: "High-density compute campuses bounded by substation delivery limits.", de: "Hochdichte Rechenzentren begrenzt durch Umspannwerksreserven." } },
          { src: "/images/critical/03-interconnection-siting-intelligence.jpg", alt: "Interconnection and siting intelligence for AI power capacity", code: "PATH 03 · SITING INTELLIGENCE", caption: { en: "De-risking queue congestion and locational hosting capacity.", de: "Bewertung von Warteschlangen und lokaler Aufnahmekapazität." } },
        ] },
      { heading: { en: "Continuous verification for safety-relevant software", de: "Kontinuierliche Verifikation für sicherheitsrelevante Software" },
        body: { en: "Regulated machines update software far faster than manual compliance paperwork can follow. Hash-chained assurance keeps evidence aligned with live systems.", de: "Maschinen-Software ändert sich schneller als manuelle Dokumentation. Hash-verkettete Nachweise halten Compliance aktuell." },
        plates: [
          { src: "/images/critical/08-industrial-safety-verification.jpg", alt: "Industrial safety verification for autonomous machines", code: "PATH 04 · INDUSTRIAL VERIFICATION", caption: { en: "Tamper-evident safety verification lineage for industrial equipment.", de: "Manipulationssichere Sicherheitsnachweise für industrielle Anlagen." } },
        ] },
    ],
  },
  about: {
    path: "/about", kicker: { en: "FOUNDER · STAGE · INDEPENDENCE", de: "GRÜNDER · REIFEGRAD · UNABHÄNGIGKEIT" },
    title: { en: "Founder-led, pilot-stage companies hub", de: "Gründergeführter Unternehmens-Hub in der Pilotphase" },
    description: { en: "About Grimaldi Engineering and founder Vincenzo Ceccarelli Grimaldi — honest pilot stage, RWTH Aachen power engineering background, and domain separation.", de: "Über Grimaldi Engineering und Gründer Vincenzo Ceccarelli Grimaldi — ehrlicher Pilotstatus, RWTH-Hintergrund und klare Abgrenzung." },
    externalUrl: PORTFOLIO_URL, externalLabel: "igrimaldi.engineering ↗",
    hero: { src: "/images/companies/09-founder-engineering-workspace.jpg", alt: "Founder-led engineering workspace with capacity models and assurance dashboards", code: "ABOUT 01 · FOUNDER WORKSPACE", caption: { en: "Founder-led engineering across capacity envelopes and assurance ledgers.", de: "Gründergeführte Entwicklung über Kapazitätshüllkurven und Nachweissysteme." } },
    blocks: [
      { heading: { en: "Vincenzo Ceccarelli Grimaldi", de: "Vincenzo Ceccarelli Grimaldi" },
        body: { en: "Founder of Time to Power (Gridforge) and NeuralBridge. M.Sc. Electrical Power Engineering, RWTH Aachen University. Day-job context: ITk Fachspezialist at DB InfraGO AG (traction HV digitisation). Everything on this hub and both companies is strictly independent of, and outside the scope of, employment at DB InfraGO AG.", de: "Gründer von Time to Power (Gridforge) und NeuralBridge. M.Sc. Elektrotechnik / Energietechnik, RWTH Aachen. Beruflicher Kontext: ITk Fachspezialist bei der DB InfraGO AG (Digitalisierung Bahnstrom-Hochspannung). Alle Inhalte und Unternehmen sind vollständig unabhängig von der DB InfraGO AG." },
        plates: [
          { src: "/images/cool/08-founder-precision-workspace.jpg", alt: "Founder-led precision workspace", code: "ABOUT 02 · HONEST STAGE", caption: { en: "Pilot-stage execution stated plainly without inflated claims.", de: "Klar benannte Pilotphase ohne aufgeblähte Versprechen." } },
          { src: "/images/critical/06-founder-pilot-workspace.jpg", alt: "Founder-led pilot engineering workspace", code: "ABOUT 03 · PILOT SCOPING", caption: { en: "Direct founder engagement across Frankfurt, Aachen, and Toronto.", de: "Direkte Zusammenarbeit zwischen Frankfurt, Aachen und Toronto." } },
        ] },
    ],
  },
};
