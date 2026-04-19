import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FaqSection = () => {
  const { data: faqs, isLoading } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("faqs").select("*").eq("is_active", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return null;
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-16 max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">FAQ</p>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Questions fréquentes</h2>
          <p className="mt-3 text-sm text-muted-foreground">Tout ce que vous devez savoir avant de nous contacter.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id} className="border-border">
              <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline md:text-base">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
