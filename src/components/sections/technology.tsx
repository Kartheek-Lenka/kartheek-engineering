import { techGroups } from '@/data/technology';
import { Container, Section, SectionHeader } from '@/components/ui/section';
import { Reveal } from '@/components/animations/reveal';

export function Technology() {
  return (
    <Section id="technology" aria-labelledby="technology-title">
      <Container className="py-20 md:py-28">
          <SectionHeader
            index="08"
            eyebrow="Capability"
            id="technology-title"
            title="Stack, grouped by what it is for."
            lede="The technology follows the product — a Python service where the work is inference, Postgres where the data is relational, whatever the cloud provider is cheapest and most reliable in. These are the tools I reach for, and why."
          />

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-5">
          {techGroups.map((group, groupIndex) => (
            <Reveal
              key={group.id}
              delay={groupIndex * 50}
              className="flex flex-col bg-canvas p-5 transition-colors duration-300 hover:bg-surface md:p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="t-label text-ink">{group.label}</h3>
                <span className="t-meta text-ink-4">
                  {String(groupIndex + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="t-body-sm mt-2 text-ink-4">{group.note}</p>

              <ul className="mt-6 flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between gap-3">
                    <span
                      className={
                        item.level === 'primary'
                          ? 'font-mono text-[0.8125rem] text-ink'
                          : 'font-mono text-[0.8125rem] text-ink-2'
                      }
                    >
                      {item.name}
                    </span>
                    {item.level === 'primary' && (
                      <span
                        aria-hidden="true"
                        title="Primary tool"
                        className="h-1 w-1 shrink-0 rounded-full bg-accent"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <p className="t-body-sm mt-6 max-w-[70ch] text-ink-4">
          Also used where the problem calls for it: GCP, CloudFormation, Ansible, ELK,
          SonarQube, Redux Toolkit, Python, shell scripting, Express, MySQL, REST and JWT
          authentication.{' '}
          <span className="text-ink-3">
            Recommendations follow the requirement, not the other way round.
          </span>
        </p>
      </Container>
    </Section>
  );
}
