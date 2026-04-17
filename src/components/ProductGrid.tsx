import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { FileText, Check } from "lucide-react";

const categories = ["Tous", "Cardio", "Musculation", "Fonctionnel"];

interface ProductGridProps {
  defaultCategory?: string;
  defaultSubcategory?: string;
  defaultUsageType?: string;
  title?: string;
  subtitle?: string;
}

const ProductGrid = ({ defaultCategory, defaultSubcategory, defaultUsageType, title, subtitle }: ProductGridProps) => {
  const [filter, setFilter] = useState(defaultCategory || "Tous");
  const { addItem, items } = useQuoteCart();

  useEffect(() => { setFilter(defaultCategory || "Tous"); }, [defaultCategory]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => { const { data, error } = await supabase.from("products").select("*").eq("is_published", true).order("sort_order"); if (error) throw error; return data; },
  });

  let filtered = filter === "Tous" ? (products ?? []) : (products ?? []).filter((p) => p.category === filter);
  if (defaultSubcategory) filtered = filtered.filter((p) => (p as any).subcategory === defaultSubcategory);
  if (defaultUsageType && defaultUsageType !== "both") filtered = filtered.filter((p) => { const ut = (p as any).usage_type; return ut === defaultUsageType || ut === "both"; });

  const showFilters = !defaultCategory && !defaultSubcategory;

  return (
    <section id="produits" className="bg-background py-20">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            {subtitle && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">{subtitle}</p>}
            {!subtitle && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Catalogue</p>}
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">{title || "Nos Équipements"}</h2>
          </div>
          {showFilters && (
            <div className="flex gap-1">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setFilter(cat)} className={`rounded-sm px-4 py-2 text-xs font-medium transition-colors ${filter === cat ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{cat}</button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>
        ) : filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">Aucun produit dans cette catégorie pour le moment.</p>
        ) : (
          <div className="grid grid-cols-2 gap-1 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => {
              const inCart = items.some((item) => item.id === p.id);
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }} className="group relative overflow-hidden rounded-sm bg-card product-card-shadow">
                  <a href={`/produit/${p.id}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <img src={p.image_url || ""} alt={p.name} className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-0" />
                      {p.hover_image_url && <img src={p.hover_image_url} alt={`${p.name} détail`} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transform: "scale(1.1)" }} />}
                      
                    </div>
                  </a>
                  <div className="p-2 sm:p-4">
                    <a href={`/produit/${p.id}`}>
                      <h3 className="font-display text-xs font-semibold text-foreground sm:text-base">{p.name}</h3>
                      <p className="mt-1 line-clamp-2 hidden text-xs text-muted-foreground sm:block">{p.short_description}</p>
                    </a>
                    <div className="mt-2 flex flex-col gap-1 sm:mt-3 sm:flex-row sm:items-center sm:justify-between">
                      <a href={`/produit/${p.id}`} className="text-[10px] font-semibold text-accent transition-colors hover:text-accent/80 sm:text-xs">Voir les détails →</a>
                      <button onClick={(e) => { e.preventDefault(); addItem({ id: p.id, name: p.name, category: p.category, image_url: p.image_url }); }} className={`flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-semibold transition-colors sm:px-3 sm:py-1.5 sm:text-[11px] ${inCart ? "bg-accent/10 text-accent" : "bg-accent text-accent-foreground hover:bg-accent/90"}`}>
                        {inCart ? <Check className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                        <span>{inCart ? "Ajouté" : "Ajouter au devis"}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
