import { useState } from "react";
import { ChevronDown, Syringe } from "lucide-react";
import { RISKS, SEVERITY_LABEL, formatInr, type Scope } from "@/lib/cyber-data";
import { cn } from "@/lib/utils";

const SEV_COLOR: Record<string, string> = {
  critical: "var(--alarm)",
  elevated: "var(--caution)",
  guarded: "var(--vital)",
};

export function RiskAccordion({ scope }: { scope: Scope }) {
  const [open, setOpen] = useState<string | null>(RISKS[0]?.id ?? null);
  const factor = scope.exposureCr / 620;

  return (
    <section aria-labelledby="chart-heading" className="rounded-lg panel">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-graphite-line px-4 py-3 sm:px-5">
        <div>
          <h2 id="chart-heading" className="text-base font-semibold">
            Risk chart
          </h2>
          <p className="text-xs text-muted-foreground">
            Diagnoses ranked by annualised loss expectancy · {scope.label}
          </p>
        </div>
        <span className="text-tick text-muted-foreground">{RISKS.length} findings</span>
      </div>

      <ul className="divide-y divide-border">
        {RISKS.map((risk) => {
          const isOpen = open === risk.id;
          const ale = risk.aleCr * factor;
          return (
            <li key={risk.id}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : risk.id)}
                  aria-expanded={isOpen}
                  aria-controls={`panel-${risk.id}`}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary/50 sm:px-5"
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: SEV_COLOR[risk.severity],
                      boxShadow: `0 0 10px ${SEV_COLOR[risk.severity]}`,
                    }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{risk.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {risk.vector}
                    </span>
                  </span>
                  <span className="hidden text-right sm:block">
                    <span className="block font-mono text-sm">{formatInr(ale)}</span>
                    <span className="text-tick text-muted-foreground">
                      {SEVERITY_LABEL[risk.severity]} · p{Math.round(risk.likelihood * 100)}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>
              </h3>

              {isOpen && (
                <div
                  id={`panel-${risk.id}`}
                  className="grid gap-5 border-t border-graphite-line bg-obsidian/60 px-4 py-5 sm:grid-cols-2 sm:px-5"
                >
                  <div>
                    <p className="text-tick text-muted-foreground">Diagnosis</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      {risk.diagnosis}
                    </p>
                    <dl className="mt-4 flex flex-wrap gap-4">
                      <div>
                        <dt className="text-tick text-muted-foreground">ALE</dt>
                        <dd className="font-mono text-sm">{formatInr(ale)}</dd>
                      </div>
                      <div>
                        <dt className="text-tick text-muted-foreground">Likelihood</dt>
                        <dd className="font-mono text-sm">
                          {Math.round(risk.likelihood * 100)}% / yr
                        </dd>
                      </div>
                      <div>
                        <dt className="text-tick text-muted-foreground">Severity</dt>
                        <dd
                          className="font-mono text-sm"
                          style={{ color: SEV_COLOR[risk.severity] }}
                        >
                          {SEVERITY_LABEL[risk.severity]}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <p className="text-tick text-muted-foreground">Prescribed treatment</p>
                    <ul className="mt-2 space-y-2">
                      {risk.treatment.map((t) => (
                        <li key={t} className="flex gap-2.5 text-sm text-foreground/90">
                          <Syringe
                            className="mt-0.5 size-3.5 shrink-0"
                            style={{ color: "var(--vital)" }}
                            aria-hidden="true"
                          />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
