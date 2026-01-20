import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Coffee } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
          className="inline-block mb-6"
        >
          <Coffee className="w-16 h-16 text-accent" />
        </motion.div>
        
        <h1 className="heading-section text-cream mb-4">404</h1>
        <p className="text-cream-muted text-lg mb-8">
          Oops! Page not found
        </p>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          Return to Café
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
