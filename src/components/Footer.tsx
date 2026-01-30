import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/30 py-10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center flex flex-col gap-6"
        >
          <img  className="w-20 mx-auto"src="https://avayacafe.com/wp-content/uploads/2025/11/logo-1.png.webp" alt="" />
          
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-cream-muted">
            <a href="https://avayacafe.com/" className="hover:text-accent transition-colors">Home</a>
            <a href="https://avayacafe.com/about" className="hover:text-accent transition-colors">About</a>
            <a href="https://avayacafe.com/blog/" className="hover:text-accent transition-colors">Blog</a>
            <a href="https://avayacafe.com/contact" className="hover:text-accent transition-colors">Contact</a>
          </div>

          <p className="text-xs text-cream-muted">
            © 2025 Avaya Cafe & Bakery.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
