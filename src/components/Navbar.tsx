import { useState, useRef, useEffect } from "react";
import { Menu, X, FileText, ChevronDown, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import logo from "@/assets/logo-new.png";

interface MegaMenuProps { label: string; children: React.ReactNode; }

const MegaMenu = ({ label, children }: MegaMenuProps) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enter = () => { clearTimeout(timeout.current); setOpen(true); };
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 150); };
  return (
    <div onMouseEnter={enter} onMouseLeave={leave} className="relative">
      <button className="flex items-center gap-1 text-xs font-semibold text-background/70 transition-colors hover:text-background uppercase tracking-wide">
        {label} <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 pt-2">
          <div className="rounded-lg border border-background/10 bg-[#1a1a1a] p-6 shadow-xl min-w-max">{children}</div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { itemCount, setIsOpen } = useQuoteCart();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const toggleMobile = (key: string) => setMobileExpanded(mobileExpanded === key ? null : key);

  const { data: suggestions } = useQuery({
    queryKey: ["search-suggestions", searchQuery],
    queryFn: async () => {
      const q = searchQuery.trim();
      const { data, error } = await supabase.from("products").select("id, name, image_url, category").eq("is_published", true).or(`name.ilike.%${q}%,category.ilike.%${q}%,subcategory.ilike.%${q}%`).order("sort_order").limit(6);
      if (error) throw error;
      return data;
    },
    enabled: searchQuery.trim().length >= 2,
  });

  const showSuggestions = searchOpen && searchQuery.trim().length >= 2 && suggestions && suggestions.length > 0;

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) setSearchOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/recherche?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false); setSearchQuery(""); setOpen(false);
    }
  };

  const handleSelectSuggestion = (id: string) => {
    window.location.href = `/produit/${id}`;
    setSearchOpen(false); setSearchQuery(""); setOpen(false);
  };

  const categories = [
    { label: "Cardio", slug: "cardio" },
    { label: "Musculation", slug: "musculation" },
    { label: "Fonctionnel", slug: "fonctionnel" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full bg-foreground border-b-[3px] border-background">
      <div className="w-full grid grid-cols-[auto_1fr_auto] items-center px-4 py-2 md:px-8 lg:px-16 lg:grid-cols-[auto_1fr_auto]">
        <Link to="/" className="flex-shrink-0 justify-self-start">
          <img src={logo} alt="IMPULSE FITNESS" className="h-7 w-auto md:h-8" />
        </Link>

        <div className="hidden items-center justify-center gap-5 lg:flex xl:gap-7">
          <MegaMenu label="Professionnel">
            <div className="flex flex-col gap-3 min-w-[160px]">
              {categories.map((c) => (
                <a key={c.slug} href={`/professionnel/${c.slug}`} className="text-sm text-background/70 transition-colors hover:text-background font-medium">
                  {c.label}
                </a>
              ))}
            </div>
          </MegaMenu>
          <MegaMenu label="Résidentiel">
            <div className="flex flex-col gap-3 min-w-[160px]">
              {categories.map((c) => (
                <a key={c.slug} href={`/residentiel/${c.slug}`} className="text-sm text-background/70 transition-colors hover:text-background font-medium">
                  {c.label}
                </a>
              ))}
            </div>
          </MegaMenu>
          <a href="/consulting" className="text-xs font-semibold text-background/70 uppercase tracking-wide transition-colors hover:text-background">Consulting</a>
          <a href="/realisations" className="text-xs font-semibold text-background/70 uppercase tracking-wide transition-colors hover:text-background">Réalisations</a>
          <a href="/blog" className="text-xs font-semibold text-background/70 uppercase tracking-wide transition-colors hover:text-background">Blog</a>
          <a href="/contact" className="text-xs font-semibold text-background/70 uppercase tracking-wide transition-colors hover:text-background">Contact</a>
        </div>

        <div className="hidden items-center gap-3 justify-self-end lg:flex">
          <div ref={searchContainerRef} className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." autoFocus className="w-56 rounded-sm border border-background/20 bg-background/10 px-3 py-1.5 text-sm text-background placeholder:text-background/50 focus:outline-none focus:ring-1 focus:ring-accent" />
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-background/70 transition-colors hover:text-background"><Search className="h-4 w-4" /></button>
            )}
            {showSuggestions && (
              <div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-md border border-background/10 bg-[#1a1a1a] shadow-xl overflow-hidden">
                {suggestions.map((p) => (
                  <button key={p.id} onMouseDown={() => handleSelectSuggestion(p.id)} className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-background/10">
                    {p.image_url && <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded object-cover flex-shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm text-background truncate">{p.name}</p>
                      <p className="text-[10px] text-background/50 uppercase">{p.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setIsOpen(true)} className="btn-slide btn-slide-accent relative h-9 px-4 text-xs rounded-sm">
            <FileText className="h-4 w-4" /> Voir le devis
            {itemCount > 0 && <span className="absolute -right-1.5 -top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">{itemCount}</span>}
          </button>
        </div>

        <div className="flex items-center gap-2 justify-self-end lg:hidden">
          <button onClick={() => setIsOpen(true)} className="btn-slide btn-slide-accent relative h-9 px-3 text-xs rounded-sm">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Devis</span>
            {itemCount > 0 && <span className="absolute -right-1.5 -top-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">{itemCount}</span>}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 text-background">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-background/10 bg-foreground px-4 py-4 lg:hidden">
          <div className="space-y-1">
            <button onClick={() => toggleMobile("prof")} className="flex w-full items-center justify-between py-2 text-sm font-semibold text-background/80 uppercase">Professionnel <ChevronDown className={`h-3 w-3 transition-transform ${mobileExpanded === "prof" ? "rotate-180" : ""}`} /></button>
            {mobileExpanded === "prof" && (
              <div className="space-y-1 pl-4 pb-2">
                {categories.map(c => <a key={c.slug} href={`/professionnel/${c.slug}`} onClick={() => setOpen(false)} className="block py-1.5 text-sm text-background/60 hover:text-background">{c.label}</a>)}
              </div>
            )}
            <button onClick={() => toggleMobile("res")} className="flex w-full items-center justify-between py-2 text-sm font-semibold text-background/80 uppercase">Résidentiel <ChevronDown className={`h-3 w-3 transition-transform ${mobileExpanded === "res" ? "rotate-180" : ""}`} /></button>
            {mobileExpanded === "res" && (
              <div className="space-y-1 pl-4 pb-2">
                {categories.map(c => <a key={c.slug} href={`/residentiel/${c.slug}`} onClick={() => setOpen(false)} className="block py-1.5 text-sm text-background/60 hover:text-background">{c.label}</a>)}
              </div>
            )}
            <a href="/consulting" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-background/80 uppercase">Consulting</a>
            <a href="/realisations" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-background/80 uppercase">Réalisations</a>
            <a href="/blog" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-background/80 uppercase">Blog</a>
            <a href="/contact" onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-background/80 uppercase">Contact</a>
          </div>
          <div className="mt-4">
            <form onSubmit={handleSearch} className="flex-1">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full rounded-sm border border-background/20 bg-background/10 px-3 py-2 text-sm text-background placeholder:text-background/50 focus:outline-none" />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
