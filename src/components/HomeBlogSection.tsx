import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const HomeBlogSection = () => {
  const { data: posts } = useQuery({
    queryKey: ["home-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image_url, published_at, created_at, author")
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (!posts || posts.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-16">
        <div className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">Blog</p>
            <h2 className="font-display text-xl font-bold uppercase text-foreground md:text-3xl">
              Actualités & Insights
            </h2>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">
              Plongez dans l'univers Impulse : innovation, marché et expertise.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-accent hover:underline md:text-sm"
          >
            Tous les articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {posts.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex flex-col overflow-hidden rounded-sm border border-border bg-background transition-shadow hover:shadow-lg"
            >
              <Link to={`/blog/${p.slug}`} className="block aspect-[16/10] overflow-hidden bg-secondary">
                {p.cover_image_url && (
                  <img
                    src={p.cover_image_url}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(p.published_at || p.created_at).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <Link to={`/blog/${p.slug}`}>
                  <h3 className="line-clamp-2 font-display text-base font-bold text-foreground transition-colors group-hover:text-accent md:text-lg">
                    {p.title}
                  </h3>
                </Link>
                {p.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {p.excerpt}
                  </p>
                )}
                <Link
                  to={`/blog/${p.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                >
                  Lire l'article <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
