import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const TrendingProducts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: products } = useQuery({
    queryKey: ["trending-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .eq("is_trending", true)
        .order("sort_order");

      if (error) throw error;
      return data;
    },
  });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -w * 0.7 : w * 0.7,
      behavior: "smooth",
    });
  };

  if (!products || products.length === 0) return null;

  return (
  <section className="bg-background py-10 md:py-16">
    
    {/* 🔴 wrapper global */}
    <div className="relative">

      {/* ✅ Flèche gauche EXTREME */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 md:left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-background/90 p-2 shadow-lg border border-border hover:bg-secondary"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* ✅ Flèche droite EXTREME */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 md:right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-accent p-2 shadow-lg text-accent-foreground hover:bg-accent/90"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* 🔵 TON CONTAINER NORMAL */}
      <div className="container mx-auto px-4 md:px-16">
        
        <div className="mb-6 md:mb-8">
          <h2 className="font-display text-xl font-bold uppercase md:text-3xl">
            Produits Tendances
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Découvrez les dernières et meilleures nouveautés de la marque Impulse Fitness.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4 md:gap-5"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="min-w-[180px] max-w-[220px] flex-shrink-0 md:min-w-[260px] md:max-w-[300px]"
            >
              <a href={`/produit/${p.id}`} className="group block">
                <div className="aspect-square overflow-hidden rounded-sm bg-secondary/50">
                  <img
                    src={p.image_url || ""}
                    alt={p.name}
                    className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 md:p-4"
                  />
                </div>
                <h3 className="mt-2 text-xs font-medium text-foreground md:text-sm">
                  {p.name}
                </h3>
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  </section>
);
export default TrendingProducts;
