import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Check, Phone, User, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useMenuData } from '@/hooks/useMenuData';

const CheckoutDrawer = () => {
  const { 
    items,
    isCheckoutOpen, 
    setIsCheckoutOpen,
    setIsCartOpen,
    totalPrice,
    totalTax,
    totalPriceWithTax,
    clearCart
  } = useCart();

  const { data: menuData } = useMenuData();
  const taxes = menuData?.taxes || [];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    remark: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const grandTotal = totalPriceWithTax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBack = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate order submission
    setIsSubmitted(true);
    setTimeout(() => {
      clearCart();
      setIsSubmitted(false);
      setIsCheckoutOpen(false);
      setFormData({ name: '', phone: '', remark: '' });
    }, 2000);
  };

  const isFormValid = formData.name.trim() && formData.phone.trim();

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCheckoutOpen(false)}
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
            {/* Success Animation */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background z-10 flex flex-col items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-cream mb-2">Order Placed!</h3>
                  <p className="text-cream-muted">Thank you for your order</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center gap-4 p-6 border-b border-border">
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-muted transition-colors text-cream-muted hover:text-cream"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-cream">Checkout</h2>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-cream-muted hover:text-cream ml-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gradient-card rounded-xl p-4 border border-border/30">
                  <h3 className="text-sm font-medium text-cream-muted mb-3">Order Summary</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-cream">
                        {item.quantity}x {item.name}
                        {item.selectedVariation && (
                          <span className="text-accent ml-1">({item.selectedVariation.name})</span>
                        )}
                      </span>
                        <span className="text-cream-muted">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-cream-muted">Subtotal</span>
                      <span className="text-cream-muted">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    {taxes.map((tax) => {
                      const taxAmount = (totalPrice * parseFloat(tax.tax)) / 100;
                      return (
                        <div key={tax.taxid} className="flex justify-between text-sm">
                          <span className="text-cream-muted">{tax.taxname}</span>
                          <span className="text-cream-muted">₹{taxAmount.toFixed(2)}</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between font-medium text-cream pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="font-semibold text-accent">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-cream-muted">Contact Details</h3>
                  
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-muted" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name *"
                      required
                      className="w-full bg-muted/50 border border-border/50 rounded-xl py-4 pl-12 pr-4 text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-muted" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number *"
                      required
                      className="w-full bg-muted/50 border border-border/50 rounded-xl py-4 pl-12 pr-4 text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    />
                  </div>

                  {/* Remark */}
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-cream-muted" />
                    <textarea
                      name="remark"
                      value={formData.remark}
                      onChange={handleChange}
                      placeholder="Special instructions or remarks (optional)"
                      rows={3}
                      className="w-full bg-muted/50 border border-border/50 rounded-xl py-4 pl-12 pr-4 text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="border-t border-border p-6">
              <motion.button
                type="submit"
                onClick={handleSubmit}
                disabled={!isFormValid}
                whileHover={isFormValid ? { scale: 1.02 } : {}}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
                className={`w-full font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
                  isFormValid 
                    ? 'bg-accent hover:bg-accent/90 text-accent-foreground' 
                    : 'bg-muted text-cream-muted cursor-not-allowed'
                }`}
              >
                Place Order - ₹{grandTotal.toFixed(2)}
              </motion.button>
              <p className="text-xs text-cream-muted text-center mt-3">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutDrawer;
