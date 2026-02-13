import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, MenuItem, APIDiscount } from '@/types/menu';
import { useMenuData } from '@/hooks/useMenuData';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string, variationId?: string) => void;
  getItemQuantity: (itemId: string, variationId?: string) => number;
  totalItems: number;
  totalPrice: number;
  totalTax: number;
  totalPriceWithTax: number;
  totalDiscount: number;
  totalPriceWithDiscount: number;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'veg' | 'non-veg';
  setFilterType: (type: 'all' | 'veg' | 'non-veg') => void;
  appliedCoupon: APIDiscount | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [appliedCoupon, setAppliedCoupon] = useState<APIDiscount | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const { data: menuData } = useMenuData();
  const taxes = menuData?.taxes || [];
  const discounts = menuData?.discounts || [];

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);


  const applyCoupon = useCallback((code: string) => {
    if (!code) {
      return { success: false, message: 'Please enter a coupon code' };
    }

    const normalizedCode = code.toLowerCase().trim();

    // Find matching discount in API data
    const matchedDiscount = discounts.find(d =>
      d.discountname.toLowerCase() === normalizedCode &&
      d.active === '1'
    );

    if (!matchedDiscount) {
      return { success: false, message: 'Invalid coupon code' };
    }

    // Check minimum order amount
    const minAmount = parseFloat(matchedDiscount.discountminamount || '0');
    if (minAmount > 0 && totalPrice < minAmount) {
      return { success: false, message: `Minimum order amount of ₹${minAmount} required` };
    }

    // Calculate discount amount
    const discountType = parseInt(matchedDiscount.discounttype);
    const discountValue = parseFloat(matchedDiscount.discount);
    const maxAmount = parseFloat(matchedDiscount.discountmaxamount || '0');

    let calculatedDiscount = 0;

    if (discountType === 1) { // Percentage
      calculatedDiscount = (totalPrice * discountValue) / 100;
    } else if (discountType === 2) { // Fixed
      calculatedDiscount = discountValue;
    }

    // Apply maximum limit
    if (maxAmount > 0 && calculatedDiscount > maxAmount) {
      calculatedDiscount = maxAmount;
    }

    setAppliedCoupon(matchedDiscount);
    setCouponDiscount(calculatedDiscount);

    return { success: true, message: 'Coupon applied successfully' };
  }, [discounts, totalPrice]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  }, []);

  const addItem = useCallback((item: MenuItem) => {
    setItems(prev => {
      // Create a unique ID for items with variations
      const uniqueId = item.selectedVariation
        ? `${item.id}-${item.selectedVariation.id}`
        : item.id;

      const existing = prev.find(i =>
        i.id === item.id &&
        (!item.selectedVariation || i.selectedVariation?.id === item.selectedVariation.id)
      );

      if (existing) {
        return prev.map(i =>
          (i.id === item.id &&
            (!item.selectedVariation || i.selectedVariation?.id === item.selectedVariation.id))
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    // Scroll to menu section after adding item
    setTimeout(() => {
      // Try multiple selectors to find menu sections
      let menuSection = document.querySelector('section[id^="category-"]');

      // If not found, try other common selectors
      if (!menuSection) {
        menuSection = document.querySelector('[class*="menu-section"]') ||
          document.querySelector('[class*="category"]') ||
          document.querySelector('main') ||
          document.querySelector('.container');
      }

      // As a last resort, scroll to top of page
      if (!menuSection) {
        window.scrollTo({ top: 200, behavior: 'smooth' });
        return;
      }

      console.log('Found menu section:', menuSection);
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }, []);

  const removeItem = useCallback((itemId: string, variationId?: string) => {
    setItems(prev => {
      const existing = prev.find(i =>
        i.id === itemId &&
        (!variationId || i.selectedVariation?.id === variationId)
      );

      if (existing && existing.quantity > 1) {
        return prev.map(i =>
          (i.id === itemId &&
            (!variationId || i.selectedVariation?.id === variationId))
            ? { ...i, quantity: i.quantity - 1 }
            : i
        );
      }
      return prev.filter(i =>
        !(i.id === itemId &&
          (!variationId || i.selectedVariation?.id === variationId))
      );
    });
  }, []);

  const getItemQuantity = useCallback((itemId: string, variationId?: string) => {
    return items.find(i =>
      i.id === itemId &&
      (!variationId || i.selectedVariation?.id === variationId)
    )?.quantity || 0;
  }, [items]);




  // Calculate taxes
  const totalTax = taxes.filter(tax => tax && tax.tax && parseFloat(tax.tax) > 0).reduce((sum, tax) => {
    const taxRate = parseFloat(tax.tax) / 100;
    return sum + (totalPrice * taxRate);
  }, 0);

  const totalPriceWithTax = totalPrice + totalTax;

  // Calculate discounts - only apply if there are active discounts
  const totalDiscount = discounts.length > 0 ? discounts.reduce((sum, discount) => {
    if (discount.active !== 'true') return sum;

    const discountType = parseInt(discount.discounttype);
    const discountAmount = parseFloat(discount.discount);
    const minAmount = parseFloat(discount.discountminamount);
    const maxAmount = parseFloat(discount.discountmaxamount);
    const ignoreDiscount = parseInt(discount.ignore_discount || '0');

    // Check if order meets minimum amount requirement
    if (totalPrice < minAmount) return sum;

    // Check if discount should be ignored (ignore_discount: 0 means apply discount)
    if (ignoreDiscount !== 0) return sum;

    let calculatedDiscount = 0;

    if (discountType === 1) { // Percentage discount
      calculatedDiscount = (totalPrice * discountAmount) / 100;
    } else if (discountType === 2) { // Fixed discount
      calculatedDiscount = discountAmount;
    }

    // Apply maximum discount limit if specified
    if (maxAmount > 0 && calculatedDiscount > maxAmount) {
      calculatedDiscount = maxAmount;
    }

    return sum + calculatedDiscount;
  }, 0) : 0;

  // No temporary discount - only use API discounts
  const finalTotalDiscount = totalDiscount;

  const totalPriceWithDiscount = totalPriceWithTax - finalTotalDiscount - couponDiscount;

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      getItemQuantity,
      totalItems,
      totalPrice,
      totalTax,
      totalPriceWithTax,
      totalDiscount: finalTotalDiscount,
      totalPriceWithDiscount,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      searchQuery,
      setSearchQuery,
      filterType,
      setFilterType,
      appliedCoupon,
      couponDiscount,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
