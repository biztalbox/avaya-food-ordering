import { useState } from 'react';
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
    totalDiscount,
    totalPriceWithDiscount,
    clearCart,
    // couponCode: contextCouponCode, // Removed as per interface
    couponDiscount,
    applyCoupon,
    removeCoupon,
    appliedCoupon
  } = useCart();

  const grandTotal = totalPriceWithDiscount;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const PLACEHOLDER_IMAGE = import.meta.env.VITE_BASE_URL + 'placeholder.jpg';

  // Local state for input field, sync with context on mount/change
  // Local state for input field
  const [localCode, setLocalCode] = useState(appliedCoupon?.discountname || '');
  const [couponMessage, setCouponMessage] = useState('');

  // Sync local code with context if context changes externally (optional but good practice)
  // useEffect(() => {
  //   setLocalCode(contextCouponCode);
  // }, [contextCouponCode]);


  const handleApplyCoupon = () => {
    setCouponMessage('');
    const code = localCode.trim();

    if (!code) {
      setCouponMessage('Please enter a coupon code');
      return;
    }

    const result = applyCoupon(code);
    setCouponMessage(result.message);

    if (!result.success) {
      // clear local code if you want, or keep it for correction
    }
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
            onClick={() => { setIsCartOpen(false); document.body.style.overflow = 'auto'; }}
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
            {/* Scrollable Container for matching "pure page scrolleable" request */}
            <div className="h-full overflow-y-auto flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-cream">Your Order</h2>
                  {items.length > 0 && (
                    <button
                      onClick={() => {
                        clearCart();
                        removeCoupon();
                        setLocalCode('');
                        setCouponMessage('');
                      }}
                      className="text-xs text-cream-muted hover:text-destructive transition-colors px-2 py-1 rounded border border-border/50 hover:border-destructive/50"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); document.body.style.overflow = 'auto'; }}
                  className="p-2 rounded-full hover:bg-muted transition-colors text-cream-muted hover:text-cream"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items - remove flex-1 and overflow-y-auto to let parent scroll */}
              <div className="p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
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
                        className="flex gap-4  rounded-md border-[#B8936E] p-4 border border-border/30"
                      >
                        <img
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                          src={item.image && item.image.trim() !== '' ? item.image : PLACEHOLDER_IMAGE}
                          onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
                        />


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
                <div className="border-t border-border p-6 space-y-4 mt-auto">
                  {/* Progress to free delivery */}
                  {totalPrice < 30 && totalDiscount > 0 && (
                    <div className="bg-green-500/10 rounded-lg p-3">
                      <p className="text-xs text-green-500 text-center">
                        You saved ₹{totalDiscount.toFixed(2)} on this order!
                      </p>
                    </div>
                  )}

                  {/* Pricing */}
                  <div className="bg-[#004240] rounded-xl p-4 space-y-2 text-sm">
                    {/* Coupon Section */}
                    <div className="mb-4 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter Coupon"
                          value={localCode}
                          onChange={(e) => setLocalCode(e.target.value)}
                          className="flex-1 bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-cream placeholder:text-cream-muted focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-accent/20 text-accent hover:bg-accent/30 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Apply Coupon
                        </button>
                      </div>
                      {couponMessage && (
                        <p className={`text-xs ${couponMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                          {couponMessage}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between text-cream">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-cream-muted">
                        <span>Discount {`(${((totalDiscount / (totalPrice + totalTax)) * 100).toFixed(0)}%)`}</span>
                        <span className="text-green-500">-₹{totalDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-cream-muted">
                        <span>Coupon Discount</span>
                        <span className="text-green-500">-₹{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-cream-muted">
                      <span>Taxes (CGST + SGST)</span>
                      <span>₹{totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-cream font-semibold text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span className="text-accent">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full bg-accent text-light font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    Checkout Now - ₹{grandTotal.toFixed(2)}
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
