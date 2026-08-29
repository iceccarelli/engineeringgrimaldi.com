'use client';

/**
 * Rail.tsx — cascading scrollable row (Netflix pattern, instrument-lab skin).
 * CSS scroll-snap underneath; the paddles and counter are enhancement only,
 * so touch and keyboard scrolling stay native.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

type RailProps = {
  children: ReactNode[];
  ariaLabel: string;
  prevLabel: string;
  nextLabel: string;
};

export default function Rail({ children, ariaLabel, prevLabel, nextLabel }: RailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const count = children.length;

  const readPosition = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setCanPrev(rail.scrollLeft > 8);
    setCanNext(rail.scrollLeft < max - 8);
    if (max <= 0) {
      setIndex(0);
      return;
    }
    setIndex(Math.min(count - 1, Math.round((rail.scrollLeft / max) * (count - 1))));
  }, [count]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    readPosition();
    rail.addEventListener('scroll', readPosition, { passive: true });
    window.addEventListener('resize', readPosition);
    return () => {
      rail.removeEventListener('scroll', readPosition);
      window.removeEventListener('resize', readPosition);
    };
  }, [readPosition]);

  const nudge = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className="rail" role="group" aria-label={ariaLabel}>
      <div className="rail-track" ref={railRef} tabIndex={0}>
        {children}
      </div>
      <div className="rail-controls">
        <button type="button" className="rail-paddle" onClick={() => nudge(-1)} disabled={!canPrev} aria-label={prevLabel}>
          &#8249;
        </button>
        <span className="rail-counter">
          {index + 1} / {count}
        </span>
        <button type="button" className="rail-paddle" onClick={() => nudge(1)} disabled={!canNext} aria-label={nextLabel}>
          &#8250;
        </button>
      </div>
    </div>
  );
}
