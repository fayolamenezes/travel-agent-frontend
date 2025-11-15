import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const NeonDripsLayer = () => {
  useEffect(() => {
    const grid = document.getElementById("neonDrips");
    if (!grid) return;

    // avoid double init in StrictMode
    if (grid.getAttribute("data-neon-init") === "1") return;
    grid.setAttribute("data-neon-init", "1");

    // ==== CONFIG ====
    const TARGET_VISIBLE = 12; // average visible lines
    const PX_PER_SEC = 85;
    const MIN_DURATION = 5;
    const MAX_DURATION = 12;
    const MIN_HEIGHT = 28;
    const MAX_HEIGHT = 70;
    const MIN_SEPARATION_PX = 14;
    const START_Y_MIN = -160;
    const START_Y_MAX = -80;

    // colors pulled from your theme (matching Featured Deals):
    const COLORS = [
      "linear-gradient(to top, hsl(var(--primary-glow)), transparent)",
      "linear-gradient(to top, hsl(var(--secondary)), transparent)",
      "linear-gradient(to top, hsl(var(--accent)), transparent)",
      "linear-gradient(to top, #ffffff, transparent)",
    ];

    let colorIndex = 0;
    const nextColor = () =>
      COLORS[(colorIndex = (colorIndex + 1) % COLORS.length)];

    const activeXs = new Set<number>();
    let timer: number | null = null;

    const rand = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const randInt = (min: number, max: number) =>
      Math.floor(rand(min, max + 1));
    const bucketForX = (x: number) => Math.round(x / MIN_SEPARATION_PX);

    function pickX() {
      const width = window.innerWidth;
      const margin = 4;
      const maxTries = 16;

      for (let t = 0; t < maxTries; t++) {
        const x = rand(margin, Math.max(margin, width - margin - 2));
        const b = bucketForX(x);
        if (!activeXs.has(b) && !activeXs.has(b - 1) && !activeXs.has(b + 1)) {
          activeXs.add(b);
          return { x, bucket: b };
        }
      }

      const fallbackX = rand(margin, Math.max(margin, width - margin - 2));
      const fb = bucketForX(fallbackX);
      activeXs.add(fb);
      return { x: fallbackX, bucket: fb };
    }

    function computeDuration() {
      const fallDistance = window.innerHeight + 220;
      const d = fallDistance / PX_PER_SEC;
      return Math.max(MIN_DURATION, Math.min(MAX_DURATION, d));
    }

    function createNeonLine() {
      const line = document.createElement("div");
      line.className = "neon-line";
      line.style.background = nextColor();

      const { x, bucket } = pickX();
      line.dataset.bucket = String(bucket);
      line.style.left = `${x}px`;

      const yStart = rand(START_Y_MIN, START_Y_MAX);
      line.style.setProperty("--yStart", `${yStart}px`);

      const h = randInt(MIN_HEIGHT, MAX_HEIGHT);
      line.style.height = `${h}px`;
      line.style.top = "0px";

      const duration = computeDuration();
      line.style.setProperty("--dur", `${duration}s`);

      grid.appendChild(line);

      const cleanup = () => {
        const b = parseInt(line.dataset.bucket || "0", 10);
        activeXs.delete(b);
        line.removeEventListener("animationend", cleanup);
        if (line.parentElement) line.parentElement.removeChild(line);
      };

      line.addEventListener("animationend", cleanup);
      // safety timeout
      window.setTimeout(cleanup, duration * 1000 + 600);

      return duration;
    }

    function scheduleNext(meanMs: number) {
      const u = Math.random();
      const wait = -Math.log(1 - u) * meanMs;
      timer = window.setTimeout(tick, wait);
    }

    function tick() {
      const dur = createNeonLine();
      const meanMs = (dur * 1000) / TARGET_VISIBLE;
      scheduleNext(meanMs);
    }

    function start() {
      const firstDur = computeDuration();
      const meanMs = (firstDur * 1000) / TARGET_VISIBLE;

      // seed
      window.setTimeout(createNeonLine, 0);
      window.setTimeout(createNeonLine, meanMs * 0.5);

      scheduleNext(meanMs);
    }

    let resizeTimer: number | null = null;
    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // new spawns automatically adapt via computeDuration()
      }, 100);
    };

    window.addEventListener("resize", onResize, { passive: true });

    start();

    return () => {
      if (timer) window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      activeXs.clear();
    };
  }, []);

  return (
    <div className="neon-drips-bg" id="neonDrips" aria-hidden="true"></div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* 🔥 Neon background behind everything */}
      <NeonDripsLayer />

      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
