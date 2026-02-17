import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqs } from '@/lib/data';

export default function FAQs() {
  return (
    <Layout>
      <section className="pt-24 pb-12 bg-hero-gradient">
        <div className="container-custom mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Frequently Asked <span className="text-gradient">Questions</span></h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">Find answers to common questions about orders, delivery, and more</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                <AccordionItem value={`item-${index}`} className="bg-card rounded-2xl border border-border px-6">
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-5">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 text-center bg-gradient-to-r from-primary/10 to-lavender/10 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">Our support team is here to help!</p>
            <a href="/contact" className="text-primary font-medium hover:underline">Contact Us →</a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
