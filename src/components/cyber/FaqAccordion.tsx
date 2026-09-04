import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "@/lib/cyber-data";
import { cn } from "@/lib/utils";

export function FaqAccordion() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section aria-labelledby="faq-heading" className="rounded-lg panel">
      <div className="border-b border-graphite-line px-4 py-3 sm:px-5">
        <h2 id="faq-heading" className="text-base font-semibold">
          Clinical knowledge base
        </h2>
        <p className="text-xs text-muted-foreground">
          How the vitals, tiers and spend curve are derived
        </p>
      </div>

      <ul className="space-y-px bg-graphite-line">
        {FAQ.map((item) => {
          const isOpen = open === item.id;
          return (
            <li key={item.id} style={{ backgroundColor: "var(--ink)" }}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${item.id}`}
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
                  id={`faq-${item.id}`}
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
