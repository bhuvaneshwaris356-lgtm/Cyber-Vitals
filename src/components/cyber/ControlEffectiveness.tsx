import { useState } from "react";

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