import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import heroCoffee from '@/assets/hero-coffee.jpg';
import heroBreakfast from '@/assets/hero-breakfast.jpg';
import heroPizza from '@/assets/hero-pizza.jpg';
import heroSalad from '@/assets/hero-salad.jpg';
import heroRolls from '@/assets/hero-rolls.jpg';

const heroSlides = [
  { image: heroCoffee, title: 'COFFEE', subtitle: 'Freshly brewed. Perfectly balanced.' },
  { image: heroBreakfast, title: 'BREAKFAST', subtitle: 'Start your day the Avaya way.' },
  { image: heroPizza, title: 'PIZZA', subtitle: 'Baked fresh, served hot.' },
  { image: heroSalad, title: 'SALADS', subtitle: 'Fresh. Vibrant. Wholesome.' },
  { image: heroRolls, title: 'ROLLS', subtitle: 'Wrapped to perfection.' },
];

const HeroLanding = () => {
  const { searchQuery, setSearchQuery } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToMenu = () => {
    document.getElementById('coffee')?.scrollIntoView({ behavior: 'smooth' });
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <img
            src={currentHero.image}
            alt={currentHero.title}
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-accent tracking-[0.4em] uppercase text-sm mb-6"
          >
            Welcome to
          </motion.p>
          
          <h1 className="heading-display text-cream mb-4">
            avaya
          </h1>
          
          <p className="text-cream-muted tracking-[0.25em] uppercase text-lg mb-8">
            Cafe & Bakery
          </p>

          {/* Dynamic subtitle */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-cream/80 text-lg md:text-xl max-w-xl mx-auto mb-8"
            >
              {currentHero.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full bg-background/60 backdrop-blur-md border border-border/50 rounded-full py-4 pl-12 pr-6 text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
              />
            </div>
          </motion.div>

          {/* Slide indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-accent w-6' : 'bg-cream/40 hover:bg-cream/60'
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={scrollToMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group inline-flex flex-col items-center gap-2 text-cream/70 hover:text-accent transition-colors"
          >
            <span className="text-sm tracking-wider uppercase">Explore Menu</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroLanding;
