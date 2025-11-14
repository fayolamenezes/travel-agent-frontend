import { Card } from "@/components/ui/card";
import { Palmtree, Mountain, Building2, Compass, Waves, Camera } from "lucide-react";

const categories = [
  {
    icon: Palmtree,
    name: "Beach & Tropical",
    count: 128,
    gradient: "from-accent/20 to-accent/5"
  },
  {
    icon: Mountain,
    name: "Mountain & Adventure",
    count: 94,
    gradient: "from-primary/20 to-primary/5"
  },
  {
    icon: Building2,
    name: "City & Culture",
    count: 156,
    gradient: "from-secondary/20 to-secondary/5"
  },
  {
    icon: Compass,
    name: "Wildlife Safari",
    count: 67,
    gradient: "from-primary-glow/20 to-primary-glow/5"
  },
  {
    icon: Waves,
    name: "Cruise & Ocean",
    count: 45,
    gradient: "from-accent/20 to-accent/5"
  },
  {
    icon: Camera,
    name: "Photography Tours",
    count: 38,
    gradient: "from-secondary/20 to-secondary/5"
  }
];

export const Categories = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Browse by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find your perfect adventure from our diverse range of travel experiences
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.name}
                className={`group p-6 hover-lift cursor-pointer text-center border-0 shadow-soft animate-fade-in-up bg-gradient-to-br ${category.gradient}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2 text-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} trips</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
