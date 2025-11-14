import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star } from "lucide-react";
import mountainsImage from "@/assets/destination-mountains.jpg";
import cityImage from "@/assets/destination-city.jpg";
import islandImage from "@/assets/destination-island.jpg";
import desertImage from "@/assets/destination-desert.jpg";

const destinations = [
  {
    id: 1,
    name: "Swiss Alps",
    location: "Switzerland",
    image: mountainsImage,
    rating: 4.9,
    reviews: 2847,
    price: 899,
    description: "Breathtaking mountain peaks and alpine adventures"
  },
  {
    id: 2,
    name: "Historic Prague",
    location: "Czech Republic",
    image: cityImage,
    rating: 4.8,
    reviews: 1923,
    price: 649,
    description: "Medieval architecture and charming streets"
  },
  {
    id: 3,
    name: "Tropical Paradise",
    location: "Maldives",
    image: islandImage,
    rating: 5.0,
    reviews: 3521,
    price: 1299,
    description: "Crystal clear waters and luxury resorts"
  },
  {
    id: 4,
    name: "Sahara Desert",
    location: "Morocco",
    image: desertImage,
    rating: 4.7,
    reviews: 1456,
    price: 799,
    description: "Golden dunes and unforgettable sunsets"
  }
];

export const Destinations = () => {
  return (
    <section id="destinations" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Popular <span className="text-gradient">Destinations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the most sought-after travel destinations handpicked by our experts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Card 
              key={destination.id} 
              className="group overflow-hidden hover-lift cursor-pointer animate-fade-in-up border-0 shadow-medium"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-medium">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="font-semibold text-sm">{destination.rating}</span>
                </div>

                {/* Location */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1 text-white/90 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{destination.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                </div>
              </div>

              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">{destination.description}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">From</span>
                    <div className="text-2xl font-bold text-primary">${destination.price}</div>
                  </div>
                  <Button variant="default" size="sm">
                    View Details
                  </Button>
                </div>

                <div className="mt-3 text-xs text-muted-foreground">
                  {destination.reviews.toLocaleString()} reviews
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            Explore All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
};
