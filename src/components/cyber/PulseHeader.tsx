import { useEffect, useState } from "react";
import { Activity, ShieldAlert, Stethoscope } from "lucide-react";
import { SCOPES, formatInr, type Scope, type ScopeId } from "@/lib/cyber-data";
import { cn } from "@/lib/utils";
import { OperatorAccess } from "./OperatorAccess";

function Clock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-xs text-muted-foreground" aria-label="Local monitor time">
      {now ?? "--:--:--"} IST
    </span>
  );
}

export function PulseHeader({
  scope,
  onScopeChange,
  operator,
  onSignIn,
  onSignOut,
}: {
  scope: Scope;
  onScopeChange: (id: ScopeId) => void;
  operator: string | null;
  onSignIn: (id: string) => void;
  onSignOut: () => void;
}) {
  const beatMs = Math.round(60000 / scope.bpm);
  const critical = scope.riskIndex >= 70;

  return (
    <header className="border-b border-graphite-line bg-obsidian/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-8">
        <div className="flex items-start gap-4">
          <div
            className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-md border border-graphite-line bg-graphite animate-heart"
            style={
              {
                "--beat": `${beatMs}ms`,
                color: critical ? "var(--alarm)" : "var(--vital)",
                boxShadow: critical ? "var(--glow-alarm)" : "var(--glow-vital)",
              } as React.CSSProperties
            }
            aria-hidden="true"
          >
            <Stethoscope className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-tick text-muted-foreground">Cyber risk diagnostics</p>
              <Clock />
            </div>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Cyber Vitals</h1>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              A clinical read on cyber exposure — vitals, treatment cost and defence strength for{" "}
              {scope.blurb}.
            </p>
          </div>
        </div>


        <div className="flex flex-col items-start gap-4 lg:items-end">
        <OperatorAccess operator={operator} onSignIn={onSignIn} onSignOut={onSignOut} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            className="flex flex-wrap gap-1 rounded-md border border-graphite-line bg-graphite p-1"
            role="group"
            aria-label="Assessment scope"
          >
            {SCOPES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onScopeChange(s.id)}
                aria-pressed={s.id === scope.id}
                className={cn(
                  "rounded px-3 py-2 text-xs font-medium transition-colors",
                  s.id === scope.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          <dl className="flex flex-wrap gap-4 rounded-md border border-graphite-line bg-graphite px-4 py-3">
            <div>
              <dt className="text-tick text-muted-foreground">Risk score</dt>
              <dd
                className="mt-1 font-mono text-sm"
                style={{ color: critical ? "var(--rust)" : scope.riskIndex >= 50 ? "var(--amber)" : "var(--sage)" }}
              >
                {scope.riskIndex}/100
              </dd>
            </div>
            <div className="border-l border-graphite-line pl-4">

              <dt className="text-tick text-muted-foreground">Exposure</dt>
              <dd className="mt-1 flex items-center gap-1.5 font-mono text-sm">
                <ShieldAlert
                  className="size-3.5"
                  style={{ color: "var(--alarm)" }}
                  aria-hidden="true"
                />
                {formatInr(scope.exposureCr)}
              </dd>
            </div>
            <div className="border-l border-graphite-line pl-4">
              <dt className="text-tick text-muted-foreground">Budget</dt>
              <dd className="mt-1 flex items-center gap-1.5 font-mono text-sm">
                <Activity
                  className="size-3.5"
                  style={{ color: "var(--vital)" }}
                  aria-hidden="true"
                />
                {formatInr(scope.budgetCr)}
              </dd>
            </div>
          </dl>
        </div>
        </div>
      </div>
    </header>
  );
}
