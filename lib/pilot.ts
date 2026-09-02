/**
 * The one commercial door on this domain. A mailto with a fixed subject so
 * the request is filterable; no form, no calendar theatre.
 */
import { CONTACT_EMAIL } from './site';

export const OPTIMIZER_URL = 'https://palletizer-app.vercel.app/';
export const PALLETIZER_REPO = 'https://github.com/iceccarelli/palletizer';
export const PALLETIZER_ENGINE_COMMIT = '6c5e9d96ce605b6b1678b9c5ed3ded6af0fef160';

export const PILOT_SUBJECT = 'Palletizer-30-day-pilot';
export const PILOT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(PILOT_SUBJECT)}`;

export const TEARDOWN_SUBJECT = 'Packaging-teardown';
export const TEARDOWN_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(TEARDOWN_SUBJECT)}`;

export const CONNECT_MAILTO = `mailto:${CONTACT_EMAIL}`;
