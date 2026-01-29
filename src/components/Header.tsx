import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/50 shadow-lg"
    >
      <div className="container mx-auto px-6 py-3">
        {/* Top row with logo, centered search bar and menu button */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <img 
              src="https://avayacafe.com/wp-content/uploads/2025/11/logo-1.png.webp" 
              alt="Avaya Cafe & Bakery"
              className="h-8 w-auto"
            />
          </motion.div>

          {/* Search Bar - centered */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-transparent focus:border-transparent focus:ring-0 text-cream placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Menu Button - right corner */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-card/50 hover:bg-card transition-colors flex-shrink-0"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-cream" />
            ) : (
              <Menu className="w-5 h-5 text-cream" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <motion.div
        initial={false}
        animate={{ 
          height: menuOpen ? 'auto' : 0,
          opacity: menuOpen ? 1 : 0
        }}
        className="overflow-hidden bg-card/95 backdrop-blur-md"
      >
        <nav className="container mx-auto px-6 py-4 flex flex-col gap-3">
          {['Coffee', 'Breakfast', 'Pizza', 'Salads', 'Rolls'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-cream-muted hover:text-accent transition-colors py-2 border-b border-border/30 last:border-0"
            >
              {item}
            </a>
          ))}
        </nav>
      </motion.div>
    </motion.header>
  );
};

export default Header;
