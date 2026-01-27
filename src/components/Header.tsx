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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        {/* Top row with logo and menu button */}
        <div className="flex items-center justify-between">
          {/* Logo - moved to left */}
          <motion.div 
            className="text-left"
            whileHover={{ scale: 1.02 }}
          >
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-cream tracking-wider">
              avaya
            </h1>
            <p className="text-[10px] md:text-xs text-accent tracking-[0.3em] uppercase">
              cafe & bakery
            </p>
          </motion.div>

          {/* Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-card/50 hover:bg-card transition-colors"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-cream" />
            ) : (
              <Menu className="w-5 h-5 text-cream" />
            )}
          </motion.button>
        </div>

        {/* Search Bar - centered */}
        <div className="mt-4 flex justify-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-accent text-cream placeholder:text-muted-foreground"
            />
          </div>
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
