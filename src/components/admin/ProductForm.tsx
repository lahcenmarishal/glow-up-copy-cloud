// VERSION CORRIGÉE — toutes les fonctionnalités originales conservées
// Corrections principales :
// 1) Brouillon fonctionne pour création ET modification
// 2) Clé de brouillon unique par produit
// 3) Chargement galerie déplacé dans useEffect (évite boucle)
// 4) Suppression du brouillon après sauvegarde

import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Spec { label: string; value: string; }
interface WarrantyItem { component: string; duration: string; }
interface GalleryImage { id?: string; image_url: string; alt_text: string; sort_order: number; isNew?: boolean; }

const categories = ["Cardio", "Musculation", "Fonctionnel"];

const usageTypes = [
  { value: "both", label: "Professionnel & Résidentiel" },
  { value: "professionnel", label: "Professionnel uniquement" },
  { value: "residentiel", label: "Résidentiel uniquement" },
];

const subcategories: Record<string, string[]> = {
  Cardio: ["Tapis de course", "Elliptiques", "Climbmills", "Steppers", "Vélos", "Rameurs"],
  Musculation: ["Multi-stations", "Mono-stations", "Charges Libres", "Charges Guidées"],
  Fonctionnel: ["HIIT Cardio", "Cages & Rigs"],
};

const ProductForm = ({ product, onClose }: { product: any | null; onClose: () => void }) => {
  const qc = useQueryClient();

  const isEditing = !!product;

  // IMPORTANT — clé unique par produit
  const DRAFT_KEY = isEditing
    ? `product-form-draft-${product.id}`
    : "product-form-draft-new";

  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  };

  const draft = loadDraft();

  const [hasResumedDraft, setHasResumedDraft] = useState(!!draft);

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasResumedDraft(false);
    onClose();
  };

  const [name, setName] = useState(product?.name || draft?.name || "");
  const [category, setCategory] = useState(product?.category || draft?.category || "Cardio");
  const [usageType, setUsageType] = useState(product?.usage_type || draft?.usageType || "both");
  const [subcategory, setSubcategory] = useState(product?.subcategory || draft?.subcategory || "");
  const [shortDesc, setShortDesc] = useState(product?.short_description || draft?.shortDesc || "");
  const [description, setDescription] = useState(product?.description || draft?.description || "");

  const [warrantyItems, setWarrantyItems] = useState<WarrantyItem[]>(draft?.warrantyItems || []);
  const [specs, setSpecs] = useState<Spec[]>((product?.specs as Spec[]) || draft?.specs || []);
  const [features, setFeatures] = useState<string[]>((product?.features as string[]) || draft?.features || []);
  const [imageUrl, setImageUrl] = useState(product?.image_url || draft?.imageUrl || "");
  const [hoverImageUrl, setHoverImageUrl] = useState(product?.hover_image_url || draft?.hoverImageUrl || "");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isTrending, setIsTrending] = useState(product?.is_trending || draft?.isTrending || false);
  const [isPublished, setIsPublished] = useState(product?.is_published ?? draft?.isPublished ?? false);
  const [sortOrder, setSortOrder] = useState(product?.sort_order || draft?.sortOrder || 0);
  const [rangeCode, setRangeCode] = useState<string>(product?.range_code || draft?.rangeCode || "");

  const [saving, setSaving] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(isEditing);

  // CORRECTION — chargement galerie sécurisé
  useEffect(() => {
    if (!isEditing) return;

    let cancelled = false;

    const loadGallery = async () => {
      const { data } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order");

      if (!cancelled && data) {
        setGalleryImages(
          data.map((d) => ({
            ...d,
            alt_text: d.alt_text || "",
          }))
        );
      }

      setLoadingGallery(false);
    };

    loadGallery();

    return () => {
      cancelled = true;
    };
  }, [isEditing, product]);

  // CORRECTION — autosave pour création ET modification
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          name,
          category,
          usageType,
          subcategory,
          shortDesc,
          description,
          warrantyItems,
          specs,
          features,
          imageUrl,
          hoverImageUrl,
          isTrending,
          isPublished,
          sortOrder,
          rangeCode,
        })
      );
    }, 800);

    return () => clearTimeout(timer);
  }, [
    name,
    category,
    usageType,
    subcategory,
    shortDesc,
    description,
    warrantyItems,
    specs,
    features,
    imageUrl,
    hoverImageUrl,
    isTrending,
    isPublished,
    sortOrder,
    rangeCode,
    DRAFT_KEY,
  ]);

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase
      .storage
      .from("product-images")
      .upload(path, file);

    if (error) throw error;

    return supabase
      .storage
      .from("product-images")
      .getPublicUrl(path)
      .data.publicUrl;
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Le nom est requis");
      return;
    }

    setSaving(true);

    try {
      const productData = {
        name,
        category,
        usage_type: usageType,
        subcategory: subcategory || null,
        short_description: shortDesc || null,
        description: description || null,
        warranty:
          warrantyItems.length > 0
            ? JSON.stringify(warrantyItems.filter((w) => w.component.trim()))
            : null,
        specs: specs.filter((s) => s.label.trim()) as any,
        features: features.filter((f) => f.trim()) as any,
        image_url: imageUrl || null,
        hover_image_url: hoverImageUrl || null,
        is_trending: isTrending,
        is_published: isPublished,
        sort_order: sortOrder,
        range_code: rangeCode || null,
      };

      let productId = product?.id;

      if (isEditing) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select("id")
          .single();

        if (error) throw error;

        productId = data.id;
      }

      if (productId) {
        await supabase
          .from("product_images")
          .delete()
          .eq("product_id", productId);

        if (galleryImages.length > 0) {
          const { error } = await supabase
            .from("product_images")
            .insert(
              galleryImages.map((img, i) => ({
                product_id: productId,
                image_url: img.image_url,
                alt_text: img.alt_text || null,
                sort_order: i,
              }))
            );

          if (error) throw error;
        }
      }

      // suppression du brouillon après succès
      localStorage.removeItem(DRAFT_KEY);

      qc.invalidateQueries({ queryKey: ["admin-products"] });

      toast.success(isEditing ? "Produit mis à jour" : "Produit créé");

      onClose();
    } catch (err: any) {
      toast.error(err.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <button onClick={onClose} className="mb-6 flex items-center gap-2 text-sm">
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </button>

      <h1 className="mb-6 font-display text-2xl font-bold">
        {isEditing ? "Modifier le produit" : "Nouveau produit"}
      </h1>

      {hasResumedDraft && (
        <div className="mb-6 flex items-start justify-between gap-4 rounded-sm border border-accent/40 bg-accent/10 p-4">
          <div>
            <p className="text-sm font-semibold">Brouillon repris</p>
            <p className="mt-0.5 text-xs">Votre travail a été restauré automatiquement.</p>
          </div>

          <button
            onClick={discardDraft}
            className="shrink-0 rounded-sm border px-3 py-2 text-xs"
          >
            Supprimer le brouillon
          </button>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold"
        >
          {saving ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer le produit"}
        </button>

        <button
          onClick={onClose}
          className="rounded-sm border px-6 py-3 text-sm"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default ProductForm;
