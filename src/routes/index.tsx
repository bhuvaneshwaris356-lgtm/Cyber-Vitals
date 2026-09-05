import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PulseHeader } from "@/components/cyber/PulseHeader";
import { EcgMonitor } from "@/components/cyber/EcgMonitor";
import { RiskAccordion } from "@/components/cyber/RiskAccordion";
import { BudgetSimulator } from "@/components/cyber/BudgetSimulator";
import { DefenseGauges } from "@/components/cyber/DefenseGauges";
import { ControlEffectiveness } from "@/components/cyber/ControlEffectiveness";

import { ExposureMap } from "@/components/cyber/ExposureMap";
import { VitalsTerminal } from "@/components/cyber/VitalsTerminal";
import { ComplianceBadges } from "@/components/cyber/ComplianceBadges";
import { RiskFilter } from "@/components/cyber/RiskFilter";
import { FaqAccordion } from "@/components/cyber/FaqAccordion";
import { SCOPES, type ScopeId, type Scope, type RiskTier } from "@/lib/cyber-data";

const TITLE = "Cyber Vitals — Cyber Risk Diagnostics Dashboard";
const DESC =
  "Read cyber exposure like a patient chart: risk ECG, treatment budget simulator, defence gauges and regional exposure map in ₹ Lakhs and Crores.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [scopeId, setScopeId] = useState<ScopeId>("national");
  const [tier, setTier] = useState<RiskTier>("all");
  const [operator, setOperator] = useState<string | null>(null);
  const scope = useMemo<Scope>(
    () => SCOPES.find((s) => s.id === scopeId) ?? (SCOPES[0] as Scope),
    [scopeId],
  );

  return (
    <div className="min-h-screen bg-background">
      <PulseHeader
        scope={scope}
        onScopeChange={setScopeId}
        operator={operator}
        onSignIn={setOperator}
        onSignOut={() => setOperator(null)}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <section aria-label="Risk pulse" className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <EcgMonitor scope={scope} />
          <DefenseGauges scope={scope} />
        </section>

        <ControlEffectiveness scope={scope} />

        <RiskFilter tier={tier} onTierChange={setTier} scope={scope} />

        <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
          <RiskAccordion scope={scope} tier={tier} />
          <BudgetSimulator scope={scope} />
        </div>

        <ExposureMap scope={scope} tier={tier} />

        <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
          <VitalsTerminal scope={scope} />
          <FaqAccordion />
        </div>

        <ComplianceBadges />
      </main>

      <footer className="border-t border-graphite-line px-4 py-6 sm:px-6">
        <p className="mx-auto max-w-7xl text-xs text-muted-foreground">
          Cyber Vitals · illustrative figures only, generated locally for demonstration. No live
          telemetry or customer data is processed.
        </p>
      </footer>
    </div>
  );
}
