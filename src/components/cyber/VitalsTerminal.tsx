import { useEffect, useRef, useState } from "react";
import { TerminalSquare } from "lucide-react";
import { DEFENSES, REGIONS, RISKS, formatInr, type Scope } from "@/lib/cyber-data";

type Line = { id: number; kind: "in" | "out" | "warn"; text: string };

const HELP = [
  "vitals    — current pulse, risk index and exposure",
  "risks     — top diagnoses by annualised loss",
  "budget    — spend, residual exposure and ROI",
  "defense   — control readings against targets",
  "map       — regional exposure concentration",
  "compliance— regulatory posture summary",
  "clear     — wipe the console",
];

let seq = 0;
const nextId = () => ++seq;

export function VitalsTerminal({ scope }: { scope: Scope }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines([
      { id: nextId(), kind: "out", text: `Cyber Vitals console — scope: ${scope.label}` },
      { id: nextId(), kind: "out", text: 'Type "help" for available diagnostics.' },
    ]);
  }, [scope.label]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  function respond(raw: string): Line[] {
    const q = raw.toLowerCase();
    const has = (...k: string[]) => k.some((w) => q.includes(w));
    const out = (text: string, kind: Line["kind"] = "out"): Line => ({
      id: nextId(),
      kind,
      text,
    });

    if (has("help", "command", "?")) return HELP.map((h) => out(h));
    if (has("clear", "reset")) return [];

    if (has("vital", "pulse", "ecg", "heart", "status")) {
      return [
        out(`pulse       ${scope.bpm} risk events / min`),
        out(`risk index  ${scope.riskIndex}/100`),
        out(`exposure    ${formatInr(scope.exposureCr)} annualised`),
        out(`assets      ${scope.assets.toLocaleString("en-IN")} monitored`),
      ];
    }
    if (has("risk", "diagnos", "threat", "ransom", "phish", "fraud", "vendor", "third")) {
      const match = RISKS.filter((r) =>
        `${r.title} ${r.vector}`.toLowerCase().split(/\W+/).some((w) => w.length > 3 && q.includes(w)),
      );
      const list = (match.length ? match : [...RISKS].sort((a, b) => b.aleCr - a.aleCr).slice(0, 3));
      return list.map((r) => out(`${r.severity.padEnd(9)} ${r.title} — ${formatInr(r.aleCr)}`));
    }
    if (has("budget", "spend", "cost", "roi", "treat", "invest")) {
      return [
        out(`plan        ${formatInr(scope.budgetCr)} / yr`),
        out(`exposure    ${formatInr(scope.exposureCr)} untreated`),
        out(`headroom    ${formatInr(scope.budgetCr * 1.5)} to reach optimal dose`),
      ];
    }
    if (has("defen", "control", "gauge", "mfa", "patch", "backup", "mttd")) {
      return DEFENSES.map((d) => {
        const v = d.readings[scope.id];
        const met = d.invert ? v <= d.target : v >= d.target;
        return out(
          `${met ? "ok  " : "warn"} ${d.label} — ${v}${d.unit === "%" ? "%" : ` ${d.unit}`} (target ${d.target})`,
          met ? "out" : "warn",
        );
      });
    }
    if (has("map", "region", "geo", "mumbai", "delhi", "bengaluru", "chennai", "hub")) {
      const hit = REGIONS.find((r) => q.includes(r.name.toLowerCase()));
      if (hit)
        return [
          out(`${hit.name} (${hit.zone}) — ${formatInr(hit.exposureCr)}, ${hit.incidents} incidents / yr`),
        ];
      return [...REGIONS]
        .sort((a, b) => b.exposureCr - a.exposureCr)
        .slice(0, 4)
        .map((r) => out(`${r.name.padEnd(12)} ${formatInr(r.exposureCr)}`));
    }
    if (has("compli", "rbi", "dpdp", "iso", "pci", "audit", "sebi", "cert")) {
      return [
        out("rbi cyber framework   aligned (92)"),
        out("dpdp act 2023         in remediation (74)"),
        out("iso 27001:2022        certified (96)"),
        out("sebi cscrf            gap review (68)", "warn"),
      ];
    }

    return [out(`no diagnostic matched "${raw}". try "help".`, "warn")];
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const raw = value.trim();
    if (!raw) return;
    const replies = respond(raw);
    setLines((prev) =>
      replies.length === 0 && /clear|reset/i.test(raw)
        ? []
        : [...prev, { id: nextId(), kind: "in", text: raw }, ...replies],
    );
    setValue("");
  }

  return (
    <section aria-labelledby="term-heading" className="rounded-lg panel">
      <div className="flex items-center gap-2 border-b border-graphite-line px-4 py-3 sm:px-5">
        <TerminalSquare className="size-4" style={{ color: "var(--vital)" }} aria-hidden="true" />
        <h2 id="term-heading" className="text-base font-semibold">
          Diagnostic console
        </h2>
      </div>

      <div
        ref={logRef}
        className="h-64 overflow-y-auto bg-obsidian/80 px-4 py-4 font-mono text-xs leading-relaxed sm:px-5"
        role="log"
        aria-live="polite"
        aria-label="Console output"
      >
        {lines.map((l) => (
          <p
            key={l.id}
            className="whitespace-pre-wrap"
            style={{
              color:
                l.kind === "in"
                  ? "var(--vital)"
                  : l.kind === "warn"
                    ? "var(--caution)"
                    : "var(--muted-foreground)",
            }}
          >
            {l.kind === "in" ? "› " : "  "}
            {l.text}
          </p>
        ))}
        <span
          className="inline-block h-3 w-1.5 animate-blink align-middle"
          style={{ backgroundColor: "var(--vital)" }}
          aria-hidden="true"
        />
      </div>

      <form onSubmit={submit} className="flex items-center gap-2 border-t border-graphite-line px-4 py-3 sm:px-5">
        <label htmlFor="cmd" className="text-tick text-muted-foreground">
          query
        </label>
        <input
          id="cmd"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="vitals, risks, budget, defense, map, compliance"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <button
          type="submit"
          className="rounded border border-graphite-line bg-secondary px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
        >
          Run
        </button>
      </form>
    </section>
  );
}
