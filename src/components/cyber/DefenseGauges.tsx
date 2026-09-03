import { DEFENSES, type Scope } from "@/lib/cyber-data";

function Gauge({
  value,
  target,
  unit,
  invert,
}: {
  value: number;
  target: number;
  unit: string;
  invert?: boolean;
}) {
  const health = invert
    ? Math.max(0, Math.min(1, target / Math.max(value, 0.001)))
    : Math.max(0, Math.min(1, value / target));
  const color =
    health >= 0.9 ? "var(--vital)" : health >= 0.65 ? "var(--caution)" : "var(--alarm)";

  const r = 42;
  const cx = 56;
  const cy = 52;
  const start = Math.PI * 0.82;
  const end = Math.PI * 2.18;
  const angle = start + (end - start) * health;
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${p(a0)} A ${r} ${r} 0 ${large} 1 ${p(a1)}`;
  };

  return (
    <svg viewBox="0 0 112 104" className="h-24 w-28" aria-hidden="true">
      <path d={arc(start, end)} fill="none" stroke="var(--graphite-line)" strokeWidth="7" strokeLinecap="round" />
      <path
        d={arc(start, Math.max(angle, start + 0.001))}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 6px currentColor)", transition: "d 300ms" }}
      />
      <text
        x={cx}
        y={cy + 2}
        textAnchor="middle"
        fill="var(--foreground)"
        fontSize="19"
        fontFamily="var(--font-mono)"
      >
        {value}
      </text>
      <text
        x={cx}
        y={cy + 17}
        textAnchor="middle"
        fill="var(--muted-foreground)"
        fontSize="9"
        fontFamily="var(--font-mono)"
      >
        {unit}
      </text>
    </svg>
  );
}

export function DefenseGauges({ scope }: { scope: Scope }) {
  return (
    <section aria-labelledby="gauge-heading" className="rounded-lg panel">
      <div className="border-b border-graphite-line px-4 py-3 sm:px-5">
        <h2 id="gauge-heading" className="text-base font-semibold">
          Defence strength
        </h2>
        <p className="text-xs text-muted-foreground">
          Live control readings against clinical targets · {scope.label}
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-px bg-graphite-line sm:grid-cols-2">
        {DEFENSES.map((d) => {
          const value = d.readings[scope.id];
          const met = d.invert ? value <= d.target : value >= d.target;
          return (
            <li key={d.id} className="flex items-center gap-3 bg-card px-4 py-4">
              <Gauge value={value} target={d.target} unit={d.unit} invert={d.invert} />
              <div className="min-w-0">
                <p className="text-sm font-medium">{d.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{d.note}</p>
                <p
                  className="mt-2 text-tick"
                  style={{ color: met ? "var(--vital)" : "var(--caution)" }}
                >
                  {met ? "at target" : "below target"} · goal {d.invert ? "≤" : "≥"} {d.target}
                  {d.unit === "%" ? "%" : ` ${d.unit}`}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
