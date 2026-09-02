/**
 * Custom 404. Next.js does not pass params into not-found, so this page
 * is deliberately bilingual — both messages, real links, status 404.
 */
export default function NotFound() {
  return (
    <main>
      <div className="section">
        <span className="kicker">404</span>
        <h1>No such page. / Diese Seite gibt es nicht.</h1>
        <p className="lead">
          The address does not exist. / Die Adresse existiert nicht.
        </p>
        <div className="cta-row">
          <a className="btn btn-signal" href="/palletizer">Palletizer</a>
          <a className="btn btn-line" href="/">Home (English)</a>
          <a className="btn btn-line" href="/de">Startseite (Deutsch)</a>
        </div>
      </div>
    </main>
  );
}
