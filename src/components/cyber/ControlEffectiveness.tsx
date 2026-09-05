import { useState } from "react";
import { Activity } from "lucide-react";
import { CONTROLS, type Scope } from "@/lib/cyber-data";

/** Scope nudges effectiveness slightly without changing the headline readings. */
const SCOPE_SHIFT: Record<Scope["id"], number> = {
  national: -6,
  enterprise: 0,
  department: 5,
};

function traceColor(value: number) {
  if (value >= 80) return "var(--sage)";
  if (value >= 60) return "var(--amber)";
  return "var(--rust)";
}

export function ControlEffectiveness({ scope }: { scope: Scope }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const shift = SCOPE_SHIFT[scope.id];

  return (
    <section aria-labelledby="control-heading" className="rounded-lg panel">
      <div className="flex flex-wrap items-center gap-2 border-b border-graphite-line px-4 py-3 sm:px-5">
        <Activity className="size-4" style={{ color: "var(--copper)" }} aria-hidden="true" />
        <h2 id="control-heading" className="text-tick text-foreground">
          Control effectiveness <span className="opacity-50">//</span> Immune telemetry
        </h2>
        <span className="ml-auto font-mono text-xs text-muted-foreground">{scope.label}</span>
      </div>

      <ul className="divide-y" style={{ borderColor: "var(--ink-line)" }}>
        {CONTROLS.map((c) => {
          const value = Math.max(4, Math.min(99, c.value + shift));
          const isHovered = hovered === c.id;
          return (
            <li
              key={c.id}
              className="px-4 py-4 transition-colors sm:px-5"
              style={{ borderColor: "var(--ink-line)" }}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(c.id)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium">{c.label}</p>
                <div className="flex items-baseline gap-2">
                  {isHovered && (
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[0.625rem]"
                      style={{
                        color: c.delta >= 0 ? "var(--sage)" : "var(--rust)",
                        border: `1px solid ${c.delta >= 0 ? "var(--sage)" : "var(--rust)"}`,
                      }}
                    >
                      {c.delta >= 0 ? "+" : ""}
                      {c.delta.toFixed(1)} pts / 30d
                    </span>
                  )}
                  <span className="font-mono text-sm" style={{ color: traceColor(value) }}>
                    {value}%
                  </span>
                </div>
              </div>

              <div
                className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--ink-line)" }}
                role="meter"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${c.label} effectiveness`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${value}%`,
                    backgroundColor: traceColor(value),
                    boxShadow: isHovered ? `0 0 10px ${traceColor(value)}` : "none",
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">{c.note}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
