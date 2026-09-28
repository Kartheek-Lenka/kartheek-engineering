/**
 * Deliberately not a `clsx` + `tailwind-merge` dependency. The component set
 * here is small and the strings are short, so a two-line implementation avoids
 * shipping two libraries to remove a class name.
 */

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Deterministic id helper for label/description wiring. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function absoluteUrl(path: string, base: string): string {
  return new URL(path, base).toString();
}
