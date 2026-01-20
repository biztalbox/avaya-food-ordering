import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const FloatingCart = () => {
  const { totalItems, totalPrice, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:right-8 md:bottom-8 z-40"
        >
          <motion.button
            onClick={() => setIsCartOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto flex items-center justify-between gap-6 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-4 rounded-2xl shadow-gold transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-background text-cream text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              </div>
              <span className="font-medium">
                {totalItems} item{totalItems !== 1 ? 's' : ''} added
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
              <div className="hidden md:flex items-center gap-1.5 font-medium">
                View Cart
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
