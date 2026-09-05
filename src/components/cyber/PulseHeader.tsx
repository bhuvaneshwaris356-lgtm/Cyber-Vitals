import { useEffect, useState } from "react";
import { Activity, ShieldAlert, Stethoscope } from "lucide-react";

import {
  SCOPES,
  formatInr,
  type Scope,
  type ScopeId,
} from "@/lib/cyber-data";

import { cn } from "@/lib/utils";

import { OperatorAccess } from "./OperatorAccess";

<<<<<<< HEAD
const DISPLAY_LABELS: Record<ScopeId, string> = {
  enterprise: "Organization",
  department: "Business Unit",
  national: "Asset",
};
=======
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
>>>>>>> 58a8a4d0c589df88fcf1e42cda3f97380714136b

export function PulseHeader({
  scope,
  onScopeChange,
  operator = null,
  onSignIn = () => {},
  onSignOut = () => {},
}: {
  scope: Scope;
  onScopeChange: (id: ScopeId) => void;
  operator?: string | null;
  onSignIn?: (id: string) => void;
  onSignOut?: () => void;
}) {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setClock(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };

    updateClock();

    const timer = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const beatMs = Math.round(60000 / scope.bpm);

  const critical = scope.riskIndex >= 70;

  /*
   * Display risk score for the new UI.
   * Organization is intentionally set to 68/100
   * according to the requested design.
   */
  const displayRisk: Record<ScopeId, number> = {
    enterprise: 68,
    department: 44,
    national: 82,
  };

  const riskScore = displayRisk[scope.id];

  return (
    <header className="border-b border-graphite-line bg-obsidian/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:py-6">
        {/* TOP ROW */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* WORDMARK */}
          <div className="flex items-start gap-4">
            <div
              className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-md border border-graphite-line bg-graphite animate-heart"
              style={
                {
                  "--beat": `${beatMs}ms`,
                  color: critical ? "var(--alarm)" : "var(--vital)",
                  boxShadow: critical
                    ? "var(--glow-alarm)"
                    : "var(--glow-vital)",
                } as React.CSSProperties
              }
              aria-hidden="true"
            >
              <Stethoscope className="size-5" />
            </div>

            <div>
              <p className="text-tick text-muted-foreground">
                Cyber risk diagnostics
              </p>

              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">
                Cyber Vitals
              </h1>

              <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                A clinical read on cyber exposure — vitals, treatment cost and
                defence strength for {scope.blurb.toLowerCase()}.
              </p>
            </div>
          </div>
<<<<<<< HEAD

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-3 lg:items-end">
            <OperatorAccess
              operator={operator}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
            />

            {/* CLOCK */}
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-[var(--vital)] shadow-[0_0_7px_var(--vital)]" />
              SYSTEM CLOCK
              <span className="text-foreground">{clock}</span>
            </div>
          </div>
        </div>

        {/* SCOPE + METRICS */}
        <div className="flex flex-col gap-4 border-t border-graphite-line pt-4 lg:flex-row lg:items-center lg:justify-between">
          {/* SCOPE SELECTOR */}
          <div>
            <p className="mb-2 text-tick text-muted-foreground">
              ASSESSMENT SCOPE
            </p>

            <div
              className="inline-flex rounded-md border border-graphite-line bg-graphite p-1"
              role="group"
              aria-label="Assessment scope"
            >
              {SCOPES.map((s) => {
                const active = s.id === scope.id;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onScopeChange(s.id)}
                    aria-pressed={active}
                    className={cn(
                      "relative rounded px-4 py-2 text-xs font-medium transition-all duration-200",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    {DISPLAY_LABELS[s.id]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* METRIC BADGES */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {/* RISK SCORE */}
            <div className="rounded-md border border-graphite-line bg-graphite px-4 py-3">
              <p className="text-tick text-muted-foreground">
                RISK SCORE
              </p>

              <p
                className="mt-1 font-mono text-lg font-semibold"
                style={{
                  color:
                    riskScore >= 70 ? "var(--alarm)" : "var(--vital)",
                }}
              >
                {riskScore}/100
              </p>
            </div>

            {/* EAL */}
            <div className="rounded-md border border-graphite-line bg-graphite px-4 py-3">
              <p className="text-tick text-muted-foreground">EAL</p>

              <p className="mt-1 flex items-center gap-1.5 font-mono text-sm">
                <ShieldAlert
                  className="size-3.5"
                  style={{ color: "var(--alarm)" }}
                />

                {formatInr(scope.exposureCr)}
              </p>
            </div>

            {/* BUDGET */}
            <div className="col-span-2 rounded-md border border-graphite-line bg-graphite px-4 py-3 sm:col-span-1">
              <p className="text-tick text-muted-foreground">BUDGET</p>

              <p className="mt-1 flex items-center gap-1.5 font-mono text-sm">
                <Activity
                  className="size-3.5"
                  style={{ color: "var(--vital)" }}
                />

                {formatInr(scope.budgetCr)}
              </p>
            </div>
          </div>
=======
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
                  style={{
                    color: critical
                      ? "var(--rust)"
                      : scope.riskIndex >= 50
                        ? "var(--amber)"
                        : "var(--sage)",
                  }}
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
>>>>>>> 58a8a4d0c589df88fcf1e42cda3f97380714136b
        </div>
      </div>
    </header>
  );
}