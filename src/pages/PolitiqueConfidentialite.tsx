import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 md:px-16 pt-32 pb-16 max-w-4xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground uppercase mb-6">
          Politique de confidentialité
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/80 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-foreground uppercase mb-2">1. Introduction</h2>
            <p>
              Impulse Fitness s'engage à protéger la vie privée des utilisateurs de son site web.
              Cette politique de confidentialité décrit la manière dont nous collectons, utilisons et protégeons vos informations personnelles.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground uppercase mb-2">2. Données collectées</h2>
            <p>Nous collectons les données suivantes lorsque vous utilisez notre site :</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Nom de l'entreprise (le cas échéant)</li>
              <li>Messages envoyés via le formulaire de contact</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground uppercase mb-2">3. Utilisation des données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Répondre à vos demandes de devis et de contact</li>
              <li>Vous envoyer notre newsletter (avec votre consentement)</li>
              <li>Améliorer nos services et notre site</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground uppercase mb-2">4. Partage des données</h2>
            <p>
              Nous ne vendons ni ne louons vos données personnelles à des tiers.
              Vos informations restent strictement confidentielles et ne sont utilisées qu'en interne.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground uppercase mb-2">5. Cookies</h2>
            <p>
              Notre site utilise des cookies techniques nécessaires à son bon fonctionnement.
              Vous pouvez configurer votre navigateur pour les refuser.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground uppercase mb-2">6. Vos droits</h2>
            <p>
              Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification,
              de suppression et d'opposition au traitement de vos données personnelles.
              Pour exercer ces droits, contactez-nous via la page Contact.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-foreground uppercase mb-2">7. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité,
              n'hésitez pas à nous contacter via notre page de contact.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolitiqueConfidentialite;
