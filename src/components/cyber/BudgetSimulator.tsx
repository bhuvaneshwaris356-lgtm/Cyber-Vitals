import { useMemo, useState } from "react";
import { formatInr, type Scope } from "@/lib/cyber-data";

/** Diminishing-returns residual exposure for a given spend multiple of baseline budget. */
function residual(exposureCr: number, spendCr: number, baselineCr: number) {
  const intensity = spendCr / baselineCr;
  return exposureCr * (0.12 + 0.88 * Math.exp(-1.35 * intensity));
}

const W = 560;
const H = 220;
const PAD = { l: 54, r: 16, t: 18, b: 34 };

export function BudgetSimulator({ scope }: { scope: Scope }) {
  const maxSpend = scope.budgetCr * 2.5;
  const [spend, setSpend] = useState(scope.budgetCr);
  const [scopeKey, setScopeKey] = useState(scope.id);

  if (scopeKey !== scope.id) {
    setScopeKey(scope.id);
    setSpend(scope.budgetCr);
  }

  const baseline = residual(scope.exposureCr, 0, scope.budgetCr);
  const current = residual(scope.exposureCr, spend, scope.budgetCr);
  const avoided = baseline - current;
  const roi = spend > 0 ? avoided / spend : 0;

  const { line, area, marker } = useMemo(() => {
    const pts: [number, number][] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const s = (i / steps) * maxSpend;
      const r = residual(scope.exposureCr, s, scope.budgetCr);
      const x = PAD.l + (i / steps) * (W - PAD.l - PAD.r);
      const y = PAD.t + (1 - r / scope.exposureCr) * (H - PAD.t - PAD.b);
      pts.push([x, y]);
    }
    const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    const mx = PAD.l + (spend / maxSpend) * (W - PAD.l - PAD.r);
    const my = PAD.t + (1 - current / scope.exposureCr) * (H - PAD.t - PAD.b);
    return {
      line: d,
      area: `${d} L ${W - PAD.r} ${H - PAD.b} L ${PAD.l} ${H - PAD.b} Z`,
      marker: [mx, my] as [number, number],
    };
  }, [scope.exposureCr, scope.budgetCr, maxSpend, spend, current]);

  return (
    <section aria-labelledby="sim-heading" className="rounded-lg panel">
      <div className="border-b border-graphite-line px-4 py-3 sm:px-5">
        <h2 id="sim-heading" className="text-base font-semibold">
          Treatment cost simulator
        </h2>
        <p className="text-xs text-muted-foreground">
          Move the dose to see residual exposure and return on spend
        </p>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-5">
        <div>
          <div className="flex items-end justify-between gap-3">
            <label htmlFor="spend" className="text-tick text-muted-foreground">
              Annual security spend
            </label>
            <output htmlFor="spend" className="font-mono text-lg" style={{ color: "var(--vital)" }}>
              {formatInr(spend)}
            </output>
          </div>
          <input
            id="spend"
            type="range"
            min={0}
            max={Number(maxSpend.toFixed(2))}
            step={Number((maxSpend / 100).toFixed(2))}
            value={spend}
            onChange={(e) => setSpend(Number(e.target.value))}
            className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--vital)]"
            aria-describedby="spend-hint"
          />
          <p id="spend-hint" className="mt-2 text-xs text-muted-foreground">
            Baseline plan is {formatInr(scope.budgetCr)} · ceiling {formatInr(maxSpend)}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-md border border-graphite-line bg-obsidian/70 grid-mesh">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Residual exposure falls to ${formatInr(current)} at a spend of ${formatInr(spend)}`}
          >
            <defs>
              <linearGradient id="cv-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--alarm)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--alarm)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 0.25, 0.5, 0.75, 1].map((f) => {
              const y = PAD.t + f * (H - PAD.t - PAD.b);
              return (
                <g key={f}>
                  <line
                    x1={PAD.l}
                    x2={W - PAD.r}
                    y1={y}
                    y2={y}
                    stroke="var(--graphite-line)"
                    strokeWidth="1"
                  />
                  <text
                    x={PAD.l - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="var(--muted-foreground)"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                  >
                    {formatInr(scope.exposureCr * (1 - f))}
                  </text>
                </g>
              );
            })}

            <path d={area} fill="url(#cv-area)" />
            <path d={line} fill="none" stroke="var(--alarm)" strokeWidth="2.2" />
            <line
              x1={marker[0]}
              x2={marker[0]}
              y1={PAD.t}
              y2={H - PAD.b}
              stroke="var(--vital)"
              strokeDasharray="3 4"
              strokeWidth="1.2"
            />
            <circle
              cx={marker[0]}
              cy={marker[1]}
              r="5"
              fill="var(--vital)"
              stroke="var(--obsidian)"
              strokeWidth="2"
            />
            <text
              x={PAD.l}
              y={H - 12}
              fill="var(--muted-foreground)"
              fontSize="9"
              fontFamily="var(--font-mono)"
            >
              ₹0
            </text>
            <text
              x={W - PAD.r}
              y={H - 12}
              textAnchor="end"
              fill="var(--muted-foreground)"
              fontSize="9"
              fontFamily="var(--font-mono)"
            >
              {formatInr(maxSpend)} spend
            </text>
          </svg>
        </div>

        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-md bg-graphite-line sm:grid-cols-3">
          <div className="bg-card px-4 py-3">
            <dt className="text-tick text-muted-foreground">Residual exposure</dt>
            <dd className="mt-1 font-mono text-base" style={{ color: "var(--alarm)" }}>
              {formatInr(current)}
            </dd>
          </div>
          <div className="bg-card px-4 py-3">
            <dt className="text-tick text-muted-foreground">Loss avoided</dt>
            <dd className="mt-1 font-mono text-base" style={{ color: "var(--vital)" }}>
              {formatInr(avoided)}
            </dd>
          </div>
          <div className="bg-card px-4 py-3">
            <dt className="text-tick text-muted-foreground">Return per ₹1</dt>
            <dd className="mt-1 font-mono text-base" style={{ color: "var(--gold)" }}>
              {roi.toFixed(2)}x
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
