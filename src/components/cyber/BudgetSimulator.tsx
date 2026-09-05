import { useMemo, useState } from "react";
import { formatInr, type Scope } from "@/lib/cyber-data";

const MAX_CR = 1;
const OPTIMAL_CR = 0.45;
const DEFAULT_CR = 0.45;

/** Diminishing-returns residual exposure for a given annual treatment spend (₹ Cr). */
function residual(exposureCr: number, spendCr: number) {
  return exposureCr * (0.18 + 0.82 * Math.exp(-4 * spendCr));
}

const W = 560;
const H = 220;
const PAD = { l: 58, r: 16, t: 18, b: 34 };

export function BudgetSimulator({ scope }: { scope: Scope }) {
  const [spend, setSpend] = useState(DEFAULT_CR);

  const untreated = scope.exposureCr;
  const current = residual(untreated, spend);
  const reduction = ((untreated - current) / untreated) * 100;

  const xOf = (s: number) => PAD.l + (s / MAX_CR) * (W - PAD.l - PAD.r);
  const yOf = (r: number) => PAD.t + (1 - r / untreated) * (H - PAD.t - PAD.b);

  const { line, area, marker } = useMemo(() => {
    const pts: [number, number][] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const s = (i / steps) * MAX_CR;
      pts.push([xOf(s), yOf(residual(untreated, s))]);
    }
    const d = pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ");
    return {
      line: d,
      area: `${d} L ${W - PAD.r} ${H - PAD.b} L ${PAD.l} ${H - PAD.b} Z`,
      marker: [xOf(spend), yOf(current)] as [number, number],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [untreated, spend, current]);

  return (
    <section aria-labelledby="sim-heading" className="rounded-lg panel">
      <div className="border-b border-graphite-line px-4 py-3 sm:px-5">
        <h2 id="sim-heading" className="text-base font-semibold">
          Treatment cost simulator
        </h2>
        <p className="text-xs text-muted-foreground">
          Move the dose between ₹0 and ₹1.00 Cr to see residual exposure and risk reduction
        </p>
      </div>

      <div className="space-y-5 px-4 py-5 sm:px-5">
        <div>
          <div className="flex items-end justify-between gap-3">
            <label htmlFor="spend" className="text-tick text-muted-foreground">
              Annual treatment spend
            </label>
            <output
              htmlFor="spend"
              className="font-mono text-lg"
              style={{ color: "var(--copper)" }}
            >
              {formatInr(spend)}
            </output>
          </div>
          <input
            id="spend"
            type="range"
            min={0}
            max={MAX_CR}
            step={0.01}
            value={spend}
            onChange={(e) => setSpend(Number(e.target.value))}
            className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--copper)]"
            aria-describedby="spend-hint"
          />
          <p id="spend-hint" className="mt-2 text-xs text-muted-foreground">
            Optimal dose is locked at {formatInr(OPTIMAL_CR)} · ceiling {formatInr(MAX_CR)}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-md border border-graphite-line bg-obsidian/70 grid-mesh">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Residual expected annual loss falls to ${formatInr(current)} at a spend of ${formatInr(spend)}, a ${reduction.toFixed(0)} percent reduction`}
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
                    {formatInr(untreated * (1 - f))}
                  </text>
                </g>
              );
            })}

            <path d={area} fill="url(#cv-area)" />
            <path d={line} fill="none" stroke="var(--alarm)" strokeWidth="2.2" />

            <line
              x1={xOf(OPTIMAL_CR)}
              x2={xOf(OPTIMAL_CR)}
              y1={PAD.t - 6}
              y2={H - PAD.b}
              stroke="var(--copper)"
              strokeWidth="1.4"
            />
            <text
              x={xOf(OPTIMAL_CR) + 6}
              y={PAD.t + 4}
              fill="var(--copper)"
              fontSize="9"
              fontFamily="var(--font-mono)"
            >
              ₹45 Lakhs · OPTIMAL
            </text>

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
              ₹1.00 Cr spend
            </text>
          </svg>
        </div>

        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-md bg-graphite-line sm:grid-cols-3">
          <div className="bg-card px-4 py-3">
            <dt className="text-tick text-muted-foreground">Allocated budget</dt>
            <dd className="mt-1 font-mono text-base" style={{ color: "var(--copper)" }}>
              {formatInr(spend)}
            </dd>
          </div>
          <div className="bg-card px-4 py-3">
            <dt className="text-tick text-muted-foreground">Residual EAL</dt>
            <dd className="mt-1 font-mono text-base" style={{ color: "var(--alarm)" }}>
              {formatInr(current)}
            </dd>
          </div>
          <div className="bg-card px-4 py-3">
            <dt className="text-tick text-muted-foreground">Risk reduction</dt>
            <dd className="mt-1 font-mono text-base" style={{ color: "var(--sage)" }}>
              {reduction.toFixed(1)}%
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
