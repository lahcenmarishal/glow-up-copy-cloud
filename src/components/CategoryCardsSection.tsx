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
                  <div className="mt-3 flex flex-col gap-1.5 md:mt-4 md:gap-2 items-start">
                    {subCats.map((sc) => (
                      <a
                        key={sc.slug}
                        href={`/${slug}/${sc.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-block text-[10px] font-semibold text-background border-b border-background/60 pb-0.5 transition-all duration-150 hover:border-background sm:text-sm active:scale-95 active:text-accent active:border-accent active:bg-background/10 active:px-2 active:rounded-sm"
                      >
                        {sc.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2 md:mt-3">
                    <span
  className={`
    inline-block
    text-[12px]
    sm:text-sm
    font-semibold
    uppercase
    tracking-wide
    border-b
    pb-1
    transition-all
    duration-200
    ${
      isRed
        ? "text-accent border-accent/70 group-hover:border-accent"
        : "text-background border-background/70 group-hover:border-background"
    }
  `}
>
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
