/**
 * dynamic.ts — the dynamic layer's data + typed strings (v5).
 *
 * Carries its own four-locale records (instead of strings.json) so the rail
 * cards, live-proof row and the Ask concierge stay one self-contained,
 * type-checked unit. Invariant unchanged: nothing here links to a surface a
 * visitor cannot open, and the concierge says honestly what it is — an
 * instant client-side guide over this index, not a server-side LLM.
 */

import type { Locale } from './i18n';

export type L = Record<Locale, string>;

export const railUi: { prev: L; next: L; liveKicker: L; liveTitle: L; liveIntro: L; liveBadge: L } = {
  prev: { en: 'Previous', es: 'Anterior', de: 'Zurück', zh: '上一个' },
  next: { en: 'Next', es: 'Siguiente', de: 'Weiter', zh: '下一个' },
  liveKicker: { en: 'Proof, live', es: 'Prueba, en vivo', de: 'Beweis, live', zh: '实时验证' },
  liveTitle: {
    en: 'Every deployment on the bench, powered on',
    es: 'Cada despliegue en el banco, encendido',
    de: 'Jedes Deployment auf der Werkbank, eingeschaltet',
    zh: '工作台上的每个部署，均已通电',
  },
  liveIntro: {
    en: 'The network does not describe work — it powers it on. Each card opens a production surface.',
    es: 'La red no describe el trabajo — lo enciende. Cada tarjeta abre una superficie en producción.',
    de: 'Das Netzwerk beschreibt Arbeit nicht — es schaltet sie ein. Jede Karte öffnet eine produktive Oberfläche.',
    zh: '网络不是描述工作，而是让工作运转。每张卡片都打开一个生产环境。',
  },
  liveBadge: { en: 'Live', es: 'En vivo', de: 'Live', zh: '在线' },
};

export type Deployment = { id: string; href: string; host: string; title: L; desc: L };

export const liveDeployments: Deployment[] = [
  {
    id: 'palletizer-app',
    href: 'https://palletizer-app.vercel.app',
    host: 'palletizer-app.vercel.app',
    title: { en: 'Palletizer optimizer', es: 'Optimizador de paletizado', de: 'Palettier-Optimierer', zh: '码垛优化器' },
    desc: {
      en: 'Mixed-SKU pallet planning from the shipped Forge Line product.',
      es: 'Planificación de palets multi-SKU del producto entregado de la Línea Forge.',
      de: 'Mixed-SKU-Palettenplanung aus dem ausgelieferten Forge-Line-Produkt.',
      zh: '来自已交付 Forge 产品的混合 SKU 托盘规划。',
    },
  },
  {
    id: 'scope',
    href: '#scope',
    host: 'engineeringgrimaldi.com/#scope',
    title: { en: 'Grid-frequency scope', es: 'Osciloscopio de frecuencia', de: 'Netzfrequenz-Scope', zh: '电网频率示波器' },
    desc: {
      en: 'The droop-model instrument on this page — real physics, running now.',
      es: 'El instrumento de modelo droop en esta página — física real, corriendo ahora.',
      de: 'Das Droop-Modell-Instrument auf dieser Seite — echte Physik, läuft jetzt.',
      zh: '本页的下垂模型仪器 — 真实物理，正在运行。',
    },
  },
  {
    id: 'thesis',
    href: 'https://physics-informed.vercel.app/',
    host: 'physics-informed.vercel.app',
    title: { en: 'Thesis simulator', es: 'Simulador de la tesis', de: 'Thesis-Simulator', zh: '论文仿真器' },
    desc: {
      en: 'The RWTH Aachen master thesis as an interactive deployment.',
      es: 'La tesis de RWTH Aachen como despliegue interactivo.',
      de: 'Die RWTH-Masterarbeit als interaktives Deployment.',
      zh: 'RWTH 亚琛硕士论文的交互式部署。',
    },
  },
  {
    id: 'portfolio',
    href: 'https://igrimaldi.engineering',
    host: 'igrimaldi.engineering',
    title: { en: 'The credibility engine', es: 'El motor de credibilidad', de: 'Die Glaubwürdigkeits-Engine', zh: '可信度引擎' },
    desc: {
      en: 'Capability register and the full work registry behind the Forge Line.',
      es: 'Registro de capacidades y el registro completo de trabajo detrás de la Línea Forge.',
      de: 'Kompetenzregister und das vollständige Arbeitsregister hinter der Forge Line.',
      zh: 'Forge 产品线背后的能力登记与完整工作档案。',
    },
  },
  {
    id: 'ca',
    href: 'https://grimaldi.ca',
    host: 'grimaldi.ca',
    title: { en: 'The person behind it', es: 'La persona detrás', de: 'Die Person dahinter', zh: '背后的人' },
    desc: {
      en: 'The journey, two manuscripts with public proof engines, the ventures.',
      es: 'El camino, dos manuscritos con motores de prueba públicos, las empresas.',
      de: 'Der Weg, zwei Manuskripte mit öffentlichen Beweis-Engines, die Ventures.',
      zh: '历程、两部配有公开验证引擎的书稿、创业项目。',
    },
  },
  {
    id: 'card',
    href: 'https://igrimaldi.engineering/card',
    host: 'igrimaldi.engineering/card',
    title: { en: 'Digital business card', es: 'Tarjeta de visita digital', de: 'Digitale Visitenkarte', zh: '数字名片' },
    desc: {
      en: 'vCard, QR code and the network entity graph.',
      es: 'vCard, código QR y el grafo de entidad de la red.',
      de: 'vCard, QR-Code und der Entity-Graph des Netzwerks.',
      zh: 'vCard、二维码与网络实体图谱。',
    },
  },
];

/* ------------------------------------------------------------------ */
/* Ask — the bench concierge                                           */
/* ------------------------------------------------------------------ */

export const askUi: {
  launcher: L;
  title: L;
  badge: L;
  sub: L;
  placeholder: L;
  send: L;
  suggestionsLabel: L;
  disclaimer: L;
  fallback: L;
  close: L;
} = {
  launcher: { en: 'Ask Grimaldi Engineering', es: 'Pregunta a Grimaldi Engineering', de: 'Grimaldi Engineering fragen', zh: '询问 Grimaldi Engineering' },
  title: { en: 'Ask the bench', es: 'Pregunta al banco', de: 'Die Werkbank fragen', zh: '问工作台' },
  badge: { en: 'Built-in', es: 'Integrado', de: 'Integriert', zh: '内置' },
  sub: {
    en: 'Instant answers on the Forge Line, the instruments and the network.',
    es: 'Respuestas instantáneas sobre la Línea Forge, los instrumentos y la red.',
    de: 'Sofortige Antworten zur Forge Line, den Instrumenten und dem Netzwerk.',
    zh: '即刻解答 Forge 产品线、仪器与网络相关问题。',
  },
  placeholder: { en: 'Ask a question…', es: 'Haz una pregunta…', de: 'Stellen Sie eine Frage…', zh: '输入问题…' },
  send: { en: 'Send', es: 'Enviar', de: 'Senden', zh: '发送' },
  suggestionsLabel: { en: 'Start with one of these:', es: 'Empieza con una de estas:', de: 'Beginnen Sie mit einer davon:', zh: '从这些问题开始：' },
  disclaimer: {
    en: 'Instant guide over this site’s own content — runs in your browser, no data leaves it.',
    es: 'Guía instantánea sobre el contenido de este sitio — corre en tu navegador, ningún dato sale de él.',
    de: 'Sofort-Guide über die Inhalte dieser Seite — läuft im Browser, keine Daten verlassen ihn.',
    zh: '基于本站内容的即时向导 — 在您的浏览器中运行，数据不外传。',
  },
  fallback: {
    en: 'Not on the bench yet. Email is the fastest route — or pick a topic below.',
    es: 'Aún no está en el banco. El correo es la vía más rápida — o elige un tema abajo.',
    de: 'Noch nicht auf der Werkbank. E-Mail ist am schnellsten — oder wählen Sie unten ein Thema.',
    zh: '暂未收录。发邮件最快 — 或从下方选择话题。',
  },
  close: { en: 'Close', es: 'Cerrar', de: 'Schließen', zh: '关闭' },
};

export type AskLink = { label: L; href: string };
export type AskEntry = { id: string; keywords: string[]; question: L; answer: L; links: AskLink[] };

export const askEntries: AskEntry[] = [
  {
    id: 'forge',
    keywords: ['forge', 'trades', 'product', 'line', 'automation', 'oficio', 'producto', 'automatización', 'automatizacion', 'handwerk', 'produkt', 'automatisierung', '行业', '产品', '自动化'],
    question: { en: 'What is the Forge Line?', es: '¿Qué es la Línea Forge?', de: 'Was ist die Forge Line?', zh: '什么是 Forge 产品线？' },
    answer: {
      en: 'Trades 2.0: one automation product per trade. Palletizer OS is shipped with a live optimizer; FloorForge, PaintForge and DryForge AI are in development with public code; ForgeOS is the robotic OS being built behind the whole line.',
      es: 'Oficios 2.0: un producto de automatización por oficio. Palletizer OS está entregado con optimizador en vivo; FloorForge, PaintForge y DryForge AI en desarrollo con código público; ForgeOS es el SO robótico detrás de toda la línea.',
      de: 'Handwerk 2.0: ein Automatisierungsprodukt pro Gewerk. Palletizer OS ist ausgeliefert (Live-Optimierer); FloorForge, PaintForge und DryForge AI in Entwicklung mit öffentlichem Code; ForgeOS ist das robotische OS hinter der Linie.',
      zh: '行业 2.0：每个行业一款自动化产品。Palletizer OS 已交付并有在线优化器；FloorForge、PaintForge、DryForge AI 开发中且代码公开；ForgeOS 是整条产品线背后在建的机器人操作系统。',
    },
    links: [
      { label: { en: 'The Forge Line', es: 'La Línea Forge', de: 'Die Forge Line', zh: 'Forge 产品线' }, href: '#forge' },
      { label: { en: 'Live optimizer', es: 'Optimizador en vivo', de: 'Live-Optimierer', zh: '在线优化器' }, href: 'https://palletizer-app.vercel.app' },
    ],
  },
  {
    id: 'palletizer',
    keywords: ['palletizer', 'pallet', 'optimizer', 'sku', 'paletiz', 'palettier', '码垛', '托盘', 'shipped', 'entregado'],
    question: { en: 'What does Palletizer OS do?', es: '¿Qué hace Palletizer OS?', de: 'Was macht Palletizer OS?', zh: 'Palletizer OS 是做什么的？' },
    answer: {
      en: 'A hardware-agnostic, deterministic software foundation for end-of-line palletizing: control loops, safety logic, mixed-SKU planning and fleet telemetry. The optimizer is deployed and open to use; the source is public on GitHub.',
      es: 'Una base de software determinista y agnóstica al hardware para paletizado de fin de línea: bucles de control, lógica de seguridad, planificación multi-SKU y telemetría de flota. El optimizador está desplegado y abierto; el código es público en GitHub.',
      de: 'Eine hardware-agnostische, deterministische Software-Basis für End-of-Line-Palettieren: Regelkreise, Sicherheitslogik, Mixed-SKU-Planung und Flotten-Telemetrie. Der Optimierer ist deployt und offen nutzbar; der Quellcode ist öffentlich.',
      zh: '面向末端产线码垛的硬件无关确定性软件基座：控制回路、安全逻辑、混合 SKU 规划与机队遥测。优化器已上线开放使用，源码在 GitHub 公开。',
    },
    links: [
      { label: { en: 'Open the optimizer', es: 'Abrir el optimizador', de: 'Optimierer öffnen', zh: '打开优化器' }, href: 'https://palletizer-app.vercel.app' },
      { label: { en: 'Source', es: 'Código', de: 'Quellcode', zh: '源码' }, href: 'https://github.com/iceccarelli/palletizer' },
    ],
  },
  {
    id: 'scope',
    keywords: ['scope', 'oscilloscope', 'frequency', 'droop', 'physics', 'grid', 'hertz', 'hz', 'osciloscopio', 'frecuencia', 'física', 'fisica', 'frequenz', 'physik', 'netz', '示波器', '频率', '物理', '电网'],
    question: { en: 'What is the instrument on this page?', es: '¿Qué es el instrumento de esta página?', de: 'Was ist das Instrument auf dieser Seite?', zh: '本页的仪器是什么？' },
    answer: {
      en: 'A live three-phase grid-frequency scope running a real droop model: Δf = −f·droop·ΔP, with the rate of change of frequency bounded by system inertia. Move the load and inertia sliders and the trace answers with correct physics.',
      es: 'Un osciloscopio trifásico de frecuencia de red con un modelo droop real: Δf = −f·droop·ΔP, con la derivada de frecuencia acotada por la inercia del sistema. Mueve los controles de carga e inercia y la traza responde con física correcta.',
      de: 'Ein Live-Dreiphasen-Netzfrequenz-Scope mit echtem Droop-Modell: Δf = −f·Droop·ΔP, die Frequenzänderungsrate durch die Systemträgheit begrenzt. Bewegen Sie Last- und Trägheitsregler — die Kurve antwortet mit korrekter Physik.',
      zh: '一台实时三相电网频率示波器，运行真实的下垂模型：Δf = −f·droop·ΔP，频率变化率受系统惯量约束。拖动负载与惯量滑块，波形以正确的物理规律响应。',
    },
    links: [{ label: { en: 'To the scope', es: 'Al osciloscopio', de: 'Zum Scope', zh: '前往示波器' }, href: '#scope' }],
  },
  {
    id: 'who',
    keywords: ['who', 'vincenzo', 'grimaldi', 'behind', 'network', 'quién', 'quien', 'red', 'wer', 'netzwerk', '谁', '网络', 'about', 'domain'],
    question: { en: 'Who builds this?', es: '¿Quién construye esto?', de: 'Wer baut das?', zh: '这是谁构建的？' },
    answer: {
      en: 'Vincenzo Grimaldi — electrical engineer and software developer, grid networks engineering at DB InfraGO. This is the product site of a three-domain network: igrimaldi.engineering carries the full work registry, grimaldi.ca carries the person and the books.',
      es: 'Vincenzo Grimaldi — ingeniero electricista y desarrollador de software, ingeniería de redes en DB InfraGO. Este es el sitio de producto de una red de tres dominios: igrimaldi.engineering lleva el registro completo de trabajo, grimaldi.ca lleva la persona y los libros.',
      de: 'Vincenzo Grimaldi — Elektroingenieur und Softwareentwickler, Netzingenieur bei DB InfraGO. Dies ist die Produktseite eines Drei-Domain-Netzwerks: igrimaldi.engineering trägt das vollständige Arbeitsregister, grimaldi.ca die Person und die Bücher.',
      zh: 'Vincenzo Grimaldi — 电气工程师兼软件开发者，任职于 DB InfraGO 电网工程。本站是三域名网络中的产品站：igrimaldi.engineering 承载完整工作档案，grimaldi.ca 承载个人与著作。',
    },
    links: [
      { label: { en: 'Work registry', es: 'Registro de trabajo', de: 'Arbeitsregister', zh: '工作档案' }, href: 'https://igrimaldi.engineering' },
      { label: { en: 'Business card', es: 'Tarjeta de visita', de: 'Visitenkarte', zh: '数字名片' }, href: 'https://igrimaldi.engineering/card' },
    ],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'hire', 'integrator', 'partner', 'invest', 'contacto', 'correo', 'contratar', 'kontakt', 'e-mail', 'anfrage', '联系', '合作', '投资'],
    question: { en: 'How do I get in touch?', es: '¿Cómo contacto?', de: 'Wie nehme ich Kontakt auf?', zh: '如何联系？' },
    answer: {
      en: 'Email vincenzo@igrimaldi.engineering — integrators, factory operators, trades businesses and investors welcome. The digital business card carries every other channel.',
      es: 'Escribe a vincenzo@igrimaldi.engineering — integradores, operadores de planta, negocios de oficios e inversores bienvenidos. La tarjeta digital lleva todos los demás canales.',
      de: 'E-Mail an vincenzo@igrimaldi.engineering — Integratoren, Betreiber, Handwerksbetriebe und Investoren willkommen. Die digitale Visitenkarte enthält alle weiteren Kanäle.',
      zh: '发邮件至 vincenzo@igrimaldi.engineering — 欢迎集成商、工厂运营方、行业企业与投资人。数字名片包含其他全部渠道。',
    },
    links: [
      { label: { en: 'Email', es: 'Correo', de: 'E-Mail', zh: '邮件' }, href: 'mailto:vincenzo@igrimaldi.engineering' },
      { label: { en: 'Business card', es: 'Tarjeta', de: 'Visitenkarte', zh: '名片' }, href: 'https://igrimaldi.engineering/card' },
    ],
  },
];

export const askSuggestions = ['forge', 'palletizer', 'scope', 'contact'];

export function matchAsk(query: string): AskEntry | null {
  const q = query.toLowerCase();
  let best: AskEntry | null = null;
  let bestScore = 0;
  for (const entry of askEntries) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.length > 3 ? 2 : 1;
    }
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : null;
}
