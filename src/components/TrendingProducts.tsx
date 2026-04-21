import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const TrendingProducts = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: products } = useQuery({
    queryKey: ["trending-products"],
    queryFn: async () => { const { data, error } = await supabase.from("products").select("*").eq("is_published", true).eq("is_trending", true).order("sort_order"); if (error) throw error; return data; },
  });

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: dir === "left" ? -w * 0.7 : w * 0.7, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-background py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-16">
        <div className="mb-6 md:mb-8 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground uppercase md:text-3xl">Produits Tendances</h2>
            <p className="mt-1 text-xs text-muted-foreground md:mt-2 md:text-sm">Découvrez les dernières et meilleures nouveautés de la marque Impulse Fitness.</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => scroll("left")} aria-label="Précédent" className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background p-2 shadow-md border border-border text-foreground hover:bg-secondary transition-colors md:p-2.5">
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button onClick={() => scroll("right")} aria-label="Suivant" className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-accent p-2 shadow-md text-accent-foreground hover:bg-accent/90 transition-colors md:p-2.5">
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-4 md:gap-5" style={{ scrollbarWidth: 'none' }}>
            {products.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="min-w-[180px] max-w-[220px] flex-shrink-0 md:min-w-[260px] md:max-w-[300px]">
                <a href={`/produit/${p.id}`} className="group block">
                  <div className="aspect-square overflow-hidden rounded-sm bg-secondary/50">
                    <img src={p.image_url || ""} alt={p.name} className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 md:p-4" />
                  </div>
                  <h3 className="mt-2 text-xs font-medium text-foreground md:mt-3 md:text-sm">{p.name}</h3>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
