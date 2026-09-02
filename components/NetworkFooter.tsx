/**
 * The same four lines on every domain of the network. Do not localise the
 * taglines — they are identifiers, and they must match the other sites
 * character for character.
 */
export const NETWORK_LINES = [
  { host: 'igrimaldi.engineering', href: 'https://igrimaldi.engineering/', line: 'verifiable intelligence for grids and traction power' },
  { host: 'engineeringgrimaldi.com', href: 'https://engineeringgrimaldi.com/', line: 'one trade cell, shipped and measured' },
  { host: 'grimaldi.ca', href: 'https://grimaldi.ca/', line: 'logbook, podcast, reviews, books' },
  { host: 'github.com/iceccarelli', href: 'https://github.com/iceccarelli', line: 'clone or it does not exist' },
] as const;

export default function NetworkFooter({ heading }: { heading: string }) {
  return (
    <nav className="netfoot" aria-label={heading}>
      <h4>{heading}</h4>
      <ul>
        {NETWORK_LINES.map((n) => (
          <li key={n.host}>
            <a href={n.href} rel="noopener noreferrer" aria-current={n.host === 'engineeringgrimaldi.com' ? 'true' : undefined}>
              <span className="netfoot-host">{n.host}</span> — {n.line}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
