import type { Metadata } from "next";
import HubInquiryForm from "@/components/HubInquiryForm";
import Plate from "@/components/Plate";
import { isLang, pageAlternates, type Lang } from "@/lib/i18n";
import { NB_URL, TTP_URL } from "@/lib/site";
export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  return { title: lang === "de" ? "Anfrage & Kontakt" : "Inquiry & Contact", description: "Pilot inquiries for Time to Power (Gridforge) and NeuralBridge.", alternates: pageAlternates(lang, "/contact") };
}
export default function ContactPage({ params }: { params: { lang: string } }) {
  const lang: Lang = isLang(params.lang) ? params.lang : "en";
  const de = lang === "de";
  return (
    <main><section className="section">
      <span className="kicker kicker-signal">{de ? "PILOT- & UNTERNEHMENSANFRAGEN" : "COMPANY & PILOT INQUIRIES"}</span>
      <h1>{de ? "Direkte Anfragewege" : "Direct inquiry paths"}</h1>
      <p className="lead">{de ? "Besuchen Sie direkt timetopower.ai oder neuralbridge.io — oder senden Sie hier eine zugeordnete Pilotanfrage." : "Visit timetopower.ai or neuralbridge.io directly, or submit a tagged pilot inquiry below."}</p>
      <div className="cta-row"><a className="btn btn-signal" href={TTP_URL} rel="noopener noreferrer">timetopower.ai ↗</a><a className="btn btn-signal" href={NB_URL} rel="noopener noreferrer">neuralbridge.io ↗</a></div>
      <HubInquiryForm lang={lang} />
      <div style={{ marginTop: 32 }}><Plate src="/images/companies/10-companies-hub-status-surface.jpg" alt="Clean companies hub status surface showing Time to Power and NeuralBridge" code="HUB · ROUTING SURFACE" caption={de ? "Klare Zuordnung zwischen Dach-Hub und beiden Produktseiten." : "Clean routing surface connecting operators to Time to Power and NeuralBridge."} /></div>
    </section></main>
  );
}
