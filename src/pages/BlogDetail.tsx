import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, User } from "lucide-react";

// Minimal markdown renderer (headings, bold, lists, paragraphs)
const renderMarkdown = (md: string) => {
  const lines = md.split(/\r?\n/);
  const out: JSX.Element[] = [];
  let listItems: string[] = [];
  const flushList = () => {
    if (listItems.length) {
      out.push(<ul key={`ul-${out.length}`} className="my-4 space-y-1.5 pl-5 list-disc text-foreground/85">{listItems.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inline(it) }} />)}</ul>);
      listItems = [];
    }
  };
  const inline = (s: string) => s
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (line.startsWith("# ")) { flushList(); out.push(<h1 key={idx} className="mt-8 mb-4 font-display text-3xl font-bold text-foreground">{line.slice(2)}</h1>); }
    else if (line.startsWith("## ")) { flushList(); out.push(<h2 key={idx} className="mt-6 mb-3 font-display text-2xl font-bold text-foreground">{line.slice(3)}</h2>); }
    else if (line.startsWith("### ")) { flushList(); out.push(<h3 key={idx} className="mt-5 mb-2 font-display text-xl font-bold text-foreground">{line.slice(4)}</h3>); }
    else if (line.startsWith("- ")) { listItems.push(line.slice(2)); }
    else if (line.trim() === "") { flushList(); }
    else { flushList(); out.push(<p key={idx} className="my-4 leading-relaxed text-foreground/85" dangerouslySetInnerHTML={{ __html: inline(line) }} />); }
  });
  flushList();
  return out;
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug!).eq("is_published", true).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        {isLoading ? (
          <div className="flex h-[40vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>
        ) : !post ? (
          <div className="container mx-auto px-6 py-20 text-center">
            <h1 className="font-display text-2xl font-bold">Article introuvable</h1>
            <Link to="/blog" className="mt-4 inline-block text-sm text-accent hover:underline">← Retour au blog</Link>
          </div>
        ) : (
          <article>
            {post.cover_image_url && (
              <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
                <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              </div>
            )}
            <div className="container mx-auto max-w-3xl px-6 py-12 md:py-16">
              <Link to="/blog" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent"><ArrowLeft className="h-3 w-3" /> Tous les articles</Link>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-5xl">{post.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {post.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(post.published_at || post.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</span>
              </div>
              {post.excerpt && <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>}
              <div className="mt-8 text-base">{renderMarkdown(post.content || "")}</div>
              <div className="mt-12 flex justify-center border-t border-border pt-10">
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
                  Contactez-nous pour une consultation personnalisée
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetailPage;
