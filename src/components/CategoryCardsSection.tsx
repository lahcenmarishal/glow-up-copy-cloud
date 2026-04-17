import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const fallbackImages: Record<string, string> = {
  Professionnel: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  Résidentiel: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  Consulting: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  Réalisations: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&q=80",
};

const CategoryCardsSection = () => {
  const { data: cards } = useQuery({
    queryKey: ["category-cards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("category_cards").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  if (!cards || cards.length === 0) return null;

  const subCats = [
    { label: "CARDIO", slug: "cardio" },
    { label: "MUSCULATION", slug: "musculation" },
    { label: "FONCTIONNEL", slug: "fonctionnel" },
  ];

  const isUsageCard = (title: string) => {
    const t = title.toLowerCase();
    return t.includes("professionnel") || t.includes("résidentiel") || t.includes("residentiel");
  };

  const usageSlug = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("professionnel")) return "professionnel";
    return "residentiel";
  };

  return (
    <section className="bg-foreground border-t-[3px] border-background">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[3px] bg-background">
        {cards.map((card, i) => {
          const isRed = (card as any).cta_color === "red";
          const showSubButtons = isUsageCard(card.title);
          const slug = usageSlug(card.title);

          const inner = (
            <>
              <img src={card.image_url || fallbackImages[card.title] || fallbackImages.Professionnel} alt={card.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-foreground/40 transition-colors group-hover:bg-foreground/50" />
              <div className="absolute inset-0 flex flex-col justify-start pt-6 px-4 sm:px-6 md:px-12 md:pt-8">
                <h3 className="font-display text-base font-bold text-background sm:text-xl md:text-3xl lg:text-4xl">{card.title}</h3>
                {card.description && <p className="mt-1 text-[11px] font-semibold normal-case tracking-widest text-background/60 sm:text-sm md:text-base">{card.description}</p>}
                {showSubButtons ? (
                  <div className="mt-4 flex flex-col gap-2.5 md:mt-6 md:gap-3 items-start w-fit">
                    {subCats.map((sc) => (
                      <a
                        key={sc.slug}
                        href={`/${slug}/${sc.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block w-48 md:w-60 text-center rounded-sm bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
                      >
                        {sc.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 md:mt-6">
                    <span className="inline-block w-48 md:w-60 text-center rounded-sm bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-colors group-hover:bg-accent/90">
                      {card.cta_text}
                    </span>
                  </div>
                )}
              </div>
            </>
          );

          return (
            <motion.div key={card.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
              {showSubButtons ? (
                <div className="group relative block h-52 sm:h-52 md:h-80 lg:h-96 overflow-hidden">{inner}</div>
              ) : (
                <a href={card.cta_link} className="group relative block h-52 sm:h-52 md:h-80 lg:h-96 overflow-hidden">{inner}</a>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryCardsSection;
