"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Percent, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Deal = {
  id: number;
  title: string;
  discount: number;
  originalPrice: number;
  newPrice: number;
  timeLeft: string;
  tag: string;
  gradient: string;
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
  },
];

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
      // ↓↓ Reduced spacing between stacked cards (and gap to tabs)
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
        start: "top 40px", // section hits near top of viewport
        end: () => `+=${scrollDistance}`,
        scrub: true,
        pin: section, // or pin: true
        pinSpacing: true,
        anticipatePin: 1,
        id: "dfxStackPin",
        invalidateOnRefresh: true,
        // markers: true,
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
          Don&apos;t miss out on these incredible offers – book now and save
          big!
        </p>
      </div>

      {/* Pinned / animated area */}
      <div className="dfx" ref={rootRef}>
        {/* Remove internal padding from pinned section */}
        <section className="dfx-section p-0">
          <div className="dfx-tabs-anchor">
            <div className="container mx-auto px-4">
              <div className="flex gap-3 overflow-x-auto pb-0 mb-0 leading-none md:justify-center">
                {deals.map((deal, index) => (
                  <button
                    key={deal.id}
                    className="dfx-tab flex-shrink-0 rounded-full bg-muted px-6 py-3 text-left cursor-pointer border border-border/60 shadow-[0_10px_25px_rgba(15,23,42,0.04)] hover:border-primary hover:bg-background/80 transition-colors"
                    data-index={index}
                    type="button"
                  >
                    <div className="text-sm font-semibold truncate">
                      {deal.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {deal.discount}% OFF • {deal.timeLeft}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pull cards up so there's no visible gap under the tabs */}
            <div className="-mt-12">
              {deals.map((deal) => (
                <div
                  className="dfx-card mx-auto"
                  key={deal.id}
                  style={{ width: "min(90vw, 640px)", minHeight: "370px" }}
                >
                  <div className="dfx-card-anim">
                    <div className="dfx-card-content w-full h-full">
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
