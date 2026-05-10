import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import blogHero from "@/assets/blog-hero.jpg";

const BlogPage = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <div className="relative overflow-hidden py-20 md:py-28">
          <img src={blogHero} alt="" className="absolute inset-0 h-full w-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0 bg-foreground/75" />
          <div className="container relative z-10 mx-auto px-6 text-center">
            <h1 className="font-display text-4xl font-bold text-background md:text-5xl">Conseils & inspirations fitness</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-background/80">Découvrez nos guides, conseils d'experts et actualités sur l'équipement professionnel et résidentiel.</p>
          </div>
        </div>

        <section className="container mx-auto px-6 py-16 md:px-16">
          {isLoading ? (
            <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>
          ) : !posts || posts.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">Aucun article pour le moment.</p>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
              {posts.map((p: any, i: number) => (
                <motion.article key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                  <Link to={`/blog/${p.slug}`} className="group block">
                    <div className="aspect-[4/3] overflow-hidden rounded-sm bg-secondary">
                      {p.cover_image_url && <img src={p.cover_image_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                    </div>
                    <div className="mt-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <time>{new Date(p.published_at || p.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</time>
                      </div>
                      <h2 className="mt-3 font-display text-2xl font-bold text-foreground transition-colors group-hover:text-accent md:text-3xl">{p.title}</h2>
                      <p className="mt-3 line-clamp-4 text-base leading-relaxed text-muted-foreground">{p.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent normal-case">lire l'article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
