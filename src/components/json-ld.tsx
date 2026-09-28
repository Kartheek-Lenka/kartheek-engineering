type Schema = Record<string, unknown>;

type Props = {
  /** A single schema object, or several to emit as one `@graph`. */
  data: Schema | Schema[];
};

/**
 * Renders a JSON-LD graph. Kept as its own component so every page emits
 * structured data through one reviewed path.
 */
export function JsonLd({ data }: Props) {
  const graph = { '@context': 'https://schema.org', '@graph': data };

  return (
    <script
      type="application/ld+json"
      // Content is generated from our own typed data files, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
