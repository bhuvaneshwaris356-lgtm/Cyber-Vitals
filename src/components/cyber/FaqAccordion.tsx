import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { KB_SECTIONS } from "@/lib/cyber-data";
import { cn } from "@/lib/utils";

export function FaqAccordion() {
  const [tab, setTab] = useState(KB_SECTIONS[0]!.id);
  const [open, setOpen] = useState<string | null>(null);
  const section = KB_SECTIONS.find((s) => s.id === tab) ?? KB_SECTIONS[0]!;

  return (
    <section aria-labelledby="kb-heading" className="rounded-lg panel">
      <div className="border-b border-graphite-line px-4 py-3 sm:px-5">
        <h2 id="kb-heading" className="text-base font-semibold">
          Diagnostic knowledge base
        </h2>
        <p className="text-xs text-muted-foreground">{section.blurb}</p>
      </div>

      <div
        className="flex flex-wrap gap-1 border-b p-3 sm:px-5"
        role="tablist"
        aria-label="Knowledge base sections"
        style={{ borderColor: "var(--ink-line)" }}
      >
        {KB_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={`kb-tab-${s.id}`}
            aria-selected={s.id === tab}
            aria-controls={`kb-panel-${s.id}`}
            onClick={() => {
              setTab(s.id);
              setOpen(null);
            }}
            className={cn(
              "rounded border px-3 py-1.5 font-mono text-xs transition-colors",
              s.id === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
            style={{
              borderColor: s.id === tab ? "var(--copper)" : "var(--ink-line)",
              backgroundColor:
                s.id === tab ? "color-mix(in oklab, var(--copper) 12%, transparent)" : "var(--ink)",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <ul
        className="space-y-px"
        role="tabpanel"
        id={`kb-panel-${section.id}`}
        aria-labelledby={`kb-tab-${section.id}`}
        style={{ backgroundColor: "var(--ink-line)" }}
      >
        {section.items.map((item) => {
          const isOpen = open === item.id;
          return (
            <li key={item.id} style={{ backgroundColor: "var(--ink)" }}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`kb-${item.id}`}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary/30 sm:px-5"
                >
                  <span
                    className="flex-1 text-sm font-medium"
                    style={{ color: "var(--parchment)" }}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    className={cn("size-4 shrink-0 transition-transform", isOpen && "rotate-180")}
                    style={{ color: "var(--copper)" }}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              {isOpen && (
                <div
                  id={`kb-${item.id}`}
                  className="border-t px-4 py-4 text-sm leading-relaxed sm:px-5"
                  style={{
                    borderColor: "var(--ink-line)",
                    color: "color-mix(in oklab, var(--parchment) 82%, transparent)",
                  }}
                >
                  {item.a}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
