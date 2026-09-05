import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export function OperatorAccess({
  operator,
  onSignIn,
  onSignOut,
}: {
  operator: string | null;
  onSignIn: (id: string) => void;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) firstField.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSignIn(id.trim() ? `OP-${id.trim().replace(/\D/g, "").slice(0, 4) || "8492"}` : "OP-8492");
    setOpen(false);
    setId("");
    setPass("");
  }

  if (operator) {
    return (
      <div className="flex items-center gap-3">
        <span
          className="rounded border px-3 py-2 font-mono text-xs"
          style={{ borderColor: "var(--copper)", color: "var(--copper)" }}
        >
          {operator} // ACTIVE
        </span>
        <button
          type="button"
          onClick={onSignOut}
          className="font-mono text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border px-3 py-2 font-mono text-xs transition-colors"
        style={{ borderColor: "var(--copper)", color: "var(--copper)" }}
      >
        [ Operator Access ]
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="op-login-title"
            className="w-full max-w-sm rounded-lg border p-5"
            style={{ backgroundColor: "var(--ink)", borderColor: "var(--ink-line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="op-login-title"
                  className="font-mono text-sm"
                  style={{ color: "var(--copper)" }}
                >
                  [ Operator Access ]
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Local mock console — no credentials leave this device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close operator access"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={submit} className="mt-5 space-y-4">
              <div>
                <label htmlFor="op-id" className="text-tick text-muted-foreground">
                  Operator ID
                </label>
                <input
                  id="op-id"
                  ref={firstField}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  autoComplete="off"
                  className="mt-1.5 w-full rounded border bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--copper)] focus:outline-2 focus:outline-offset-1 focus:outline-[var(--copper)]"
                  style={{ borderColor: "var(--ink-line)", color: "var(--parchment)" }}
                />
              </div>
              <div>
                <label htmlFor="op-pass" className="text-tick text-muted-foreground">
                  Password
                </label>
                <input
                  id="op-pass"
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  autoComplete="off"
                  className="mt-1.5 w-full rounded border bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[var(--copper)] focus:outline-2 focus:outline-offset-1 focus:outline-[var(--copper)]"
                  style={{ borderColor: "var(--ink-line)", color: "var(--parchment)" }}
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 rounded px-3 py-2 font-mono text-xs font-medium"
                  style={{ backgroundColor: "var(--copper)", color: "var(--ink)" }}
                >
                  Authenticate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setId("8492");
                    setPass("demo-access");
                  }}
                  className="rounded border px-3 py-2 font-mono text-xs"
                  style={{ borderColor: "var(--ink-line)", color: "var(--copper)" }}
                >
                  Demo Fill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
