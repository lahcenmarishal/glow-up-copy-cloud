import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Facebook, Youtube } from "lucide-react";
import logo from "@/assets/logo-new.png";
import NewsletterSignup from "@/components/NewsletterSignup";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.14a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.57z"/></svg>
);

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["contact-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_settings").select("*");
      if (error) throw error;
      const map: Record<string, string> = {};
      data.forEach((s: any) => { map[s.key] = s.value; });
      return map;
    },
  });

  const s = settings || {};

  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/">
              <img src={logo} alt="IMPULSE FITNESS" className="h-8 w-auto" />
            </Link>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-background/50">Votre partenaire de solutions complètes pour des espaces fitness d’exception.</p>
            {(s.social_instagram || s.social_facebook || s.social_tiktok || s.social_youtube) && (
              <div className="mt-4 flex items-center gap-3">
                {s.social_instagram && <a href={s.social_instagram} target="_blank" rel="noopener noreferrer" className="text-background/40 transition-colors hover:text-background"><Instagram className="h-5 w-5" /></a>}
                {s.social_facebook && <a href={s.social_facebook} target="_blank" rel="noopener noreferrer" className="text-background/40 transition-colors hover:text-background"><Facebook className="h-5 w-5" /></a>}
                {s.social_tiktok && <a href={s.social_tiktok} target="_blank" rel="noopener noreferrer" className="text-background/40 transition-colors hover:text-background"><TikTokIcon className="h-5 w-5" /></a>}
                {s.social_youtube && <a href={s.social_youtube} target="_blank" rel="noopener noreferrer" className="text-background/40 transition-colors hover:text-background"><Youtube className="h-5 w-5" /></a>}
              </div>
            )}
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-background/80">Professionnel</h4>
            <ul className="space-y-2 text-xs text-background/50">
              <li><a href="/professionnel/cardio" className="hover:text-background">Cardio</a></li>
              <li><a href="/professionnel/musculation" className="hover:text-background">Musculation</a></li>
              <li><a href="/professionnel/fonctionnel" className="hover:text-background">Fonctionnel</a></li>
            </ul>
            <h4 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-widest text-background/80">Résidentiel</h4>
            <ul className="space-y-2 text-xs text-background/50">
              <li><a href="/residentiel/cardio" className="hover:text-background">Cardio</a></li>
              <li><a href="/residentiel/musculation" className="hover:text-background">Musculation</a></li>
              <li><a href="/residentiel/fonctionnel" className="hover:text-background">Fonctionnel</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-background/80">Entreprise</h4>
            <ul className="space-y-2 text-xs text-background/50">
              <li><a href="/consulting" className="hover:text-background">Consulting</a></li>
              <li><a href="/realisations" className="hover:text-background">Réalisations</a></li>
              <li><a href="/blog" className="hover:text-background">Blog</a></li>
              <li><a href="/a-propos" className="hover:text-background">À propos</a></li>
              <li><a href="/contact" className="hover:text-background">Contact</a></li>
            </ul>
          </div>
          <NewsletterSignup />
        </div>
        <div className="mt-8 border-t border-background/10 pt-6 text-center text-xs text-background/40">© {new Date().getFullYear()} Impulse Fitness. Tous droits réservés.</div>
      </div>
    </footer>
  );
};

export default Footer;
