import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";

const emailSchema = z.string().trim().email({ message: "Email invalide" }).max(255);

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: parsed.data });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") { toast.info("Vous êtes déjà inscrit à notre newsletter."); setDone(true); }
      else toast.error("Erreur lors de l'inscription");
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("Merci ! Inscription confirmée.");
  };

  return (
    <div>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-background/80">Newsletter</h4>
      <p className="mb-3 text-xs text-background/50">Recevez nos actualités et offres exclusives.</p>
      {done ? (
        <p className="text-xs text-accent">✓ Vous êtes inscrit !</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-background/40" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full rounded-sm border border-background/20 bg-background/5 pl-8 pr-3 py-2 text-xs text-background placeholder:text-background/40 focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <button type="submit" disabled={submitting} className="rounded-sm bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50">
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "S'inscrire"}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterSignup;
