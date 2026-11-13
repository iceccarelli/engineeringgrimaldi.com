import { NextResponse } from "next/server";
import { NB_URL, PERSON_NAME, PORTFOLIO_URL, SITE_NAME, SITE_URL, TTP_URL } from "@/lib/site";
export const dynamic = "force-static";
export function GET() {
  return NextResponse.json({ hub: SITE_NAME, url: SITE_URL, founder: PERSON_NAME, stage: "Pilot-stage · founder-led", companies: [{ name: "Time to Power (Gridforge)", url: TTP_URL, hubPath: SITE_URL + "/time-to-power" }, { name: "NeuralBridge", url: NB_URL, hubPath: SITE_URL + "/neuralbridge" }], technicalSite: PORTFOLIO_URL });
}
