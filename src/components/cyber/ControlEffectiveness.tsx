import { useState } from "react";
<<<<<<< HEAD

type Control = {
  name: string;
  value: number;
  color: string;
  delta: string;
};

const CONTROLS: Control[] = [
  {
    name: "IAM Hygiene",
    value: 88,
    color: "#8FA998",
    delta: "+3.8%",
  },
  {
    name: "EDR Coverage",
    value: 81,
    color: "#8FA998",
    delta: "+2.4%",
  },
  {
    name: "SIEM / SOC Visibility",
    value: 67,
    color: "#E0A45C",
    delta: "+5.1%",
  },
  {
    name: "CSPM Posture",
    value: 54,
    color: "#E0A45C",
    delta: "-1.7%",
  },
  {
    name: "Endpoint Drift",
    value: 42,
    color: "#B5493F",
    delta: "+7.3%",
  },
];

export function ControlEffectiveness() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="panel overflow-hidden rounded-lg">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-graphite-line px-4 py-3">
        <div>
          <p className="text-tick text-muted-foreground">
            CONTROL EFFECTIVENESS
          </p>

          <h2 className="mt-1 font-mono text-sm tracking-[0.12em] text-foreground">
            // IMMUNE TELEMETRY
          </h2>
        </div>

        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          LIVE
        </div>
      </div>

      {/* Telemetry */}
      <div className="space-y-5 px-4 py-5">
        {CONTROLS.map((control) => {
          const isHovered = hovered === control.name;

          return (
            <div
              key={control.name}
              className="group relative"
              onMouseEnter={() => setHovered(control.name)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Label */}
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">
                  {control.name}
                </span>

                <div className="relative flex items-center gap-2">
                  {/* Delta */}
                  <span
                    className={`rounded border px-1.5 py-0.5 font-mono text-[9px] transition-all duration-200 ${
                      isHovered
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-1 opacity-0"
                    }`}
                    style={{
                      borderColor: `${control.color}55`,
                      color: control.color,
                      backgroundColor: `${control.color}0D`,
                    }}
                  >
                    Δ {control.delta}
                  </span>

                  {/* Percentage */}
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: control.color }}
                  >
                    {control.value}%
                  </span>
                </div>
              </div>

              {/* Thin trace gauge */}
              <div className="relative h-[2px] w-full overflow-visible rounded-full bg-graphite-line">
                {/* Filled trace */}
                <div
                  className="absolute left-0 top-0 h-[2px] rounded-full transition-all duration-700"
                  style={{
                    width: `${control.value}%`,
                    backgroundColor: control.color,
                    boxShadow: isHovered
                      ? `0 0 8px ${control.color}88`
                      : "none",
                  }}
                />

                {/* Trace endpoint */}
                <div
                  className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full transition-all duration-700"
                  style={{
                    left: `calc(${control.value}% - 3px)`,
                    backgroundColor: control.color,
                    boxShadow: `0 0 5px ${control.color}`,
                  }}
                />

                {/* Tick marks */}
                <div className="pointer-events-none absolute inset-0 flex justify-between">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
                    <span
                      key={tick}
                      className="h-[5px] w-px bg-graphite-line"
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-graphite-line px-4 py-2">
        <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          Control telemetry · illustrative frontend data
        </p>
      </div>
    </section>
  );
}
=======
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
>>>>>>> 58a8a4d0c589df88fcf1e42cda3f97380714136b
