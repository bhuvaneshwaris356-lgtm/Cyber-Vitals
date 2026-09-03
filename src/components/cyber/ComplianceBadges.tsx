import { BadgeCheck, CircleAlert, Clock } from "lucide-react";
import { COMPLIANCE } from "@/lib/cyber-data";

function statusMeta(status: string) {
  if (status === "Certified" || status === "Aligned")
    return { color: "var(--vital)", Icon: BadgeCheck };
  if (status === "Gap review") return { color: "var(--alarm)", Icon: CircleAlert };
  return { color: "var(--caution)", Icon: Clock };
}

export function ComplianceBadges() {
  return (
    <section aria-labelledby="comp-heading" className="rounded-lg panel">
      <div className="border-b border-graphite-line px-4 py-3 sm:px-5">
        <h2 id="comp-heading" className="text-base font-semibold">
          Compliance vitals
        </h2>
        <p className="text-xs text-muted-foreground">
          Regulatory posture across Indian and global frameworks
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-px bg-graphite-line sm:grid-cols-2 lg:grid-cols-3">
        {COMPLIANCE.map((c) => {
          const { color, Icon } = statusMeta(c.status);
          return (
            <li key={c.id} className="bg-card px-4 py-4">
              <div className="flex items-start gap-2.5">
                <Icon className="mt-0.5 size-4 shrink-0" style={{ color }} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{c.label}</p>
                  <p className="mt-1 text-tick" style={{ color }}>
                    {c.status}
                  </p>
                  <div
                    className="mt-3 h-1 overflow-hidden rounded-full bg-secondary"
                    role="meter"
                    aria-label={`${c.label} readiness`}
                    aria-valuenow={c.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${c.score}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{c.score}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
