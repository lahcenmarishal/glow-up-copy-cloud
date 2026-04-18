import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface Props {
  usageType: "professionnel" | "residentiel";
}

const CategoryPage = ({ usageType }: Props) => {
  const { category } = useParams();

  const { data: cat, isLoading: catLoading } = useQuery({
    queryKey: ["equipment-category", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment_categories")
        .select("*")
        .eq("slug", category!)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  const { data: subcategories } = useQuery({
    queryKey: ["equipment-subcategories", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment_subcategories")
        .select("*")
        .eq("category_slug", category!)
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data || [];
    },
    enabled: !!category,
  });

  const usageLabel =
    usageType === "professionnel" ? "Professionnel" : "Résidentiel";

  if (catLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-[45px]">
        {/* Hero section */}
        <div
          className="relative w-full overflow-hidden"
          style={{ minHeight: "500px" }}
        >
          {cat?.image_url && (
            <img
              src={cat.image_url}
              alt={cat?.title || ""}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

          <div className="relative z-10 flex h-full min-h-[500px] flex-col justify-center px-8 py-20 md:px-16 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <h1 className="mb-6 font-display text-4xl font-bold uppercase leading-tight text-white md:text-5xl lg:text-6xl">
                {cat?.title || category} {usageLabel}
              </h1>

              <p className="mb-8 text-base leading-relaxed text-white/80 md:text-lg">
                {cat?.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Subcategory cards — 4 landscape cards per row */}
        {subcategories && subcategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] bg-background">
            {subcategories.map((sub: any, i: number) => (
              <motion.a
                key={sub.id}
                href={`/${usageType}/${category}/${sub.slug}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden border-[1.5px] border-background"
                style={{ aspectRatio: "16 / 9" }}
              >
                <img
                  src={sub.image_url || "/placeholder.svg"}
                  alt={sub.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
                  <h3 className="font-display text-lg font-bold text-white md:text-xl lg:text-2xl">
                    {sub.title}
                  </h3>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors group-hover:bg-white group-hover:text-black">
                    +
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
