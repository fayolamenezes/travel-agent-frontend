"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Percent,
  TrendingUp,
  Plane,
  TreePalm,
  Building2,
  Mountain,
  Waves,
  Trees,
  Tent,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type DealTone = "secondary" | "primary" | "accent";

type Deal = {
  id: number;
  title: string;
  discount: number;
  originalPrice: number;
  newPrice: number;
  timeLeft: string;
  tag: string;
  gradient: string;
  tone: DealTone;
};

const deals: Deal[] = [
  {
    id: 1,
    title: "Summer Beach Getaway",
    discount: 35,
    originalPrice: 1299,
    newPrice: 844,
    timeLeft: "3 days left",
    tag: "Hot Deal",
    gradient: "from-secondary to-secondary/80",
    tone: "secondary",
  },
  {
    id: 2,
    title: "European City Tour",
    discount: 25,
    originalPrice: 1899,
    newPrice: 1424,
    timeLeft: "5 days left",
    tag: "Popular",
    gradient: "from-primary to-primary-glow",
    tone: "primary",
  },
  {
    id: 3,
    title: "Adventure Safari",
    discount: 40,
    originalPrice: 2199,
    newPrice: 1319,
    timeLeft: "2 days left",
    tag: "Last Chance",
    gradient: "from-accent to-accent/80",
    tone: "accent",
  },
  {
    id: 4,
    title: "Tropical Island Escape",
    discount: 30,
    originalPrice: 1599,
    newPrice: 1119,
    timeLeft: "7 days left",
    tag: "New",
    gradient: "from-primary to-primary-glow",
    tone: "primary",
  },
  {
    id: 5,
    title: "Mountain Retreat Weekend",
    discount: 20,
    originalPrice: 999,
    newPrice: 799,
    timeLeft: "6 days left",
    tag: "Limited",
    gradient: "from-secondary to-secondary/80",
    tone: "secondary",
  },
];

// Inline styles so they win over .dfx-tab CSS
const tabStyleForTone = (tone: DealTone): CSSProperties => {
  switch (tone) {
    case "secondary":
      return {
        background: "hsl(var(--secondary) / 0.10)",
        borderColor: "hsl(var(--secondary) / 0.45)",
        color: "hsl(var(--secondary))",
      };
    case "primary":
      return {
        background: "hsl(var(--primary-glow) / 0.10)",
        borderColor: "hsl(var(--primary-glow) / 0.45)",
        color: "hsl(var(--primary-glow))",
      };
    case "accent":
      return {
        background: "hsl(var(--accent) / 0.10)",
        borderColor: "hsl(var(--accent) / 0.45)",
        color: "hsl(var(--accent))",
      };
  }
};

const tabDotStyleForTone = (tone: DealTone): CSSProperties => {
  switch (tone) {
    case "secondary":
      return { background: "hsl(var(--secondary))" };
    case "primary":
      return { background: "hsl(var(--primary-glow))" };
    case "accent":
      return { background: "hsl(var(--accent))" };
  }
};

// Icons OUTSIDE the card, left + right, clearly visible
const DealSideIcons = ({ id }: { id: number }) => {
  const base =
    "pointer-events-none absolute z-0 text-secondary/60 opacity-80 md:opacity-90";

  switch (id) {
    case 1: // Summer Beach Getaway
      return (
        <>
          <TreePalm
            className={`${base} left-[-80px] top-8 h-24 w-24 md:h-32 md:w-32 rotate-6`}
          />
          <Waves
            className={`${base} right-[-80px] bottom-10 h-24 w-24 md:h-32 md:w-32 -rotate-6`}
          />
        </>
      );

    case 2: // European City Tour
      return (
        <>
          <Building2
            className={`${base} left-[-80px] top-10 h-24 w-24 md:h-32 md:w-32`}
          />
          <Plane
            className={`${base} right-[-90px] bottom-8 h-20 w-20 md:h-28 md:w-28 -rotate-12`}
          />
        </>
      );

    case 3: // Adventure Safari
      return (
        <>
          <Trees
            className={`${base} left-[-80px] top-10 h-24 w-24 md:h-32 md:w-32`}
          />
          <Tent
            className={`${base} right-[-90px] bottom-8 h-20 w-20 md:h-28 md:w-28`}
          />
        </>
      );

    case 4: // Tropical Island Escape
      return (
        <>
          <TreePalm
            className={`${base} left-[-80px] top-10 h-24 w-24 md:h-32 md:w-32 rotate-3`}
          />
          <Waves
            className={`${base} right-[-80px] bottom-10 h-24 w-24 md:h-32 md:w-32`}
          />
        </>
      );

    case 5: // Mountain Retreat Weekend
      return (
        <>
          <Mountain
            className={`${base} left-[-80px] top-10 h-24 w-24 md:h-32 md:w-32`}
          />
          <Trees
            className={`${base} right-[-80px] bottom-10 h-20 w-20 md:h-28 md:w-28`}
          />
        </>
      );

    default:
      return null;
  }
};

export const FeaturedDeals = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = rootRef.current;
    if (!root) return;

    // Guard against double init (React StrictMode, etc.)
    if (root.getAttribute("data-inited") === "1") return;
    root.setAttribute("data-inited", "1");

    const orientationHandler = () => {
      window.setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 200);
    };

    const visibilityHandler = () => {
      if (!document.hidden) {
        window.setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 120);
      }
    };

    ScrollTrigger.config({ ignoreMobileResize: true });
    window.addEventListener("orientationchange", orientationHandler);
    document.addEventListener("visibilitychange", visibilityHandler);

    const section = root.querySelector<HTMLElement>(".dfx-section");
    if (!section) return;

    const cards = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".dfx-card")
    );
    const animEls = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll(".dfx-card-anim")
    );
    const tabs = root.querySelectorAll<HTMLElement>(".dfx-tab");

    if (cards.length === 0 || animEls.length === 0) return;

    let viewportHeight: number;
    let spacing: number;
    let entryY: number;
    let tiltAngle: number;
    let scrollDistance: number;

    const STEP = 0.5;
    const MAX_VISIBLE = 3;

    const getVH = () => {
      if (window.visualViewport && window.visualViewport.height) {
        return window.visualViewport.height;
      }
      return window.innerHeight || 800;
    };

    const recalc = () => {
      viewportHeight = getVH();
      // Reduced spacing between stacked cards (and gap to tabs)
      spacing = viewportHeight * 0.03;

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const bias = isMobile ? 0.4 : 0.3;
      entryY = viewportHeight * (1 - bias);

      tiltAngle = -10;
      scrollDistance = viewportHeight * 2.6;
    };

    const setInitialStates = () => {
      cards.forEach((card, index) => {
        gsap.set(card, {
          y: entryY,
          opacity: 0,
          zIndex: index,
          rotateX: 0,
          scale: 1,
        });
      });

      animEls.forEach((el) => {
        gsap.set(el, {
          rotateX: tiltAngle,
          force3D: true,
        });
      });
    };

    recalc();
    setInitialStates();

    // Use the same element as trigger AND pinned element
    const scrollTween = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 40px",
        end: () => `+=${scrollDistance}`,
        scrub: true,
        pin: section,
        pinSpacing: true,
        anticipatePin: 1,
        id: "dfxStackPin",
        invalidateOnRefresh: true,
      },
    });

    animEls.forEach((animEl, index) => {
      const shell = cards[index];
      const start = index * STEP;

      scrollTween.set(shell, { opacity: 1, scale: 1 }, start);

      scrollTween.to(
        animEl,
        {
          rotateX: 0,
          duration: 0.6,
          ease: "power2.out",
          force3D: true,
        },
        start
      );

      scrollTween.to(
        shell,
        {
          y: () => (MAX_VISIBLE - 1) * spacing,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          force3D: true,
        },
        start
      );

      for (
        let j = Math.max(0, index - (MAX_VISIBLE - 1));
        j < index;
        j += 1
      ) {
        const depth = index - j;
        if (depth < MAX_VISIBLE) {
          const scales: number[] = [1, 0.94, 0.88];
          scrollTween.to(
            cards[j],
            {
              y: () => `-=${spacing}`,
              scale: () => scales[depth],
              duration: 0.4,
              ease: "power1.out",
              force3D: true,
            },
            start
          );
        }
      }

      if (index >= MAX_VISIBLE) {
        const fadeOutCard = cards[index - MAX_VISIBLE];
        scrollTween.to(
          fadeOutCard,
          {
            opacity: 0,
            duration: 0.2,
            ease: "power1.out",
          },
          start + 0.2
        );
      }
    });

    const getStackTrigger = () => ScrollTrigger.getById("dfxStackPin");

    const tabHandlers: Array<(event: MouseEvent) => void> = [];

    tabs.forEach((tab, idx) => {
      const handler = (event: MouseEvent) => {
        event.preventDefault();

        const indexAttr = tab.dataset.index;
        const cardIndex =
          typeof indexAttr === "string" ? Number(indexAttr) : idx;

        const duration = scrollTween.duration();
        const targetTime = (cardIndex + 1) * STEP - 0.001;
        const targetProgress = targetTime / duration;

        const trigger = getStackTrigger();
        if (!trigger) return;

        const totalScroll = trigger.end - trigger.start;
        const scrollY = trigger.start + targetProgress * totalScroll;

        window.scrollTo({ top: scrollY, behavior: "smooth" });
      };

      tabHandlers.push(handler);
      tab.addEventListener("click", handler);
    });

    const doRefresh = () => {
      recalc();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", doRefresh, { passive: true });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", doRefresh, {
        passive: true,
      });
    }

    const refreshInitHandler = () => {
      recalc();
      setInitialStates();
    };

    ScrollTrigger.addEventListener("refreshInit", refreshInitHandler);

    return () => {
      window.removeEventListener("orientationchange", orientationHandler);
      document.removeEventListener("visibilitychange", visibilityHandler);
      window.removeEventListener("resize", doRefresh);

      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", doRefresh);
      }

      const stackTrigger = ScrollTrigger.getById("dfxStackPin");
      if (stackTrigger) {
        stackTrigger.kill();
      }

      ScrollTrigger.removeEventListener("refreshInit", refreshInitHandler);

      tabs.forEach((tab, index) => {
        const handler = tabHandlers[index];
        tab.removeEventListener("click", handler);
      });
    };
  }, []);

  return (
    <section id="deals" className="bg-background py-20">
      {/* Heading OUTSIDE the pin area */}
      <div className="container mx-auto px-4 mb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="h-8 w-8 text-secondary" />
          <Badge variant="secondary" className="text-base px-4 py-1">
            Limited Time Offers
          </Badge>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-3">
          Exclusive <span className="text-gradient">Travel Deals</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Don&apos;t miss out on these incredible offers – book now and save big!
        </p>
      </div>

      {/* Pinned / animated area */}
      <div className="dfx overflow-x-hidden" ref={rootRef}>
        <section className="dfx-section p-0">
          <div className="dfx-tabs-anchor">
            <div className="container mx-auto px-4">
              <div className="flex gap-3 overflow-x-auto pb-0 mb-0 leading-none md:justify-center">
                {deals.map((deal, index) => (
                  <button
                    key={deal.id}
                    className="dfx-tab flex-shrink-0 rounded-full px-6 py-3 text-left cursor-pointer border shadow-[0_10px_25px_rgba(15,23,42,0.06)] bg-background/60 backdrop-blur-sm transition-all hover:-translate-y-[1px] hover:shadow-medium"
                    data-index={index}
                    type="button"
                    style={tabStyleForTone(deal.tone)}
                  >
                    <div className="text-sm font-semibold truncate">
                      {deal.title}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-2 text-[11px]">
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={tabDotStyleForTone(deal.tone)}
                      />
                      <span className="opacity-80">
                        {deal.discount}% OFF • {deal.timeLeft}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pull cards up so there's no visible gap under the tabs */}
            <div className="-mt-12">
              {deals.map((deal) => (
                <div
                  className="dfx-card mx-auto w-full max-w-[640px]"
                  key={deal.id}
                  style={{ minHeight: "370px" }}
                >
                  <div className="dfx-card-anim relative">
                    {/* Side icons left + right of the card */}
                    <DealSideIcons id={deal.id} />

                    <div className="dfx-card-content relative z-10 w-full h-full">
                      <Card className="w-full h-full overflow-hidden border-0 shadow-medium bg-background">
                        <div
                          className={`p-6 bg-gradient-to-br ${deal.gradient} text-white`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                              {deal.tag}
                            </Badge>
                            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                {deal.timeLeft}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold mb-2">
                            {deal.title}
                          </h3>

                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <Percent className="h-5 w-5" />
                              <span className="text-lg font-bold">
                                {deal.discount}% OFF
                              </span>
                            </div>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold">
                              ${deal.newPrice}
                            </span>
                            <span className="text-lg text-white/70 line-through">
                              ${deal.originalPrice}
                            </span>
                          </div>
                        </div>

                        <CardContent className="p-6">
                          <ul className="space-y-3 mb-6 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              Round-trip flights included
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              Premium accommodation
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              Guided tours & activities
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              24/7 customer support
                            </li>
                          </ul>

                          <Button variant="hero" className="w-full" size="lg">
                            Grab This Deal
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div className="dfx-card-border" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scroll space after pinned section */}
        <div className="dfx-scroll-space h-[120vh]" />
      </div>
    </section>
  );
};
