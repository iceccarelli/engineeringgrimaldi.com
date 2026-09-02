/**
 * Single source of truth for site-wide constants.
 * No secrets here — env-dependent values read from process.env with
 * explicit placeholders so a missing var is visible, never silent.
 */

export const SITE_URL = 'https://engineeringgrimaldi.com';
export const SITE_NAME = 'Grimaldi Engineering';
export const PERSON_NAME = 'Vincenzo Ceccarelli Grimaldi';
export const PERSON_ID = 'https://igrimaldi.engineering/#person';

/** Upstream product repository and its current demo host. The demo host
 *  is never advertised in a heading; it is a redirect target in waiting. */
export const PRODUCT_REPO = 'https://github.com/iceccarelli/palletizer';
export const PRODUCT_DEMO = 'https://palletizer-app.vercel.app';

/** Intake forwarding. Set INTAKE_WEBHOOK_URL in Vercel env to a JSON
 *  endpoint (e.g. a mail relay or Zapier hook). Without it the intake
 *  route answers 503 intake_unconfigured and the form shows the
 *  fallback address instead of faking a success. */
export const INTAKE_PATH = '/api/intake';

export const SAME_AS = [
  'https://github.com/iceccarelli',
  'https://www.linkedin.com/in/vincenzo-ceccarelli-grimaldi-2912b42a0',
  'https://x.com/Vince87Grimaldi',
  'https://www.instagram.com/grimaldiengineering/',
  'https://igrimaldi.engineering/',
  'https://grimaldi.ca/',
] as const;

export const CONTACT_EMAIL = 'vincenzo@igrimaldi.engineering'; // legal/Impressum contact only — never a CTA
