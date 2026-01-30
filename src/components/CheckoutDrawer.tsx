import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, User, Phone, MessageSquare, Loader2, Check, Store, MapPin, PhoneCall } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useMenuData, useRestaurantData } from '@/hooks/useMenuData';
import { saveOrder, OrderData, OrderItem } from '@/services/orderService';

const CheckoutDrawer = () => {
  const {
    items,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    totalPrice,
    totalTax,
    totalPriceWithTax,
    totalDiscount,
    totalPriceWithDiscount,
    clearCart
  } = useCart();

  const { data: menuData } = useMenuData();
  const restaurantData = useRestaurantData();
  const taxes = menuData?.taxes || [];
  const discounts = menuData?.discounts || [];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    remark: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const table = new URLSearchParams(window.location.search).get('q');

  console.log(table);



  const grandTotal = totalPriceWithDiscount;  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Clear previous error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));

    // Validation based on field name
    if (name === 'name') {
      // Only allow letters, spaces, and common punctuation
      const nameRegex = /^[a-zA-Z\s\.'-]*$/;
      if (nameRegex.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'phone') {
      // Only allow numbers
      const phoneRegex = /^[0-9]*$/;
      if (phoneRegex.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBack = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Prepare order items
      const orderItems: OrderItem[] = items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        quantity: item.quantity,

        price: item.price,
        ...(item.selectedVariation && {
          variation: {
            id: item.selectedVariation.id,
            name: item.selectedVariation.name,
            price: item.selectedVariation.price,
          }
        })
      }));

      // Prepare order data
      const orderData: OrderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_remark: formData.remark,
        items: orderItems,
        subtotal: totalPrice,
        tax: totalTax,
        discount: totalDiscount,
        total: grandTotal,
        table_no: table || '',
        description: formData.remark || ''
      };

      // Submit order to API
      const response = await saveOrder(orderData, taxes);

      console.log('Order submitted successfully:', response);

      // Show success state
      setIsSubmitted(true);

      // Clear cart and reset form after delay
      setTimeout(() => {
        clearCart();
        setIsSubmitted(false);
        setIsCheckoutOpen(false);
        setFormData({ name: '', phone: '', remark: '' });
      }, 3000);

    } catch (error) {
      console.error('Error submitting order:', error);
      // Handle error (you could show an error message here)
      alert('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      phone: ''
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s\.'-]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters, spaces, dots, hyphens and apostrophes';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number can only contain digits';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    } else if (formData.phone.length > 15) {
      newErrors.phone = 'Phone number cannot exceed 15 digits';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.phone;
  };

  const isFormValid = formData.name.trim() && formData.phone.trim() && !errors.name && !errors.phone;

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
            <strong className="bg-[#004240] rounded-xl py-4 px-10 !text-left border border-border/30 text-sm font-medium text-[#B8936E]">
              Your Table / Room no. is = {table}
            </strong>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Restaurant Information */}
                {restaurantData && (
                  <div className="bg-[#004240] rounded-xl p-4 border border-border/30 mb-4">
                    <h3 className="text-sm font-medium text-cream mb-3 flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      Restaurant Information
                    </h3>


                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-cream-muted">Name:</span>
                        <span className="text-cream font-medium">{restaurantData.res_name}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-cream-muted mt-0.5" />
                        <span className="text-cream">{restaurantData.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-cream-muted" />
                        <span className="text-cream">{restaurantData.contact_information}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-[#004240] rounded-xl p-4 border border-border/30">
                  <h3 className="text-sm font-medium text-cream mb-3">Order Summary</h3>
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
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-cream-muted">Discount {`(${((totalDiscount / (totalPrice + totalTax)) * 100).toFixed(0)}%)`}</span>
                        <span className="text-green-500">-₹{totalDiscount.toFixed(2)}</span>
                      </div>
                    )}
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
                      className={`w-full bg-muted/50 border rounded-xl py-4 pl-12 pr-4 text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all ${errors.name
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-border/50 focus:border-accent/50'
                        }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
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
                      maxLength={15}
                      className={`w-full bg-muted/50 border rounded-xl py-4 pl-12 pr-4 text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all ${errors.phone
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-border/50 focus:border-accent/50'
                        }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
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
                disabled={!isFormValid || isLoading}
                whileHover={isFormValid && !isLoading ? { scale: 1.02 } : {}}
                whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
                className={`w-full font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${isFormValid && !isLoading
                    ? 'bg-accent hover:bg-accent/90 text-accent-foreground'
                    : 'bg-muted text-cream-muted cursor-not-allowed'
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order - ₹{grandTotal.toFixed(2)}
                  </>
                )}
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
