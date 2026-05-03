import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCardsSection from "@/components/CategoryCardsSection";
import TrendingProducts from "@/components/TrendingProducts";
import HomeBlogSection from "@/components/HomeBlogSection";
import AboutImpulseSection from "@/components/AboutImpulseSection";
import WorldPresenceSection from "@/components/WorldPresenceSection";
import ContactSection from "@/components/ContactSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <HeroCarousel />
      <CategoryCardsSection />
      <TrendingProducts />
      <HomeBlogSection />
      <AboutImpulseSection />
      <WorldPresenceSection />
      <ContactSection />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default Index;
