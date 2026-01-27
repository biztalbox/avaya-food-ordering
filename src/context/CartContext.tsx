import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, MenuItem } from '@/types/menu';
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
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: menuData } = useMenuData();
  const taxes = menuData?.taxes || [];

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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate taxes
  const totalTax = taxes.reduce((sum, tax) => {
    const taxRate = parseFloat(tax.tax) / 100;
    return sum + (totalPrice * taxRate);
  }, 0);
  
  const totalPriceWithTax = totalPrice + totalTax;

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
      clearCart,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      searchQuery,
      setSearchQuery
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
