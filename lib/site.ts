/**
 * Single source of truth for site-wide constants.
 * No secrets here — env-dependent values read from process.env with
 * explicit placeholders so a missing var is visible, never silent.
 */

export const SITE_URL = 'https://engineeringgrimaldi.com';
export const SITE_NAME = 'Grimaldi Engineering';
export const PERSON_NAME = 'Vincenzo Ceccarelli Grimaldi';
export const PERSON_ID = 'https://igrimaldi.engineering/#person';

/** Cal.com booking URL. Set NEXT_PUBLIC_CAL_URL in Vercel env.
 *  The fallback is a visible placeholder, never a fake working link. */
export const CAL_URL =
  process.env.NEXT_PUBLIC_CAL_URL ?? 'https://cal.com/REPLACE-ME/bench-review';

export const CAL_QUERY = '?utm_source=engineeringgrimaldi&source=engineeringgrimaldi.com';

export const SAME_AS = [
  'https://github.com/iceccarelli',
  'https://www.linkedin.com/in/vincenzo-ceccarelli-grimaldi-2912b42a0',
  'https://x.com/Vince87Grimaldi',
  'https://www.instagram.com/grimaldiengineering/',
  'https://igrimaldi.engineering/',
  'https://grimaldi.ca/',
] as const;

export const CONTACT_EMAIL = 'vincenzo@igrimaldi.engineering'; // legal/Impressum contact only — never a CTA
