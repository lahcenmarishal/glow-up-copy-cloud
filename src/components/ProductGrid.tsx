import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { FileText, Check, SlidersHorizontal, X, ArrowLeft } from "lucide-react";

const categories = ["Tous", "Cardio", "Musculation", "Fonctionnel"];

interface ProductGridProps {
  defaultCategory?: string;
  defaultSubcategory?: string;
  defaultSubcategorySlug?: string;
  defaultUsageType?: string;
  title?: string;
  subtitle?: string;
}

const ProductGrid = ({ defaultCategory, defaultSubcategory, defaultSubcategorySlug, defaultUsageType, title, subtitle }: ProductGridProps) => {
  const [filter, setFilter] = useState(defaultCategory || "Tous");
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { addItem, items } = useQuoteCart();

  useEffect(() => { setFilter(defaultCategory || "Tous"); }, [defaultCategory]);
  useEffect(() => { setSelectedRanges([]); }, [defaultSubcategorySlug, defaultUsageType]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => { const { data, error } = await supabase.from("products").select("*").eq("is_published", true).order("sort_order"); if (error) throw error; return data; },
  });

  // Fetch ranges for current usage/category/subcategory
  const { data: ranges } = useQuery({
    queryKey: ["ranges", defaultUsageType, defaultCategory, defaultSubcategorySlug],
    queryFn: async () => {
      if (!defaultUsageType || !defaultCategory || !defaultSubcategorySlug) return [];
      const cat = defaultCategory.toLowerCase();
      let q = supabase.from("product_ranges").select("*").eq("is_active", true).eq("category", cat).eq("subcategory", defaultSubcategorySlug);
      if (defaultUsageType !== "both") q = q.eq("usage_type", defaultUsageType);
      const { data, error } = await q.order("sort_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!(defaultUsageType && defaultCategory && defaultSubcategorySlug),
  });

  const filtered = useMemo(() => {
    let list = filter === "Tous" ? (products ?? []) : (products ?? []).filter((p) => p.category === filter);
    if (defaultSubcategory) list = list.filter((p) => (p as any).subcategory === defaultSubcategory);
    if (defaultUsageType && defaultUsageType !== "both") list = list.filter((p) => { const ut = (p as any).usage_type; return ut === defaultUsageType || ut === "both"; });
    if (selectedRanges.length > 0) list = list.filter((p) => (p as any).range_code && selectedRanges.includes((p as any).range_code));
    return list;
  }, [products, filter, defaultSubcategory, defaultUsageType, selectedRanges]);

  // Count products per range for display
  const rangeCounts = useMemo(() => {
    const baseList = (products ?? [])
      .filter((p) => !defaultSubcategory || (p as any).subcategory === defaultSubcategory)
      .filter((p) => !defaultUsageType || defaultUsageType === "both" || (p as any).usage_type === defaultUsageType || (p as any).usage_type === "both");
    const counts: Record<string, number> = {};
    baseList.forEach((p) => { const c = (p as any).range_code; if (c) counts[c] = (counts[c] || 0) + 1; });
    return counts;
  }, [products, defaultSubcategory, defaultUsageType]);

  const showCategoryFilter = !defaultCategory && !defaultSubcategory;
  const showRangesSidebar = !!(ranges && ranges.length > 0);

  const toggleRange = (code: string) => {
    setSelectedRanges((prev) => prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]);
  };

  const RangesPanel = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Gammes</h3>
        {selectedRanges.length > 0 && (
          <button onClick={() => setSelectedRanges([])} className="text-xs text-accent hover:underline">Réinitialiser</button>
        )}
      </div>
      <div className="space-y-2">
        {ranges!.map((r: any) => {
          const checked = selectedRanges.includes(r.code);
          const count = rangeCounts[r.code] || 0;
          return (
            <label key={r.id} className="flex cursor-pointer items-center justify-between gap-2 rounded-sm border border-border bg-card px-3 py-2 transition-colors hover:border-accent">
              <div className="flex items-center gap-2 min-w-0">
                <input type="checkbox" checked={checked} onChange={() => toggleRange(r.code)} className="h-4 w-4 rounded border-border text-accent focus:ring-accent" />
                <span className="text-sm font-medium text-foreground">{r.code}</span>
                {r.label && <span className="truncate text-xs text-muted-foreground">{r.label}</span>}
              </div>
              <span className="text-xs text-muted-foreground">({count})</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  // Build "back" link: when viewing a subcategory, point back to the parent category page
  const categorySlug = defaultCategory ? defaultCategory.toLowerCase() : undefined;
  const backHref = defaultUsageType && categorySlug ? `/${defaultUsageType}/${categorySlug}` : undefined;

  return (
    <section id="produits" className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-16">
        {backHref && defaultSubcategory && (
          <div className="mb-4">
            <a href={backHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Retour
            </a>
          </div>
        )}
        <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            {subtitle && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">{subtitle}</p>}
            {!subtitle && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Catalogue</p>}
            <h2 className="font-display text-2xl font-bold text-foreground md:text-4xl">{title || "Nos Équipements"}</h2>
          </div>
          <div className="flex items-center gap-2">
            {showRangesSidebar && (
              <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-2 text-xs font-medium text-foreground">
                <SlidersHorizontal className="h-4 w-4" /> Filtres
                {selectedRanges.length > 0 && <span className="rounded-full bg-accent px-1.5 text-[10px] text-accent-foreground">{selectedRanges.length}</span>}
              </button>
            )}
            {showCategoryFilter && (
              <div className="flex gap-1">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setFilter(cat)} className={`rounded-sm px-4 py-2 text-xs font-medium transition-colors ${filter === cat ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{cat}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={showRangesSidebar ? "grid gap-6 lg:grid-cols-[220px_1fr]" : ""}>
          {showRangesSidebar && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <RangesPanel />
              </div>
            </aside>
          )}

          <div className="min-w-0">
            {isLoading ? (
              <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>
            ) : filtered.length === 0 ? (
              <p className="py-20 text-center text-muted-foreground">Aucun produit ne correspond aux filtres sélectionnés.</p>
            ) : (
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p, i) => {
                  const inCart = items.some((item) => item.id === p.id);
                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.4), ease: [0.22, 1, 0.36, 1] }} className="group relative overflow-hidden rounded-sm bg-card product-card-shadow">
                      <a href={`/produit/${p.id}`}>
                        <div className="relative aspect-square overflow-hidden">
                          <img src={p.image_url || ""} alt={p.name} className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-0" />
                          {p.hover_image_url && <img src={p.hover_image_url} alt={`${p.name} détail`} className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100" style={{ transform: "scale(1.1)" }} />}
                          {(p as any).range_code && <span className="absolute left-2 top-2 rounded-sm bg-accent/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">{(p as any).range_code}</span>}
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
                            <span>{inCart ? "Ajouté" : "Ajouter"}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {showRangesSidebar && mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 top-0 h-full w-72 bg-background p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-bold uppercase text-foreground">Filtres</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X className="h-5 w-5 text-foreground" /></button>
            </div>
            <RangesPanel />
            <button onClick={() => setMobileFiltersOpen(false)} className="mt-6 w-full rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground">Voir les résultats ({filtered.length})</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
