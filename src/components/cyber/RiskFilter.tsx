import {
  RISKS,
  TIER_COLOR,
  TIER_LABEL,
  formatInr,
  type RiskTier,
  type Scope,
  TIER_OF,
} from "@/lib/cyber-data";
import { cn } from "@/lib/utils";

const TIERS: RiskTier[] = ["all", "high", "moderate", "low"];

export function RiskFilter({
  tier,
  onTierChange,
  scope,
}: {
  tier: RiskTier;
  onTierChange: (t: RiskTier) => void;
  scope: Scope;
}) {
  const factor = scope.exposureCr / 620;
  const summary = (["high", "moderate", "low"] as const).map((t) => {
    const items = RISKS.filter((r) => TIER_OF[r.severity] === t);
    return {
      tier: t,
      count: items.length,
      total: items.reduce((a, r) => a + r.aleCr * factor, 0),
    };
  });

  return (
    <section aria-label="Risk level filter" className="rounded-lg panel px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-tick text-muted-foreground">Risk level</span>
          <div
            className="flex flex-wrap gap-1 rounded-md border p-1"
            role="group"
            aria-label="Filter by risk level"
            style={{ borderColor: "var(--ink-line)", backgroundColor: "var(--ink)" }}
          >
            {TIERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTierChange(t)}
                aria-pressed={tier === t}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-1.5 font-mono text-xs transition-colors",
                  tier === t
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60",
                )}
              >
                {t !== "all" && (
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: TIER_COLOR[t] }}
                    aria-hidden="true"
                  />
                )}
                {t === "all"
                  ? "All"
                  : TIER_LABEL[t].charAt(0) + TIER_LABEL[t].slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          {summary.map((s, i) => (
            <span key={s.tier}>
              {i > 0 && <span className="px-1.5 opacity-50">|</span>}
              <span style={{ color: TIER_COLOR[s.tier] }}>
                {TIER_LABEL[s.tier].charAt(0) + TIER_LABEL[s.tier].slice(1).toLowerCase()}
              </span>
              : {s.count} ({formatInr(s.total)})
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
