import { notFound } from 'next/navigation';

/**
 * Catch-all inside the [lang] tree: any path not matched by a real route
 * triggers the not-found boundary and returns a genuine 404 status —
 * middleware rewrites unprefixed unknown paths here too.
 */
export default function MissingPage(): never {
  notFound();
}
