import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useQuoteCart } from "@/contexts/QuoteCartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Building2, Home, FileText, Trash2 } from "lucide-react";

type UsageType = "professionnel" | "residentiel" | null;

const DevisPage = () => {
  const { items, removeItem, clearCart, itemCount } = useQuoteCart();
  const [usageType, setUsageType] = useState<UsageType>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", company: "", city: "", message: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usageType || items.length === 0) return;
    setLoading(true);
    const productList = items.map((i) => `${i.name} (x${i.quantity})`).join("\n");
    const message = `[DEVIS - Usage ${usageType}]\n${usageType === "professionnel" ? `Entreprise: ${form.company}\n` : ""}Ville: ${form.city}\n\nProduits demandés:\n${productList}\n\nMessage:\n${form.message || "—"}`;
    const { error } = await supabase.from("contact_requests").insert({ full_name: form.full_name, email: form.email?.trim() ? form.email.trim() : `${form.phone}@no-email.local`, phone: form.phone, company: usageType === "professionnel" ? form.company : null, message });
    setLoading(false);
    if (error) { toast.error("Erreur lors de l'envoi du devis"); } else { toast.success("Votre demande de devis a été envoyée avec succès !"); clearCart(); window.location.href = "/"; }
  };

  if (items.length === 0 && !usageType) {
    return (<div className="min-h-screen bg-background"><Navbar /><div className="flex h-[80vh] flex-col items-center justify-center gap-4"><FileText className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Votre devis est vide</p><a href="/" className="text-sm text-accent hover:text-accent/80">← Retour au catalogue</a></div><Footer /></div>);
  }

  return (
    <div className="min-h-screen bg-background"><Navbar /><div className="pt-20"><div className="container mx-auto px-6 py-6 md:px-16"><a href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Retour au catalogue</a></div>
    <div className="container mx-auto px-6 pb-20 md:px-16"><h1 className="mb-8 font-display text-3xl font-bold text-foreground">Demande de Devis</h1>
    <div className="mb-8 rounded-sm border border-border bg-card p-4"><h2 className="mb-4 text-sm font-semibold text-foreground">Vos équipements ({itemCount})</h2><div className="space-y-2">{items.map((item) => (<div key={item.id} className="flex items-center justify-between gap-3 rounded-sm bg-secondary/50 px-3 py-2"><div className="flex items-center gap-3">{item.image_url && <img src={item.image_url} alt="" className="h-10 w-10 rounded-sm object-cover" />}<div><p className="text-sm font-medium text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p></div></div><button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></div>))}</div></div>
    {!usageType ? (<div><h2 className="mb-6 text-lg font-semibold text-foreground">Sélectionnez votre type d'usage ci-dessous.</h2><div className="grid gap-4 md:grid-cols-2"><button onClick={() => setUsageType("professionnel")} className="group flex flex-col items-center gap-4 rounded-sm border-2 border-border bg-card p-8 transition-all hover:border-accent"><Building2 className="h-12 w-12 text-muted-foreground group-hover:text-accent" /><div className="text-center"><p className="text-lg font-semibold text-foreground">Usage Professionnel</p><p className="mt-1 text-sm text-muted-foreground">Salle de sport, hôtel, club, entreprise…</p></div></button><button onClick={() => setUsageType("residentiel")} className="group flex flex-col items-center gap-4 rounded-sm border-2 border-border bg-card p-8 transition-all hover:border-accent"><Home className="h-12 w-12 text-muted-foreground group-hover:text-accent" /><div className="text-center"><p className="text-lg font-semibold text-foreground">Usage Résidentiel</p><p className="mt-1 text-sm text-muted-foreground">Home gym, usage personnel…</p></div></button></div></div>) : (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4"><div className="mb-4 flex items-center gap-2">{usageType === "professionnel" ? <Building2 className="h-5 w-5 text-accent" /> : <Home className="h-5 w-5 text-accent" />}<h2 className="text-lg font-semibold text-foreground">{usageType === "professionnel" ? "Formulaire Professionnel" : "Formulaire Résidentiel"}</h2><button type="button" onClick={() => setUsageType(null)} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Changer</button></div>
    <Input name="full_name" placeholder="Nom complet *" value={form.full_name} onChange={handleChange} required /><Input name="phone" placeholder="Téléphone *" value={form.phone} onChange={handleChange} required />{usageType === "professionnel" && (<><Input name="company" placeholder="Nom de l'entreprise *" value={form.company} onChange={handleChange} required /><Input name="email" type="email" placeholder="Email (optionnel)" value={form.email} onChange={handleChange} /></>)}<Input name="city" placeholder="Ville *" value={form.city} onChange={handleChange} required /><Textarea name="message" placeholder="Décrivez votre projet..." value={form.message} onChange={handleChange} rows={4} /><Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">{loading ? "Envoi en cours…" : "Envoyer la demande de devis"}</Button></form>)}</div></div><Footer /></div>
  );
};

export default DevisPage;
