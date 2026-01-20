import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/30 py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="font-serif text-2xl text-cream mb-2">avaya</h3>
          <p className="text-xs text-accent tracking-[0.3em] uppercase mb-6">
            cafe & bakery
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-cream-muted mb-8">
            <a href="#coffee" className="hover:text-accent transition-colors">Coffee</a>
            <a href="#breakfast" className="hover:text-accent transition-colors">Breakfast</a>
            <a href="#pizza" className="hover:text-accent transition-colors">Pizza</a>
            <a href="#salad" className="hover:text-accent transition-colors">Salads</a>
            <a href="#rolls" className="hover:text-accent transition-colors">Rolls</a>
          </div>

          <p className="text-xs text-cream-muted">
            © 2025 Avaya Cafe & Bakery. Crafted with ♥
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
