import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, User, User2 } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    gender: "female",
    location: "New York, USA",
    rating: 5,
    text: "Absolutely incredible experience! The team handled everything perfectly from start to finish. Our Swiss Alps adventure was unforgettable!",
    initials: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    gender: "male",
    location: "Singapore",
    rating: 5,
    text: "Best travel agency I've ever worked with. Professional, responsive, and they really care about making your trip special. Highly recommended!",
    initials: "MC",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    gender: "female",
    location: "Madrid, Spain",
    rating: 5,
    text: "Our Maldives honeymoon was pure magic. Every detail was perfect, and the customer service was outstanding. Thank you for the memories!",
    initials: "ER",
  },
  {
    id: 4,
    name: "Daniel Weber",
    gender: "male",
    location: "Berlin, Germany",
    rating: 5,
    text: "Loved how they balanced culture, food, and nightlife in our Tokyo itinerary. It felt like the city was curated just for us.",
    initials: "DW",
  },
  {
    id: 5,
    name: "Priya Nair",
    gender: "female",
    location: "Bengaluru, India",
    rating: 5,
    text: "The European rail trip they planned was flawless. Zero stress, just pure enjoyment. The hotel picks were spot on for our budget.",
    initials: "PN",
  },
  {
    id: 6,
    name: "Lucas Martins",
    gender: "male",
    location: "São Paulo, Brazil",
    rating: 4,
    text: "Great communication and thoughtful recommendations. Our family Costa Rica holiday was packed with fun but never felt rushed.",
    initials: "LM",
  },
  {
    id: 7,
    name: "Hannah Lee",
    gender: "female",
    location: "Seoul, South Korea",
    rating: 5,
    text: "They understood exactly what I wanted as a solo traveler. Safe neighborhoods, cool cafés, and unique experiences in Lisbon.",
    initials: "HL",
  },
  {
    id: 8,
    name: "Omar Al-Fayed",
    gender: "male",
    location: "Dubai, UAE",
    rating: 5,
    text: "From desert safaris to hidden rooftop spots, the city break they created for my friends and me was unforgettable.",
    initials: "OF",
  },
];

export const Testimonials = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const isDraggingRef = useRef(false);

  const createTween = () => {
    const el = carouselRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    const tween = gsap.to(el, {
      scrollLeft: maxScroll,
      duration: 50, // bigger = slower
      ease: "none",
      repeat: -1,
      yoyo: true,
    });

    tweenRef.current = tween;
  };

  // initial GSAP auto-scroll
  useEffect(() => {
    createTween();

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const pauseAuto = () => {
    tweenRef.current?.pause();
  };

  const resumeAuto = () => {
    // kill old tween and recreate from current position
    tweenRef.current?.kill();
    createTween();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    el.style.cursor = "grabbing";
    el.setPointerCapture(e.pointerId);
    pauseAuto();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el || !isDraggingRef.current) return;

    el.scrollLeft -= e.movementX;
  };

  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    const el = carouselRef.current;
    if (!el || !isDraggingRef.current) return;

    isDraggingRef.current = false;
    el.style.cursor = "grab";
    if (e) {
      el.releasePointerCapture(e.pointerId);
    }
    resumeAuto();
  };

  const GenderIcon = ({ gender }: { gender: string }) =>
    gender === "female" ? (
      <User2 className="h-6 w-6 text-primary" />
    ) : (
      <User className="h-6 w-6 text-primary" />
    );

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="text-gradient">Travelers Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy travelers who&apos;ve experienced their
            dream vacations with us.
          </p>
        </div>

        <div
          ref={carouselRef}
          className="relative overflow-hidden cursor-grab"
          onMouseEnter={pauseAuto}
          onMouseLeave={resumeAuto}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <div className="flex gap-6 min-w-full pr-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="testimonial-card hover-lift border-0 shadow-medium flex-none w-full md:w-[430px] bg-card/95"
              >
                <CardContent className="p-6">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-secondary text-secondary"
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <GenderIcon gender={testimonial.gender} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* duplicate list for smoother long scroll */}
            {testimonials.map((testimonial) => (
              <Card
                key={`dup-${testimonial.id}`}
                className="testimonial-card hover-lift border-0 shadow-medium flex-none w-full md:w-[430px] bg-card/95"
              >
                <CardContent className="p-6">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />

                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-secondary text-secondary"
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <GenderIcon gender={testimonial.gender} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
