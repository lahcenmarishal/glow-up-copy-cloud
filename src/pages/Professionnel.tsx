import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import CategoryPage from "@/pages/CategoryPage";

const subcategoryMap: Record<string, string> = {
  "tapis-de-course": "Tapis de course", "elliptiques": "Elliptiques", "climbmills": "Climbmills",
  "steppers": "Steppers", "velos": "Vélos", "rameurs": "Rameurs",
  "multi-stations": "Multi-stations", "mono-stations": "Mono-stations",
  "charges-libres": "Charges Libres", "charges-guidees": "Charges Guidées",
  "hiit-cardio": "HIIT Cardio", "cages-rigs": "Cages & Rigs",
};

const categoryTitleMap: Record<string, string> = { cardio: "Cardio", musculation: "Musculation", fonctionnel: "Fonctionnel" };

const ProfessionnelPage = () => {
  const { category, subcategory } = useParams();

  if (category && !subcategory) {
    return <CategoryPage usageType="professionnel" />;
  }

  const categoryName = category ? categoryTitleMap[category.toLowerCase()] : undefined;
  const subcategoryName = subcategory ? subcategoryMap[subcategory.toLowerCase()] : undefined;
  const title = subcategoryName || (categoryName ? `${categoryName} Professionnel` : "Équipements Professionnel");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <ProductGrid
          defaultCategory={categoryName}
          defaultSubcategory={subcategoryName}
          defaultSubcategorySlug={subcategory}
          defaultUsageType="professionnel"
          title={title}
          subtitle="Usage professionnel"
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProfessionnelPage;
