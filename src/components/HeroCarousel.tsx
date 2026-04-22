import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import heroCardio from "@/assets/hero-cardio.jpg";
import heroStrength from "@/assets/hero-strength.jpg";
import heroTech from "@/assets/hero-tech.jpg";

const fallbackSlides = [
  { image: heroCardio, tag: "CARDIO", title: "PERFORMANCE\nSANS LIMITES", subtitle: "Tapis de course, vélos elliptiques et rameurs de qualité professionnelle.", cta: "Explorer le Cardio", link: "/cardio" },
  { image: heroStrength, tag: "MUSCULATION", title: "L'EXCELLENCE\nMÉCANIQUE", subtitle: "Acier 3mm. Charge max 250kg. Garantie à vie.", cta: "Voir la Gamme Force", link: "/musculation" },
  { image: heroTech, tag: "TECHNOLOGIE", title: "PRÉCISION\nINGÉNIÉRIE", subtitle: "Câbles, poulies et systèmes de résistance de nouvelle génération.", cta: "Découvrir", link: "/accessoires" },
];

const fallbackImages = [heroCardio, heroStrength, heroTech];
const SLIDE_DURATION = 6000;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const HeroCarousel = () => {
  const isMobile = useIsMobile();
  const [isTablet, setIsTablet] = useState(false);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [navHeight, setNavHeight] = useState(0);

  useEffect(() => {
    const check = () => { const w = window.innerWidth; setIsTablet(w >= MOBILE_BREAKPOINT && w < TABLET_BREAKPOINT); };
    check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const measure = () => {
      const nav = document.getElementById("site-navbar");
      if (nav) setNavHeight(nav.getBoundingClientRect().height);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    const nav = document.getElementById("site-navbar");
    if (ro && nav) ro.observe(nav);
    const t = setTimeout(measure, 300);
    return () => { window.removeEventListener("resize", measure); ro?.disconnect(); clearTimeout(t); };
  }, []);

  const { data: carouselMode } = useQuery({
    queryKey: ["carousel-mode"],
    queryFn: async () => { const { data } = await supabase.from("contact_settings").select("value").eq("key", "carousel_mode").maybeSingle(); return data?.value || "full"; },
  });

  const isSimple = carouselMode === "simple";

  const { data: dbSlides, isLoading: isSlidesLoading, isError: isSlidesError } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => { const { data, error } = await supabase.from("hero_slides").select("*").eq("is_active", true).order("sort_order"); if (error) throw error; return data; },
  });

  const slides = useMemo(() => {
    if (dbSlides && dbSlides.length > 0) return dbSlides.map((s, i) => ({ image: s.image_url || fallbackImages[i % fallbackImages.length], tag: s.tag, title: s.title, subtitle: s.subtitle, cta: s.cta_text, link: s.cta_link || "#" }));
    if (!isSlidesLoading || isSlidesError) return fallbackSlides;
    return [];
  }, [dbSlides, isSlidesLoading, isSlidesError]);

  useEffect(() => {
    if (slides.length === 0) return;
    let startTime: number | null = null;
    let rafId: number;
    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) { setCurrent((c) => (c + 1) % slides.length); startTime = timestamp; setProgress(0); }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [slides.length, current]);

  useEffect(() => { if (slides.length > 0 && current >= slides.length) { setCurrent(0); setProgress(0); } }, [current, slides.length]);

  const goTo = (i: number) => { setCurrent(i); setProgress(0); };
  const isResponsive = isMobile || isTablet;
  const sectionClasses = isResponsive ? "relative w-full max-w-full overflow-hidden bg-background" : "relative w-full max-w-full overflow-hidden bg-foreground";
  const sectionStyle = { marginTop: navHeight ? `${navHeight}px` : undefined };

  if (slides.length === 0) return <section className={sectionClasses} style={sectionStyle}><div className="aspect-[1920/750] animate-pulse bg-foreground/10" /></section>;

  return (
    <section className={sectionClasses} style={sectionStyle}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1920 / 750" }}>
        {slides.map((slide, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-800 ease-in-out" style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
            <img src={slide.image} alt={slide.tag || ""} className="h-full w-full object-cover object-center will-change-transform" style={{ transform: i === current ? "scale(1.04)" : "scale(1)", transition: "transform 6s ease-out, opacity 0.8s ease" }} />
          </div>
        ))}
      </div>

      {!isSimple && (
        <>
          <div className="hero-overlay absolute inset-0 z-10" />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-6 md:px-16">
              <AnimatePresence mode="wait">
                <motion.div key={current} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} className="max-w-2xl">
                  <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mb-4 inline-block rounded-sm border border-background/30 bg-background/10 px-3 py-1 text-xs font-medium tracking-widest text-background">
                    {slides[current].tag}
                  </motion.span>
                  <h1 className="mb-4 font-display text-3xl font-bold leading-none tracking-tighter text-background sm:text-5xl md:text-7xl lg:text-8xl whitespace-pre-line md:mb-6">{slides[current].title}</h1>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mb-6 max-w-lg text-sm text-background/70 sm:text-base md:mb-8 md:text-lg">{slides[current].subtitle}</motion.p>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                    <a href={slides[current].link} className="group flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:bg-accent/90 w-fit">
                      {slides[current].cta}
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-6 z-30 flex gap-2 md:bottom-8 md:left-16">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="group relative h-1 w-12 overflow-hidden rounded-full bg-background/20 md:w-24">
              <div className="progress-bar-fill absolute left-0 top-0 h-full rounded-full" style={{ width: i === current ? `${progress}%` : i < current ? "100%" : "0%", transitionDuration: i === current ? "50ms" : "300ms" }} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
