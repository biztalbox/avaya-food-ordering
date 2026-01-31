import Header from '@/components/Header';
import MenuSection from '@/components/MenuSection';
import FloatingCart from '@/components/FloatingCart';
import CartDrawer from '@/components/CartDrawer';
import CheckoutDrawer from '@/components/CheckoutDrawer';
import Footer from '@/components/Footer';
import SukhdeviViharTableRequired from '@/components/SukhdeviViharTableRequired';
import { useMenuData } from '@/hooks/useMenuData';
import { CartProvider, useCart } from '@/context/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

const SukhdeviViharMenuContent = () => {
  const { searchQuery } = useCart();
  const { data: menuData, isLoading, error } = useMenuData();
  const menuCategories = menuData?.categories;
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  useEffect(() => {
    // Check if table number is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get('q');
    setTableNumber(table);
  }, []);

  // Show SukhdeviViharTableRequired component if no table number
  if (!tableNumber) {
    return <SukhdeviViharTableRequired />;
  }

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[300px] w-full rounded-xl" />
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-24 w-[280px] rounded-xl flex-shrink-0" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="text-center text-cream">
          <h2 className="text-2xl font-semibold mb-2">Unable to load menu</h2>
          <p className="text-cream-muted">Please try again later.</p>
        </div>
      </main>
    );
  }

  if (!menuCategories || menuCategories.length === 0) {
    return (
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="text-center text-cream">
          <h2 className="text-2xl font-semibold mb-2">No menu items available</h2>
          <p className="text-cream-muted">Please check back later.</p>
        </div>
      </main>
    );
  }

  // When searching, show matching items at the top
  const sortedCategories = searchQuery
    ? [...menuCategories].sort((a, b) => {
        const aMatches = a.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).length;
        const bMatches = b.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).length;
        return bMatches - aMatches;
      })
    : menuCategories;

  return (
    <main className="pt-20">
      {sortedCategories.map((category) => (
        <MenuSection key={category.id} category={category} />
      ))}
    </main>
  );
};

const SukhdeviVihar = () => {
  const [tableNumber, setTableNumber] = useState<string | null>(null);

  useEffect(() => {
    // Check if table number is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const table = urlParams.get('q');
    setTableNumber(table);
  }, []);

  // Show SukhdeviViharTableRequired component if no table number
  if (!tableNumber) {
    return <SukhdeviViharTableRequired />;
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-background pt-36 md:pt-20">
        <Header />
        <SukhdeviViharMenuContent />
        <Footer />
        <FloatingCart />
        <CartDrawer />
        <CheckoutDrawer />
      </div>
    </CartProvider>
  );
};

export default SukhdeviVihar;
