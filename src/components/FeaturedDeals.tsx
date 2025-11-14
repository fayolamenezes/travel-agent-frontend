import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Percent, TrendingUp } from "lucide-react";

const deals = [
  {
    id: 1,
    title: "Summer Beach Getaway",
    discount: 35,
    originalPrice: 1299,
    newPrice: 844,
    timeLeft: "3 days left",
    tag: "Hot Deal",
    gradient: "from-secondary to-secondary/80"
  },
  {
    id: 2,
    title: "European City Tour",
    discount: 25,
    originalPrice: 1899,
    newPrice: 1424,
    timeLeft: "5 days left",
    tag: "Popular",
    gradient: "from-primary to-primary-glow"
  },
  {
    id: 3,
    title: "Adventure Safari",
    discount: 40,
    originalPrice: 2199,
    newPrice: 1319,
    timeLeft: "2 days left",
    tag: "Last Chance",
    gradient: "from-accent to-accent/80"
  }
];

export const FeaturedDeals = () => {
  return (
    <section id="deals" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-secondary" />
            <Badge variant="secondary" className="text-base px-4 py-1">
              Limited Time Offers
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Exclusive <span className="text-gradient">Travel Deals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on these incredible offers - book now and save big!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <Card 
              key={deal.id}
              className="overflow-hidden hover-lift border-0 shadow-medium animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-6 bg-gradient-to-br ${deal.gradient} text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                    {deal.tag}
                  </Badge>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{deal.timeLeft}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Percent className="h-5 w-5" />
                    <span className="text-lg font-bold">{deal.discount}% OFF</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${deal.newPrice}</span>
                  <span className="text-lg text-white/70 line-through">${deal.originalPrice}</span>
                </div>
              </div>

              <CardContent className="p-6">
                <ul className="space-y-3 mb-6 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    Round-trip flights included
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    Premium accommodation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    Guided tours & activities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    24/7 customer support
                  </li>
                </ul>

                <Button variant="hero" className="w-full" size="lg">
                  Grab This Deal
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
