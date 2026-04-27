import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import contactHero from "@/assets/contact-hero.jpg";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <img src={contactHero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/70" />
        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-4xl font-bold text-background md:text-5xl">Parlons de votre projet</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-background/80 md:text-lg">Nos experts vous accompagnent pour transformer vos idées en réalité</p>
        </div>
      </div>
      <ContactSection />
      <Footer />
    </div>
  );
};

export default ContactPage;
