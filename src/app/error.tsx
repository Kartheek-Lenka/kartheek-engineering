'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/analytics-client';

/**
 * Route error boundary.
 *
 * Client-side only. Shows the reference for the error in development, a plain
 * apology in production, and a way to get back to a working page. No stack
 * traces, no error text, or source content in production.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    track({ name: 'inquiry_error' });
    console.error('[route error]', error);
  }, [error]);

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-[70vh] items-center py-24">
      <div className="mx-auto w-full max-w-[52rem] px-5 md:px-8">
        <p className="t-label text-accent-ink">Something broke</p>
        <h1 className="t-h1 mt-5 text-balance">
          That page failed to render.
        </h1>
        <p className="t-body mt-5 max-w-[52ch]">
          An unexpected error occurred on my side, not yours. Reloading usually fixes it.
          If it does not, tell me what you were doing and I will fix the actual problem.
        </p>

        {isDev && (
          <pre className="mt-8 overflow-x-auto rounded-lg border border-error/30 bg-error-tint p-4 font-mono text-xs text-error">
            {error.message}
            {error.digest ? `\n\ndigest: ${error.digest}` : ''}
          </pre>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button
            variant="secondary"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Go home
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              window.location.href = '/contact';
            }}
          >
            Report it
          </Button>
        </div>
      </div>
    </div>
  );
}
