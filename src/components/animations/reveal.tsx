'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/components/animations/use-reduced-motion';

/**
 * Section reveal.
 *
 * Motion philosophy: a single, short, one-way entrance that explains where a
 * block came from. No looping, no parallax, no scroll hijacking, and nothing
 * that delays the content from being readable — the element is in the DOM and
 * present before it animates, and reduced-motion users get it immediately.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as: Tag = 'div',
  once = true,
  amount = 0.2,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'span' | 'section' | 'article';
  once?: boolean;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (or a browser without support): show content.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: amount, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount, once, reduced]);

  const style: React.CSSProperties = reduced
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translate3d(0, ${y}px, 0)`,
        transition: `opacity 620ms var(--ease-out-expo) ${delay}ms, transform 620ms var(--ease-out-expo) ${delay}ms`,
        willChange: visible ? 'auto' : 'opacity, transform',
      };

  return (
    <Tag
      // @ts-expect-error -- generic element ref, the union above keeps call sites honest
      ref={ref}
      style={style}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * Staggered list reveal. Each child animates in sequence so a group reads as
 * one movement rather than several.
 */
export function RevealGroup({
  children,
  className,
  step = 60,
  baseDelay = 0,
  itemClassName,
}: {
  children: ReactNode[];
  className?: string;
  step?: number;
  baseDelay?: number;
  itemClassName?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Reveal key={index} delay={baseDelay + index * step} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
