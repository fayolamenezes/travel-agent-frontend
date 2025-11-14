import { useState } from "react";
import { Card } from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/apiBase";
import { Brain, ChevronDown } from "lucide-react";

export type ReasoningPayload = {
  destination: string;
  startDate: string;
  endDate: string;
  interests?: string;
  travelers?: number;
  budget?: string;
};

type Props = {
  payload: ReasoningPayload;
};

export default function ReasoningAccordion({ payload }: Props) {
  const [open, setOpen] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  async function fetchReasoning() {
    try {
      setLoading(true);
      setSteps([]);

      const res = await fetch(`${API_BASE_URL}/api/reasoning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // stream line-by-line
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        const newLines = lines.map((line) => line.trim()).filter(Boolean);
        if (newLines.length) {
          setSteps((prev) => [...prev, ...newLines]);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSteps([`Could not load reasoning: ${message}`]);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !hasLoaded) {
      void fetchReasoning();
    }
  };

  return (
    <Card className="mt-4 p-4 bg-white/90">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-700">
            <Brain className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              How this trip was planned
            </p>
            <p className="text-xs text-slate-500">
              See the reasoning steps your AI travel planner used.
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          {loading && (
            <p className="text-xs text-slate-600">
              Thinking through your itinerary…
            </p>
          )}

          {!loading && steps.length > 0 && (
            <ol className="space-y-2 text-xs text-slate-700">
              {steps.map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[10px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}

          {!loading && !steps.length && hasLoaded && (
            <p className="text-xs text-slate-600">
              No reasoning details were returned.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
