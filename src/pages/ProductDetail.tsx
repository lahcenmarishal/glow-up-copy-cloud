import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, X, FileText, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteCart } from "@/contexts/QuoteCartContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "warranty">("overview");
  const imageRef = useRef<HTMLDivElement>(null);
  const { addItem, items } = useQuoteCart();

  const { data: product, isLoading } = useQuery({ queryKey: ["product", id], queryFn: async () => { const { data, error } = await supabase.from("products").select("*").eq("id", id!).eq("is_published", true).maybeSingle(); if (error) throw error; return data; }, enabled: !!id });
  const { data: galleryImages } = useQuery({ queryKey: ["product-images", id], queryFn: async () => { const { data, error } = await supabase.from("product_images").select("*").eq("product_id", id!).order("sort_order"); if (error) throw error; return data; }, enabled: !!id });
  const { data: relatedProducts } = useQuery({ queryKey: ["related-products", product?.subcategory, product?.category, id], queryFn: async () => { let query = supabase.from("products").select("*").eq("is_published", true).neq("id", id!); if (product!.subcategory) { query = query.eq("subcategory", product!.subcategory); } else { query = query.eq("category", product!.category); } const { data, error } = await query.order("sort_order").limit(4); if (error) throw error; return data; }, enabled: !!(product?.category || product?.subcategory) && !!id });

  const allImages = product ? [...(product.image_url ? [{ url: product.image_url, alt: product.name }] : []), ...(product.hover_image_url ? [{ url: product.hover_image_url, alt: `${product.name} - vue alternative` }] : []), ...(galleryImages?.map((img) => ({ url: img.image_url, alt: img.alt_text || product.name })) || [])] : [];
  const specs = (product?.specs as { label: string; value: string }[] | null) || [];
  const features = (product?.features as string[] | null) || [];
  const warrantyItems: { component: string; duration: string }[] = (() => { const w = (product as any)?.warranty; if (!w) return []; try { const parsed = JSON.parse(w); if (Array.isArray(parsed)) return parsed; } catch {} return w.split("\n").filter((l: string) => l.trim()).map((line: string) => { const parts = line.split(":"); return { component: parts[0]?.trim() || "Garantie", duration: parts.slice(1).join(":").trim() || line.trim() }; }); })();

  const nextImage = useCallback(() => setActiveImage((p) => (p + 1) % allImages.length), [allImages.length]);
  const prevImage = useCallback(() => setActiveImage((p) => (p - 1 + allImages.length) % allImages.length), [allImages.length]);
  const handleMouseMove = useCallback((_e: React.MouseEvent) => {}, []);
  const handleMouseLeave = useCallback(() => {}, []);

  useEffect(() => { if (!lightboxOpen) return; const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); if (e.key === "ArrowRight") nextImage(); if (e.key === "ArrowLeft") prevImage(); }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, [lightboxOpen, nextImage, prevImage]);

  const inCart = product ? items.some((i) => i.id === product.id) : false;

  if (isLoading) return <div className="min-h-screen bg-background"><Navbar /><div className="flex h-[80vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div></div>;
  if (!product) return <div className="min-h-screen bg-background"><Navbar /><div className="flex h-[80vh] flex-col items-center justify-center gap-4"><p className="text-muted-foreground">Produit non trouvé</p><a href="/" className="text-accent hover:text-accent/80">← Retour</a></div></div>;

  const tabs = [{ id: "overview" as const, label: "Description" }, { id: "specs" as const, label: "Caractéristiques" }, { id: "warranty" as const, label: "Garantie" }];

  return (
    <div className="min-h-screen bg-background"><Navbar /><div className="pt-16 md:pt-20">
    <div className="container mx-auto px-4 py-4 md:px-16 md:py-6"><button onClick={() => window.history.back()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Retour</button></div>
    <section className="container mx-auto px-4 md:px-16"><div className="grid gap-6 md:gap-8 lg:grid-cols-2">
    <div>
      <div ref={imageRef} className="relative aspect-square overflow-hidden rounded-sm bg-card" onClick={() => { setLightboxOpen(true); }}>
        <AnimatePresence mode="wait">{allImages.length > 0 && <motion.img key={activeImage} src={allImages[activeImage].url} alt={allImages[activeImage].alt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="h-full w-full object-cover" />}</AnimatePresence>
        {allImages.length > 1 && (<><button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 backdrop-blur-sm hover:bg-background"><ChevronLeft className="h-4 w-4 text-foreground" /></button><button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 backdrop-blur-sm hover:bg-background"><ChevronRight className="h-4 w-4 text-foreground" /></button></>)}
      </div>
      {allImages.length > 1 && <div className="mt-2 flex gap-1.5 overflow-x-auto">{allImages.map((img, i) => (<button key={i} onClick={() => setActiveImage(i)} className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-sm border-2 transition-colors ${i === activeImage ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"}`}><img src={img.url} alt="" className="h-full w-full object-cover" /></button>))}</div>}
    </div>
    <div className="flex flex-col justify-center">
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-accent md:mb-2 md:text-xs">{product.category}</p>
      <h1 className="font-display text-2xl font-bold text-foreground md:text-4xl">{product.name}</h1>
      {product.short_description && <p className="mt-3 text-xs leading-relaxed text-muted-foreground md:mt-4 md:text-sm">{product.short_description}</p>}
      <div className="mt-4 flex flex-wrap gap-2 md:mt-6 md:gap-3">
        <button onClick={() => addItem({ id: product.id, name: product.name, category: product.category, image_url: product.image_url })} className={`inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-xs font-semibold transition-colors md:px-6 md:py-3 md:text-sm ${inCart ? "bg-accent/10 text-accent border border-accent/30" : "bg-accent text-accent-foreground hover:bg-accent/90"}`}>
          {inCart ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}{inCart ? "Ajouté au devis" : "Ajouter au devis"}
        </button>
        <a href="/contact" className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary md:px-6 md:py-3 md:text-sm">Nous contacter</a>
      </div>
      <div className="mt-6 border-t border-border pt-4">
        <div className="flex gap-4 border-b border-border">{tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} className={`pb-2 text-xs font-semibold transition-colors ${activeTab === t.id ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground"}`}>{t.label}</button>)}</div>
        <div className="mt-4">{activeTab === "overview" && <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-line">{product.description || "Pas de description disponible."}{features.length > 0 && <ul className="mt-4 space-y-1">{features.map((f, i) => <li key={i} className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />{f}</li>)}</ul>}</div>}
        {activeTab === "specs" && (specs.length > 0 ? <div className="space-y-2">{specs.map((s, i) => <div key={i} className="flex justify-between border-b border-border py-2 text-sm"><span className="text-muted-foreground">{s.label}</span><span className="font-medium text-foreground">{s.value}</span></div>)}</div> : <p className="text-sm text-muted-foreground">Aucune caractéristique disponible.</p>)}
        {activeTab === "warranty" && (warrantyItems.length > 0 ? <div className="space-y-2">{warrantyItems.map((w, i) => <div key={i} className="flex justify-between border-b border-border py-2 text-sm"><span className="text-muted-foreground">{w.component}</span><span className="font-medium text-foreground">{w.duration}</span></div>)}</div> : <p className="text-sm text-muted-foreground">Informations de garantie non disponibles.</p>)}</div>
      </div>
    </div>
    </div></section>

    {relatedProducts && relatedProducts.length > 0 && (
      <section className="container mx-auto px-4 py-16 md:px-16"><h2 className="mb-6 font-display text-xl font-bold text-foreground">Produits similaires</h2>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">{relatedProducts.map(p => (<a key={p.id} href={`/produit/${p.id}`} className="group overflow-hidden rounded-sm border border-border bg-card"><div className="aspect-square overflow-hidden"><img src={p.image_url || ""} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-2 md:p-3"><p className="text-[9px] font-semibold uppercase text-accent">{p.category}</p><h3 className="mt-0.5 text-xs font-semibold text-foreground line-clamp-2 md:text-sm">{p.name}</h3></div></a>))}</div></section>
    )}

    {lightboxOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-sm" onClick={() => setLightboxOpen(false)}><button className="absolute right-4 top-4 text-background"><X className="h-6 w-6" /></button>{allImages.length > 0 && <img src={allImages[activeImage].url} alt="" className="max-h-[90vh] max-w-[90vw] object-contain" onClick={e => e.stopPropagation()} />}{allImages.length > 1 && <><button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 p-2"><ChevronLeft className="h-6 w-6 text-background" /></button><button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 p-2"><ChevronRight className="h-6 w-6 text-background" /></button></>}</div>}
    </div><Footer /></div>
  );
};

export default ProductDetailPage;
