import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartDrawer = () => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    setIsCheckoutOpen,
    addItem, 
    removeItem, 
    totalPrice,
    totalTax,
    totalPriceWithTax,
    clearCart 
  } = useCart();

  const deliveryFee = 2.50;
  const grandTotal = totalPriceWithTax + (totalPrice >= 30 ? 0 : deliveryFee);

  const getItemEmoji = (name: string) => {
    if (name.includes('Espresso') || name.includes('Latte') || name.includes('Cappuccino') || name.includes('Mocha') || name.includes('Americano') || name.includes('Macchiato') || name.includes('Cold') || name.includes('Flat')) return '☕';
    if (name.includes('Pancake')) return '🥞';
    if (name.includes('Avocado')) return '🥑';
    if (name.includes('Omelette') || name.includes('English')) return '🍳';
    if (name.includes('Croissant')) return '🥐';
    if (name.includes('Granola')) return '🥣';
    if (name.includes('Margherita') || name.includes('Pepperoni') || name.includes('Formaggi') || name.includes('BBQ') || name.includes('Veggie') || name.includes('Truffle')) return '🍕';
    if (name.includes('Caesar') || name.includes('Greek') || name.includes('Quinoa') || name.includes('Garden') || name.includes('Asian')) return '🥗';
    return '🌯';
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-cream">Your Order</h2>
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-cream-muted hover:text-destructive transition-colors px-2 py-1 rounded border border-border/50 hover:border-destructive/50"
                  >
                    Clear
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-cream-muted hover:text-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-cream-muted/30 mb-4" />
                  <p className="text-cream-muted">Your cart is empty</p>
                  <p className="text-sm text-cream-muted/60 mt-1">Add items to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 bg-gradient-card rounded-xl p-4 border border-border/30"
                    >
                      {/* Item Image */}
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                        {getItemEmoji(item.name)}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-cream truncate">
                        {item.name}
                        {item.selectedVariation && (
                          <span className="text-accent ml-2">({item.selectedVariation.name})</span>
                        )}
                      </h4>
                        <p className="text-accent font-semibold mt-1">₹{item.price.toFixed(2)}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => removeItem(item.id, item.selectedVariation?.id)}
                            className="w-7 h-7 rounded-full bg-muted hover:bg-destructive/20 flex items-center justify-center text-cream-muted hover:text-destructive transition-colors"
                          >
                            {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                          </button>
                          <span className="text-cream font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addItem(item)}
                            className="w-7 h-7 rounded-full bg-accent/20 hover:bg-accent/30 flex items-center justify-center text-accent transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-cream font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                {/* Progress to free delivery */}
                {totalPrice < 30 && (
                  <div className="bg-accent/10 rounded-lg p-3">
                    <p className="text-xs text-accent text-center">
                      Add ₹{(30 - totalPrice).toFixed(2)} more for free delivery!
                    </p>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${Math.min((totalPrice / 30) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-cream-muted">
                    <span>Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-cream-muted">
                    <span>Delivery Fee</span>
                    <span>{totalPrice >= 30 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-cream-muted">
                    <span>Taxes (CGST + SGST)</span>
                    <span>₹{totalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-cream font-semibold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-accent">₹{(totalPrice >= 30 ? grandTotal - deliveryFee : grandTotal).toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  Checkout Now
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
