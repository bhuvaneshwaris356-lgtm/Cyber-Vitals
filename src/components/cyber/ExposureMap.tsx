import { useState } from "react";
import {
  REGIONS,
  SEVERITY_LABEL,
  TIER_OF,
  formatInr,
  type Region,
  type RiskTier,
  type Scope,
} from "@/lib/cyber-data";
import { cn } from "@/lib/utils";

const SEV_COLOR: Record<string, string> = {
  critical: "var(--alarm)",
  elevated: "var(--caution)",
  guarded: "var(--vital)",
};

export function ExposureMap({ scope, tier = "all" }: { scope: Scope; tier?: RiskTier }) {
  const [active, setActive] = useState<Region>(REGIONS[0] as Region);
  const factor = scope.exposureCr / 620;
  const maxExp = Math.max(...REGIONS.map((r) => r.exposureCr));

  return (
    <section aria-labelledby="map-heading" className="rounded-lg panel">
      <div className="border-b border-graphite-line px-4 py-3 sm:px-5">
        <h2 id="map-heading" className="text-base font-semibold">
          Exposure map
        </h2>
        <p className="text-xs text-muted-foreground">
          Select a hub to inspect regional loss concentration
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden border-b border-graphite-line bg-obsidian/70 grid-mesh lg:border-b-0 lg:border-r">
          {REGIONS.map((r) => {
            const size = 14 + (r.exposureCr / maxExp) * 26;
            const isActive = active.id === r.id;
            const matches = tier === "all" || TIER_OF[r.severity] === tier;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActive(r)}
                aria-pressed={isActive}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vital)] hover:scale-110",
                  !matches && "opacity-20",
                )}
                style={{ left: `${r.x}%`, top: `${r.y}%`, width: size, height: size }}
                title={`${r.name} — ${formatInr(r.exposureCr * factor)}`}
              >
                <span className="sr-only">
                  {r.name}, {r.zone}: {formatInr(r.exposureCr * factor)} exposure
                </span>
                <span
                  className="block size-full rounded-full"
                  style={{
                    backgroundColor: `color-mix(in oklab, ${SEV_COLOR[r.severity]} ${isActive ? 70 : 35}%, transparent)`,
                    border: `1px solid ${SEV_COLOR[r.severity]}`,
                    boxShadow: isActive ? `0 0 18px ${SEV_COLOR[r.severity]}` : "none",
                  }}
                />
              </button>
            );
          })}
          <p className="absolute bottom-3 left-4 text-tick text-muted-foreground">
            India · {REGIONS.length} monitored hubs
          </p>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-graphite-line px-4 py-4 sm:px-5">
            <p className="text-tick text-muted-foreground">{active.zone} zone</p>
            <h3 className="mt-1 text-lg font-semibold">{active.name}</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-tick text-muted-foreground">Exposure</dt>
                <dd className="font-mono text-sm" style={{ color: SEV_COLOR[active.severity] }}>
                  {formatInr(active.exposureCr * factor)}
                </dd>
              </div>
              <div>
                <dt className="text-tick text-muted-foreground">Incidents / yr</dt>
                <dd className="font-mono text-sm">{active.incidents}</dd>
              </div>
              <div>
                <dt className="text-tick text-muted-foreground">Triage state</dt>
                <dd className="font-mono text-sm">{SEVERITY_LABEL[active.severity]}</dd>
              </div>
              <div>
                <dt className="text-tick text-muted-foreground">Share of total</dt>
                <dd className="font-mono text-sm">
                  {Math.round(
                    (active.exposureCr / REGIONS.reduce((a, r) => a + r.exposureCr, 0)) * 100,
                  )}
                  %
                </dd>
              </div>
            </dl>
          </div>

          <ul className="flex-1 divide-y divide-border overflow-hidden">
            {[...REGIONS]
              .sort((a, b) => b.exposureCr - a.exposureCr)
              .slice(0, 5)
              .map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setActive(r)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary/50 sm:px-5",
                      active.id === r.id && "bg-secondary/60",
                    )}
                  >
                    <span className="flex-1 truncate">{r.name}</span>
                    <span className="h-1 w-16 overflow-hidden rounded-full bg-secondary">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${(r.exposureCr / maxExp) * 100}%`,
                          backgroundColor: SEV_COLOR[r.severity],
                        }}
                      />
                    </span>
                    <span className="w-20 text-right font-mono text-xs text-muted-foreground">
                      {formatInr(r.exposureCr * factor)}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
