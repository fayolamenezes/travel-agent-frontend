import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Destinations } from "@/components/Destinations";
import { FeaturedDeals } from "@/components/FeaturedDeals";
import { Categories } from "@/components/Categories";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Destinations />
      <FeaturedDeals />
      <Categories />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
