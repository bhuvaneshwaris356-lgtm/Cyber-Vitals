import { useEffect, useMemo, useRef, useState } from "react";
import type { Scope } from "@/lib/cyber-data";

/** Builds one ECG beat path scaled by severity. */
function beatPath(amplitude: number, width: number, mid: number) {
  const u = width / 10;
  const a = amplitude;
  return [
    `l ${u * 2} 0`,
    `q ${u * 0.4} ${-a * 0.22} ${u * 0.8} 0`,
    `l ${u * 0.6} 0`,
    `l ${u * 0.35} ${a * 0.3}`,
    `l ${u * 0.35} ${-a}`,
    `l ${u * 0.35} ${a * 0.72}`,
    `l ${u * 0.35} ${-a * 0.12}`,
    `l ${u * 0.8} 0`,
    `q ${u * 0.7} ${-a * 0.38} ${u * 1.4} 0`,
    `l ${width - u * 7.0} 0`,
  ].join(" ") + ` V ${mid}`;
}

export function EcgMonitor({ scope }: { scope: Scope }) {
  const beatMs = Math.round(60000 / scope.bpm);
  const amplitude = 22 + (scope.riskIndex / 100) * 30;
  const mid = 60;
  const beatWidth = 120;
  const beats = 5;

  const path = useMemo(() => {
    let d = `M 0 ${mid}`;
    for (let i = 0; i < beats; i++) d += ` ${beatPath(amplitude, beatWidth, mid)}`;
    return d;
  }, [amplitude]);

  const [bpmJitter, setBpmJitter] = useState(scope.bpm);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setBpmJitter(scope.bpm);
    timer.current = setInterval(() => {
      setBpmJitter(scope.bpm + Math.round((Math.random() - 0.5) * 6));
    }, 1600);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [scope.bpm]);

  const critical = scope.riskIndex >= 70;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg panel scanline">
      <div className="flex items-center justify-between border-b border-graphite-line px-4 py-2.5">
        <span className="text-tick text-muted-foreground">Risk ECG · {scope.label}</span>
        <span
          className="text-tick"
          style={{ color: critical ? "var(--alarm)" : "var(--vital)" }}
        >
          {bpmJitter} rpm · {critical ? "arrhythmic" : "sinus"}
        </span>
      </div>

      <div className="relative min-h-[132px] flex-1 grid-mesh">
        <svg
          viewBox={`0 0 ${beatWidth * beats} ${mid * 2}`}
          preserveAspectRatio="none"
          className="h-full w-full"
          role="img"
          aria-label={`Risk electrocardiogram for ${scope.label} at ${scope.bpm} risk events per minute`}
        >
          <path
            d={path}
            fill="none"
            stroke={critical ? "var(--alarm)" : "var(--vital)"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.28}
          />
          <path
            d={path}
            fill="none"
            stroke={critical ? "var(--alarm)" : "var(--vital)"}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1000"
            style={{
              animation: `cv-trace ${beatMs * beats * 1.6}ms linear infinite`,
              filter: "drop-shadow(0 0 6px currentColor)",
            }}
          />
        </svg>
        <div
          className="pointer-events-none absolute inset-y-0 w-24 animate-sweep"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--vital) 12%, transparent), transparent)",
          }}
        />
      </div>

      <dl className="grid grid-cols-2 gap-px border-t border-graphite-line bg-graphite-line sm:grid-cols-4">
        {[
          { k: "Risk index", v: `${scope.riskIndex}/100` },
          { k: "Monitored assets", v: scope.assets.toLocaleString("en-IN") },
          { k: "Open incidents", v: Math.round(scope.riskIndex * 1.4).toString() },
          { k: "Containment", v: `${Math.max(38, 100 - scope.riskIndex)}%` },
        ].map((s) => (
          <div key={s.k} className="bg-card px-4 py-3">
            <dt className="text-tick text-muted-foreground">{s.k}</dt>
            <dd className="mt-1 font-mono text-sm text-foreground">{s.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
