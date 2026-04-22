import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { LogOut, Package, MessageSquare, Settings, ArrowLeft, Image, Briefcase, FolderOpen, LayoutGrid, Info, Layers, Mail, HelpCircle, FileText } from "lucide-react";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminContacts from "@/components/admin/AdminContacts";
import AdminContactSettings from "@/components/admin/AdminContactSettings";
import AdminHeroSlides from "@/components/admin/AdminHeroSlides";
import AdminConsulting from "@/components/admin/AdminConsulting";
import AdminRealisations from "@/components/admin/AdminRealisations";
import AdminCategoryCards from "@/components/admin/AdminCategoryCards";
import AdminAbout from "@/components/admin/AdminAbout";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminBlogs from "@/components/admin/AdminBlogs";
import AdminFaqs from "@/components/admin/AdminFaqs";
import AdminNewsletter from "@/components/admin/AdminNewsletter";
import logo from "@/assets/logo-new.png";

const tabs = [
  { id: "products", label: "Produits", icon: Package },
  { id: "hero", label: "Carousel", icon: Image },
  { id: "categories", label: "Cartes Accueil", icon: LayoutGrid },
  { id: "eq-categories", label: "Catégories", icon: Layers },
  { id: "consulting", label: "Consulting", icon: Briefcase },
  { id: "realisations", label: "Réalisations", icon: FolderOpen },
  { id: "blogs", label: "Blog", icon: FileText },
  { id: "faqs", label: "FAQ", icon: HelpCircle },
  { id: "about", label: "À propos", icon: Info },
  { id: "contacts", label: "Demandes", icon: MessageSquare },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "settings", label: "Coordonnées", icon: Settings },
] as const;

type TabId = (typeof tabs)[number]["id"];

const AdminPage = () => {
  const { isAdmin, loading, signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("products");

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;
  }

  if (!user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }
  if (!isAdmin) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-card">
        <div className="flex flex-shrink-0 items-center gap-2 border-b border-border px-5 py-4">
          <img src={logo} alt="IMPULSE FITNESS" className="h-6 w-auto" />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </nav>
        <div className="flex-shrink-0 border-t border-border p-3 space-y-1">
          <a href="/" className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Retour au site</a>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><LogOut className="h-4 w-4" /> Déconnexion</button>
        </div>
      </aside>
      <main className="ml-56 flex-1 p-8">
        {activeTab === "products" && <AdminProducts />}
        {activeTab === "hero" && <AdminHeroSlides />}
        {activeTab === "categories" && <AdminCategoryCards />}
        {activeTab === "eq-categories" && <AdminCategories />}
        {activeTab === "consulting" && <AdminConsulting />}
        {activeTab === "realisations" && <AdminRealisations />}
        {activeTab === "blogs" && <AdminBlogs />}
        {activeTab === "faqs" && <AdminFaqs />}
        {activeTab === "about" && <AdminAbout />}
        {activeTab === "contacts" && <AdminContacts />}
        {activeTab === "newsletter" && <AdminNewsletter />}
        {activeTab === "settings" && <AdminContactSettings />}
      </main>
    </div>
  );
};

export default AdminPage;
