'use client';

/**
 * Ask.tsx — the bench concierge (AWS "Ask" pattern, instrument-lab skin).
 * Answers come from the client-side index in lib/dynamic.ts: instant,
 * four locales, honestly labelled, zero network calls.
 */

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { askEntries, askSuggestions, askUi, matchAsk, type AskEntry } from '@/lib/dynamic';

type Message =
  | { from: 'visitor'; text: string }
  | { from: 'guide'; text: string; links: { label: string; href: string }[] };

export default function Ask() {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages, open]);

  const answerWith = (entry: AskEntry | null, visitorText: string) => {
    const guide: Message = entry
      ? {
          from: 'guide',
          text: entry.answer[locale],
          links: entry.links.map((link) => ({ label: link.label[locale], href: link.href })),
        }
      : {
          from: 'guide',
          text: askUi.fallback[locale],
          links: [{ label: 'vincenzo@igrimaldi.engineering', href: 'mailto:vincenzo@igrimaldi.engineering' }],
        };
    setMessages((prev) => [...prev, { from: 'visitor', text: visitorText }, guide]);
  };

  const ask = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    answerWith(matchAsk(trimmed), trimmed);
    setInput('');
  };

  const askEntry = (id: string) => {
    const entry = askEntries.find((candidate) => candidate.id === id);
    if (entry) answerWith(entry, entry.question[locale]);
  };

  const chips = (
    <>
      {askSuggestions.map((id) => {
        const entry = askEntries.find((candidate) => candidate.id === id);
        if (!entry) return null;
        return (
          <button key={id} type="button" className="ask-chip" onClick={() => askEntry(id)}>
            {entry.question[locale]}
          </button>
        );
      })}
    </>
  );

  return (
    <>
      {open && (
        <aside className="ask-panel" role="dialog" aria-label={askUi.title[locale]}>
          <header className="ask-head">
            <div className="ask-head-row">
              <strong>{askUi.title[locale]}</strong>
              <span className="ask-badge">{askUi.badge[locale]}</span>
              <button type="button" className="ask-close" onClick={() => setOpen(false)} aria-label={askUi.close[locale]}>
                ×
              </button>
            </div>
            <p>{askUi.sub[locale]}</p>
          </header>

          <div className="ask-thread" ref={threadRef}>
            {messages.length === 0 && (
              <div className="ask-starter">
                <span className="ask-starter-label">{askUi.suggestionsLabel[locale]}</span>
                {chips}
              </div>
            )}

            {messages.map((message, i) =>
              message.from === 'visitor' ? (
                <div key={i} className="ask-msg ask-msg-visitor">
                  {message.text}
                </div>
              ) : (
                <div key={i} className="ask-msg ask-msg-guide">
                  <p>{message.text}</p>
                  {message.links.length > 0 && (
                    <div className="ask-links">
                      {message.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                          onClick={link.href.startsWith('#') ? () => setOpen(false) : undefined}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ),
            )}

            {messages.length > 0 && <div className="ask-starter ask-starter-inline">{chips}</div>}
          </div>

          <form
            className="ask-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              ask(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={askUi.placeholder[locale]}
              aria-label={askUi.placeholder[locale]}
            />
            <button type="submit" aria-label={askUi.send[locale]}>
              →
            </button>
          </form>

          <footer className="ask-foot">{askUi.disclaimer[locale]}</footer>
        </aside>
      )}

      <button
        type="button"
        className="ask-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={askUi.launcher[locale]}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>
    </>
  );
}
