import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Send, Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube, Building2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.14a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.57z"/></svg>
);

type UsageType = "professionnel" | "residentiel" | null;

const ContactSection = () => {
  const [usageType, setUsageType] = useState<UsageType>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", company: "", city: "", message: "" });
  const [sending, setSending] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usageType) return;
    if (!form.full_name.trim() || !form.phone.trim()) { toast.error("Nom et téléphone obligatoires."); return; }
    if (usageType === "professionnel" && !form.company.trim()) { toast.error("Nom de l'entreprise obligatoire."); return; }
    setSending(true);
    const message = `[CONTACT - Usage ${usageType}]\n${usageType === "professionnel" ? `Entreprise: ${form.company}\n` : ""}Ville: ${form.city}\n\nMessage:\n${form.message || "—"}`;
    const { error } = await supabase.from("contact_requests").insert({
      full_name: form.full_name, email: form.email?.trim() ? form.email.trim() : `${form.phone}@no-email.local`, phone: form.phone, company: usageType === "professionnel" ? form.company : null, message,
    });
    if (error) { toast.error("Erreur lors de l'envoi."); } else { toast.success("Demande envoyée avec succès !"); setForm({ full_name: "", phone: "", email: "", company: "", city: "", message: "" }); setUsageType(null); }
    setSending(false);
  };

  const inputClass = "w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors";

  const contactInfo = [
    { icon: Phone, title: "Téléphone", lines: [s.phone_1, s.phone_2].filter(Boolean) as string[] },
    { icon: Mail, title: "Email", lines: [s.email_1, s.email_2].filter(Boolean) as string[] },
    { icon: MapPin, title: "Adresse", lines: [s.address_line_1, s.address_line_2].filter(Boolean) as string[] },
    { icon: Clock as any, title: "Horaires", lines: [s.hours_line_1, s.hours_line_2].filter(Boolean) as string[] },
  ];

  const mapsUrl = s.maps_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.5764262705056!2d-7.641104500000001!3d33.4342858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda62f8be06bf783%3A0x25ce1bcb1e2ceef9!2sIMPULSE%20MAROC!5e0!3m2!1sfr!2sus!4v1774475925760!5m2!1sfr!2sus";

  return (
    <section id="contact" className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-xl">Contactez nous pour une consultation personnalisée ou planifiez votre visite au showroom.</h2>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            {contactInfo.map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent/10">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-foreground">{item.title}</h3>
                  {item.lines.map((line, i) => {
                    if (item.title === "Téléphone") return <a key={i} href={`tel:${line.replace(/\s+/g, "")}`} className="block text-sm text-muted-foreground hover:text-accent transition-colors">{line}</a>;
                    if (item.title === "Email") return <a key={i} href={`mailto:${line}`} className="block text-sm text-muted-foreground hover:text-accent transition-colors">{line}</a>;
                    return <p key={i} className="text-sm text-muted-foreground">{line}</p>;
                  })}
                </div>
              </div>
            ))}
            {(s.social_instagram || s.social_facebook || s.social_tiktok || s.social_youtube) && (
              <div className="flex items-center gap-3 pt-2">
                {s.social_instagram && <a href={s.social_instagram} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-background"><Instagram className="h-5 w-5" /></a>}
                {s.social_facebook && <a href={s.social_facebook} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-background"><Facebook className="h-5 w-5" /></a>}
                {s.social_tiktok && <a href={s.social_tiktok} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-background"><TikTokIcon className="h-5 w-5" /></a>}
                {s.social_youtube && <a href={s.social_youtube} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors hover:bg-accent hover:text-background"><Youtube className="h-5 w-5" /></a>}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8 lg:col-span-3">
            <p className="mb-6 text-lg font-bold text-foreground">Remplissez le formulaire et nous vous contacterons dans les plus brefs délais.</p>
            {!usageType ? (
              <div>
                <h3 className="mb-4 text-sm font-semibold text-foreground">Sélectionnez votre type d'usage :</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <button type="button" onClick={() => setUsageType("professionnel")} className="group flex flex-col items-center gap-3 rounded-md border-2 border-border bg-background p-6 transition-all hover:border-accent">
                    <Building2 className="h-10 w-10 text-muted-foreground group-hover:text-accent" />
                    <div className="text-center">
                      <p className="text-base font-semibold text-foreground">Professionnel</p>
                      <p className="mt-1 text-xs text-muted-foreground">Centre de fitness, Hotel…</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => setUsageType("residentiel")} className="group flex flex-col items-center gap-3 rounded-md border-2 border-border bg-background p-6 transition-all hover:border-accent">
                    <Home className="h-10 w-10 text-muted-foreground group-hover:text-accent" />
                    <div className="text-center">
                      <p className="text-base font-semibold text-foreground">Résidentiel</p>
                      <p className="mt-1 text-xs text-muted-foreground">Home gym, Résidence…</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
                <div className="md:col-span-2 mb-2 flex items-center gap-2">
                  {usageType === "professionnel" ? <Building2 className="h-5 w-5 text-accent" /> : <Home className="h-5 w-5 text-accent" />}
                  <span className="text-sm font-semibold text-foreground">{usageType === "professionnel" ? "Formulaire Professionnel" : "Formulaire Résidentiel"}</span>
                  <button type="button" onClick={() => setUsageType(null)} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Changer</button>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Nom complet <span className="text-accent">*</span></label>
                  <input type="text" placeholder="Votre nom" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputClass} required />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Téléphone <span className="text-accent">*</span></label>
                  <input type="tel" placeholder="+212 6XX-XXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} required />
                </div>
                {usageType === "professionnel" && (
                  <>
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Entreprise <span className="text-accent">*</span></label>
                      <input type="text" placeholder="Nom de votre entreprise" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass} required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-xs font-medium text-foreground">Email</label>
                      <input type="email" placeholder="votre@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                    </div>
                  </>
                )}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Ville</label>
                  <input type="text" placeholder="Votre ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-foreground">Message</label>
                  <textarea placeholder="Décrivez votre projet ou vos besoins..." rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />
                </div>
                <button type="submit" disabled={sending} className="flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50 md:col-span-2">
                  <Send className="h-4 w-4" />
                  {sending ? "Envoi en cours..." : "Envoyer"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl overflow-hidden rounded-xl border border-border shadow-sm">
          <iframe title="Localisation IMPULSE FITNESS" src={mapsUrl} width="100%" height="350" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full" />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
