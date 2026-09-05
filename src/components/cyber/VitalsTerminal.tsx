import { useEffect, useRef, useState } from "react";
import { TerminalSquare } from "lucide-react";
import { MONITOR_QUERIES, formatInr, type Scope } from "@/lib/cyber-data";

type Line = { id: number; kind: "in" | "out" | "warn"; text: string };

let seq = 0;
const nextId = () => ++seq;

export function VitalsTerminal({ scope }: { scope: Scope }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLines([
      { id: nextId(), kind: "out", text: `Ask the Monitor — scope: ${scope.label}` },
      {
        id: nextId(),
        kind: "out",
        text: `exposure ${formatInr(scope.exposureCr)} annualised · tap a query below or type your own`,
      },
    ]);
  }, [scope.label, scope.exposureCr]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  function respond(raw: string): Line[] {
    const q = raw.toLowerCase();
    const out = (text: string, kind: Line["kind"] = "out"): Line => ({ id: nextId(), kind, text });
    const hit = MONITOR_QUERIES.find((m) => m.keywords.some((k) => q.includes(k)));
    if (hit) return hit.lines.map((l) => out(l));
    if (q.includes("clear") || q.includes("reset")) return [];
    return [
      out(`no reading matched "${raw}".`, "warn"),
      ...MONITOR_QUERIES.map((m) => out(`try   ${m.chip}`)),
    ];
  }

  function run(raw: string) {
    const text = raw.trim();
    if (!text) return;
    const replies = respond(text);
    setLines((prev) =>
      replies.length === 0 ? [] : [...prev, { id: nextId(), kind: "in", text }, ...replies],
    );
    setValue("");
  }

  return (
    <section aria-labelledby="term-heading" className="rounded-lg panel">
      <div className="flex items-center gap-2 border-b border-graphite-line px-4 py-3 sm:px-5">
        <TerminalSquare className="size-4" style={{ color: "var(--copper)" }} aria-hidden="true" />
        <h2 id="term-heading" className="text-base font-semibold">
          Ask the Monitor
        </h2>
      </div>

      <div
        ref={logRef}
        className="h-64 cursor-text overflow-y-auto bg-obsidian/80 px-4 py-4 font-mono text-xs leading-relaxed sm:px-5"
        role="log"
        aria-live="polite"
        aria-label="Monitor output"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((l) => (
          <p
            key={l.id}
            className="whitespace-pre-wrap"
            style={{
              color:
                l.kind === "in"
                  ? "var(--copper)"
                  : l.kind === "warn"
                    ? "var(--amber)"
                    : "var(--muted-foreground)",
            }}
          >
            {l.kind === "in" ? "› " : "  "}
            {l.text}
          </p>
        ))}
        <span
          className="inline-block h-3 w-1.5 animate-blink align-middle"
          style={{ backgroundColor: "var(--copper)" }}
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-wrap gap-2 border-t border-graphite-line px-4 py-3 sm:px-5">
        {MONITOR_QUERIES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => run(m.chip)}
            className="rounded border px-2.5 py-1.5 font-mono text-[0.6875rem] transition-colors hover:bg-secondary/60"
            style={{
              borderColor: "var(--copper)",
              color: "var(--copper)",
              backgroundColor: "var(--ink)",
            }}
          >
            {m.chip}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
        }}
        className="flex items-center gap-2 border-t border-graphite-line px-4 py-3 sm:px-5"
      >
        <label htmlFor="cmd" className="text-tick text-muted-foreground">
          query
        </label>
        <input
          id="cmd"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="exposure, ransomware, subnets, budget"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <button
          type="submit"
          className="rounded border px-3 py-1.5 font-mono text-xs transition-colors hover:bg-secondary"
          style={{ borderColor: "var(--copper)", color: "var(--copper)" }}
        >
          Run
        </button>
      </form>
    </section>
  );
}
