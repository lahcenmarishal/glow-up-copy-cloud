import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  Shield,
  Lightbulb,
  Palette,
  Package,
  Wrench,
  HeartPulse,
  Star,
  Users,
  PackagePlus,
  Component
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, any> = {
  Shield,
  Lightbulb,
  Component,
  Palette,
  Package,
  Wrench,
  HeartPulse,
  Star,
  Users,
  PackagePlus
};

const AboutImpulseSection = () => {
  const { data: sections, isLoading } = useQuery({
    queryKey: ["about-sections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("about_sections").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) return <section className="border-t border-border bg-card py-20"><div className="container mx-auto px-6 text-muted-foreground">Chargement...</div></section>;

  const getSection = (key: string) => (sections || []).find((s: any) => s.key === key);
  const parseJson = (content: string) => { try { return JSON.parse(content); } catch { return []; } };

  const intro = getSection("intro");
  const international = getSection("international");
  const chiffresCles = getSection("chiffres_cles");
  const pillars = getSection("pillars");
  const whyChoose = getSection("why_choose");
  const whyMaroc = getSection("why_maroc");
  const whyMarocCards = getSection("why_maroc_cards");
  const video = getSection("video");

  const pillarItems = pillars ? parseJson(pillars.content) : [];
  const whyChooseItems = whyChoose ? parseJson(whyChoose.content) : [];
  const whyMarocItems = whyMarocCards ? parseJson(whyMarocCards.content) : [];

  return (
    <section id="about" className="border-t border-border bg-card py-20">
      <div className="container mx-auto px-6 md:px-16">
      {intro && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="mb-8">
              <p className="mb-2 text-xl font-semibold uppercase tracking-widest text-accent md:text-2xl">À propos de la marque Impulse</p>
            </div>
            {intro.title && <h2 className="mb-6 font-display text-3xl font-bold text-foreground md:text-4xl">{intro.title}</h2>}
            <p className="mb-4 max-w-4xl text-base leading-relaxed text-muted-foreground whitespace-pre-line">{intro.content}</p>
          </motion.div>
        )}

        {international && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-12 mt-8">
            <h3 className="mb-3 font-display text-2xl font-bold text-foreground">{international.title}</h3>
            <p className="max-w-4xl text-base leading-relaxed text-muted-foreground">{international.content}</p>
          </motion.div>
        )}

        {chiffresCles && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }} className="mb-16 mt-4">
            <h3 className="mb-8 font-display text-2xl font-bold text-foreground">{chiffresCles.title}</h3>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
              {chiffresCles.content.split("\n").map((line: string, i: number) => {
                const parts = line.split("|").map((p) => p.trim());
                if (parts.length < 3) return null;
                const [prefix, numberStr, suffix] = parts;
                const target = parseInt(numberStr, 10);
                if (isNaN(target)) return null;
                return (
                  <AnimatedCounter key={i} prefix={prefix} target={target} suffix={suffix} delay={i * 0.4} />
                );
              })}
            </div>
          </motion.div>
        )}

        {pillars && pillarItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-16">
            <h3 className="mb-8 font-display text-2xl font-bold text-foreground">{pillars.title}</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {pillarItems.map((p: any, i: number) => {
                const Icon = iconMap[p.icon] || Shield;
                return (
                  <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="rounded-sm border border-border bg-background p-6">
                    <Icon className="mb-4 h-8 w-8 text-accent" />
                    <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{p.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {whyChoose && whyChooseItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
            <h3 className="mb-8 font-display text-2xl font-bold text-foreground">{whyChoose.title}</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {whyChooseItems.map((item: any, i: number) => {
                const Icon = iconMap[item.icon] || Shield;
                return (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="rounded-sm border border-border bg-background p-6">
                    <Icon className="mb-4 h-8 w-8 text-accent" />
                    <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {whyMaroc && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
            <h3 className="mb-8 font-display text-2xl font-bold text-foreground">{whyMaroc.title}</h3>
            <p className="mb-6 max-w-4xl text-base leading-relaxed text-muted-foreground">{whyMaroc.content}</p>
            {whyMarocItems.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {whyMarocItems.map((item: any, i: number) => {
                  const Icon = iconMap[item.icon] || Shield;
                  return (
                    <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="rounded-sm border border-border bg-background p-6">
                      <Icon className="mb-4 h-8 w-8 text-accent" />
                      <h4 className="mb-2 font-display text-lg font-semibold text-foreground">{item.title}</h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {video && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h3 className="mb-6 font-display text-2xl font-bold text-foreground">{video.title}</h3>
            <div className="relative w-full overflow-hidden rounded-sm border border-border" style={{ paddingBottom: "56.25%" }}>
              <iframe className="absolute inset-0 h-full w-full" src={video.content} title="Impulse Fitness - Vidéo de présentation" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AboutImpulseSection;
