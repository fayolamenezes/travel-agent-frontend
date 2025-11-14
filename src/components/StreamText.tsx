import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_BASE_URL } from "@/lib/apiBase";

export type StreamBody = Record<string, unknown>;

type StreamTextProps<TBody extends StreamBody> = {
  endpoint: string;
  body: TBody | null;
  onComplete?: (fullText: string) => void;
  /** If true, automatically start streaming whenever body changes */
  autoRun?: boolean;
};

export default function StreamText<TBody extends StreamBody>({
  endpoint,
  body,
  onComplete,
  autoRun = false,
}: StreamTextProps<TBody>) {
  const [text, setText] = useState("");
  const [isLoading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll while streaming
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    el.scrollTop = el.scrollHeight;
  }, [text, isLoading]);

  async function start() {
    if (!body) return;

    setText("");
    setLoading(true);
    const controller = new AbortController();
    abortRef.current = controller;

    let finalText = "";

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to start streaming");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        finalText += chunk;
        setText((t) => t + chunk);
      }
    } catch {
      // swallow; you can log if you want
    } finally {
      setLoading(false);
      onComplete?.(finalText);
    }
  }

  function cancel() {
    abortRef.current?.abort();
    setLoading(false);
  }

  // auto-run when body changes and autoRun is true
  useEffect(() => {
    if (autoRun && body) {
      start();
    }
    // we intentionally omit `start` from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, JSON.stringify(body)]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={start}
          disabled={isLoading || !body}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {isLoading ? "Generating…" : "Regenerate"}
        </button>
        {isLoading && (
          <button
            type="button"
            onClick={cancel}
            className="text-xs text-destructive underline"
          >
            Cancel
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="h-72 w-full overflow-y-auto rounded-lg border border-border bg-muted/40 p-4 text-sm"
      >
        {text ? (
          <article className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </article>
        ) : !isLoading ? (
          <p className="text-xs text-muted-foreground">
            Hit <strong>Plan Trip</strong> above to generate your itinerary.
          </p>
        ) : null}
      </div>
    </div>
  );
}
