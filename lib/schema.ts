import { NB_URL, PERSON_NAME, SAME_AS, SITE_NAME, SITE_URL, TTP_URL } from "./site";
export function websiteSchema() { return { "@context": "https://schema.org", "@type": "WebSite", "@id": SITE_URL + "/#website", url: SITE_URL + "/", name: SITE_NAME, inLanguage: ["en", "de"] }; }
export function organizationSchema() {
  return { "@context": "https://schema.org", "@type": "Organization", "@id": SITE_URL + "/#organization", name: SITE_NAME, url: SITE_URL + "/", founder: { "@id": SITE_URL + "/#person" },
    subOrganization: [{ "@type": "Organization", name: "Time to Power (Gridforge)", url: TTP_URL }, { "@type": "Organization", name: "NeuralBridge", url: NB_URL }] };
}
export function personSchema() { return { "@context": "https://schema.org", "@type": "Person", "@id": SITE_URL + "/#person", name: PERSON_NAME, url: "https://igrimaldi.engineering/", sameAs: [...SAME_AS] }; }
