import { Container } from '@/components/ui/section';

/**
 * Route loading placeholder.
 *
 * Reserves vertical space close to the eventual content height so navigation
 * does not shift the page. The accent bar is the only moving element, and it is
 * slow enough not to be distracting.
 */
export function Loading() {
  return (
    <div
      className="pt-32 pb-24 md:pt-40 md:pb-32"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <Container>
        <div className="max-w-[64ch]">
          <div className="h-3 w-24 rounded-xs bg-inset" />
          <div className="mt-6 h-10 w-full max-w-[28rem] rounded-md bg-inset" />
          <div className="mt-4 h-10 w-full max-w-[20rem] rounded-md bg-inset" />
          <div className="mt-8 h-4 w-full rounded-xs bg-inset" />
          <div className="mt-2.5 h-4 w-4/5 rounded-xs bg-inset" />
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-3 bg-canvas p-6">
              <div className="h-3 w-16 rounded-xs bg-inset" />
              <div className="h-5 w-3/4 rounded-xs bg-inset" />
              <div className="h-3 w-full rounded-xs bg-inset" />
              <div className="h-3 w-2/3 rounded-xs bg-inset" />
            </div>
          ))}
        </div>

        <p className="sr-only">Loading content</p>
      </Container>
    </div>
  );
}
