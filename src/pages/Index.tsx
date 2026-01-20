import Header from '@/components/Header';
import HeroLanding from '@/components/HeroLanding';
import MenuSection from '@/components/MenuSection';
import FloatingCart from '@/components/FloatingCart';
import CartDrawer from '@/components/CartDrawer';
import CheckoutDrawer from '@/components/CheckoutDrawer';
import Footer from '@/components/Footer';
import { menuCategories } from '@/data/menuData';
import { CartProvider, useCart } from '@/context/CartContext';

const MenuContent = () => {
  const { searchQuery } = useCart();

  // When searching, show matching items at the top
  const sortedCategories = searchQuery
    ? [...menuCategories].sort((a, b) => {
        const aMatches = a.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ).length;
        const bMatches = b.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ).length;
        return bMatches - aMatches;
      })
    : menuCategories;

  return (
    <>
      {/* Menu Sections */}
      <main>
        {sortedCategories.map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
      </main>
    </>
  );
};

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <HeroLanding />
        <MenuContent />
        <Footer />
        <FloatingCart />
        <CartDrawer />
        <CheckoutDrawer />
      </div>
    </CartProvider>
  );
};

export default Index;
