/**
 * Reading time.
 *
 * 220 words per minute is the commonly cited average for adult non-skimmed
 * prose. Code blocks and frontmatter are excluded so a short post with one
 * snippet does not claim a five minute read.
 */
const WORDS_PER_MINUTE = 220;

export function readingTime(markdown: string): number {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, ' ') // fenced code
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links keep their label
    .replace(/^[#>\-*+\s]+/gm, ' ') // block markers
    .replace(/[*_~#>|]/g, ' '); // emphasis and table pipes

  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
