import { CONTACT_EMAIL, NB_URL, PERSON_NAME, PORTFOLIO_URL, SITE_NAME, SITE_URL, TTP_URL } from "@/lib/site";
export const dynamic = "force-static";
export function GET() {
  const lines = ["# " + SITE_NAME + " — Companies Hub", "> Pilot-stage, founder-led hub for Time to Power (Gridforge) and NeuralBridge, operated by " + PERSON_NAME + ".", "- Time to Power (Gridforge): " + TTP_URL + " (" + SITE_URL + "/time-to-power)", "- NeuralBridge: " + NB_URL + " (" + SITE_URL + "/neuralbridge)", "- Technical portfolio: " + PORTFOLIO_URL + " | Contact: " + CONTACT_EMAIL];
  return new Response(lines.join("\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
