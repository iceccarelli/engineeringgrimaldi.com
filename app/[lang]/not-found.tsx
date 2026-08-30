/**
 * Custom 404. Next.js does not pass params into not-found, so this page
 * is deliberately bilingual — both messages, real links, status 404.
 */
export default function NotFound() {
  return (
    <main>
      <div className="sheet sheet-top">
        <div className="section">
          <span className="kicker">404</span>
          <h1>No signal on this channel.</h1>
          <p className="intro">
            The page you asked for does not exist. / Die angeforderte Seite existiert nicht.
          </p>
          <div className="cta-row">
            <a className="btn btn-glow" href="/">Home (English)</a>
            <a className="btn btn-line" href="/de">Startseite (Deutsch)</a>
            <a className="btn btn-line" href="/forge">Forge Line</a>
          </div>
        </div>
      </div>
    </main>
  );
}
