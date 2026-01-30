import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const { searchQuery, setSearchQuery, setFilterType: setCartFilterType } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setCartFilterType(filterType);
  }, [filterType, setCartFilterType]);

const veg_img = import.meta.env.VITE_BASE_URL + 'veg.png';
const non_veg_img = import.meta.env.VITE_BASE_URL + 'non-veg.png';

  return (
    <section
      className="sticky top-0 z-50 bg-background border-b border-accent w-full"
    >
      <div className="container mx-auto px-6 py-5">

        {/* TOP ROW: Logo + Search (same line) */}
        <div className="flex flex-row flex-wrap md:flex-nowrap items-center space-x-2 md:space-x-6 md:gap-6 w-full justify-between">


          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src="https://avayacafe.com/wp-content/uploads/2025/11/logo-1.png.webp"
              alt="Avaya Cafe & Bakery"
              className="h-10 w-auto"
            />
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-2xl md:w-full">

            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search for food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 p-6 pl-10 bg-card/50 border border-accent/70 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex justify-center flex-grow mt-4 md:mt-0 md:flex-none">
            <div className="inline-flex items-center bg-card/50 rounded-full p-1 border border-border/30">

              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filterType === 'all'
                    ? 'bg-secondary text-accent'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                All
              </button>

              <button
                onClick={() => setFilterType('veg')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${filterType === 'veg'
                    ? 'bg-secondary text-white'
                    : 'text-muted-foreground hover:text-green-400'
                  }`}
              >
                <img src={veg_img} alt="Veg" className="w-5 h-5" />
                Veg
              </button>

              <button
                onClick={() => setFilterType('non-veg')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition flex items-center gap-2 ${filterType === 'non-veg'
                    ? 'bg-secondary text-white'
                    : 'text-muted-foreground hover:text-red-400'
                  }`}
              >
                <img src={non_veg_img} alt="Non-Veg" className="w-5 h-5" />
                Non-Veg
              </button>

            </div>
          </div>
        </div>

        


      </div>
    </section>
  );

};

export default Header;
