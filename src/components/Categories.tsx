"use client";

import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Palmtree, Mountain, Building2, Compass, Waves } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    icon: Palmtree,
    name: "Beach & Tropical",
    count: 128,
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Mountain,
    name: "Mountain & Adventure",
    count: 94,
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Building2,
    name: "City & Culture",
    count: 156,
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    icon: Compass,
    name: "Wildlife Safari",
    count: 67,
    gradient: "from-primary-glow/20 to-primary-glow/5",
  },
  {
    icon: Waves,
    name: "Cruise & Ocean",
    count: 45,
    gradient: "from-accent/20 to-accent/5",
  },
];

export const Categories = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    // Match Tailwind's lg breakpoint (min-width: 1024px)
    const mq = window.matchMedia("(min-width: 1024px)");

    const ctx = gsap.context(() => {
      if (!mq.matches) return; // desktop-only

      const section =
        root.querySelector<HTMLElement>("[data-categories-section]");
      const inner =
        root.querySelector<HTMLElement>("[data-categories-inner]");
      const container =
        root.querySelector<HTMLElement>("[data-categories-container]");
      const cards =
        container?.querySelectorAll<HTMLElement>("[data-category-card]") ?? [];

      if (!section || !inner || !container || !cards.length) return;
      if (cards.length < 5) return; // animation assumes 5 cards

      const vh = () => window.innerHeight || 800;
      // About 3 viewport heights of scroll, similar to 400vh track with 100vh pinned
      const scrollDistance = () => (window.innerHeight || 800) * 3;

      // --- INITIAL STATES ---
      const nonCenter: HTMLElement[] = [];
      cards.forEach((card, i) => {
        if (i !== 2) nonCenter.push(card);
      });

      gsap.set(nonCenter, { y: Math.round(vh()) });
      gsap.set(cards[2], { scale: 1.6, y: 30, zIndex: 10, force3D: true });
      gsap.set(container, { scale: 1.2, y: 30, force3D: true });
      gsap.set(cards, { force3D: true });

      // --- 1) PIN TRIGGER ---
      const pinTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + scrollDistance(),
        pin: inner,
        pinType: "fixed",
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -50,
      });

      // --- 2) ANIMATION TIMELINE ---
      const tl = gsap.timeline({
        defaults: { ease: "none" }, // perfect scrub
      });

      // 1) Center card settles a bit
      tl.to(cards[2], { y: 0, scale: 1.5, duration: 0.5 })

        // 2) Cards 1 & 3 slide up with side offsets
        .to(
          [cards[1], cards[3]],
          {
            y: 0,
            x: (i: number) => (i === 0 ? -80 : 80),
            scale: 1.5,
            duration: 0.4,
          },
          "<"
        )

        // 3) Outer cards (0 & 4) slide up
        .to([cards[0], cards[4]], { y: 0, duration: 0.4 })

        // 4) Container eases in
        .to(
          container,
          {
            scale: 1.1,
            gap: "2rem",
            y: 0,
            duration: 0.5,
          },
          "<"
        )

        // 5) Normalize all cards
        .to(
          cards,
          {
            scale: 1.1,
            x: 0,
            y: 0,
            zIndex: 1,
            duration: 0.5,
          },
          "<"
        )
        .set(cards[2], { zIndex: 1 });

      const animTrigger = ScrollTrigger.create({
        animation: tl,
        trigger: section,
        start: "top top",
        end: () => "+=" + scrollDistance(),
        scrub: true,
        invalidateOnRefresh: true,
      });

      // Make sure everything recalculates once layout/fonts/images settle
      requestAnimationFrame(() => {
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 80);
      });

      // Cleanup on unmount
      return () => {
        pinTrigger.kill();
        animTrigger.kill();
      };
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-gradient-subtle overflow-x-hidden"
    >
      {/* On mobile: behaves like normal section (no pin, height auto)
          On desktop: ScrollTrigger adds spacing for the pinned duration */}
      <div data-categories-section className="relative">
        <div
          data-categories-inner
          className="h-auto lg:h-screen flex flex-col justify-start items-center"
        >
          <div className="w-full px-4">
            <div className="container mx-auto pt-20 pb-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Browse by <span className="text-gradient">Category</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Find your perfect adventure from our diverse range of travel
                  experiences
                </p>
              </div>

              <div
                data-categories-container
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
              >
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card
                      key={category.name}
                      data-category-card
                      className={`group p-6 hover-lift cursor-pointer text-center border-0 shadow-soft bg-gradient-to-br ${category.gradient}`}
                      style={{
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <div className="mb-4 flex justify-center">
                        <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2 text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} trips
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
