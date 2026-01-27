import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuCategory } from '@/types/menu';
import { useCart } from '@/context/CartContext';
import MenuItemCard from './MenuItemCard';

interface MenuSectionProps {
  category: MenuCategory;
}

const MenuSection = ({ category }: MenuSectionProps) => {
  const { searchQuery } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLeft = category.layout === 'left';
  const isPizza = category.name.toLowerCase().includes('pizza');
  const isSalad = category.name.toLowerCase().includes('salad');

  // Filter items based on search
  const filteredItems = category.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If searching and no items match, don't show section
  if (searchQuery && filteredItems.length === 0) {
    return null;
  }

  const getBgClass = () => {
    switch (category.bgVariant) {
      case 'dark':
        return 'bg-background';
      case 'light':
        return 'bg-secondary/30';
      default:
        return 'bg-primary/30';
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id={category.id} className={`${getBgClass()} py-0`}>
      {/* Hero Block - hide when searching */}
      {!searchQuery && (
        <div className={`relative min-h-[50vh] md:min-h-[60vh] flex items-center ${isPizza ? 'min-h-[70vh]' : ''}`}>
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={category.heroImage}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            {/* Minimal overlay for text readability */}
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Text Content */}
          <div className="relative container mx-auto px-6">
            <div
              className={`max-w-lg ${
                isPizza 
                  ? 'text-center mx-auto mt-auto pt-40' 
                  : isLeft 
                    ? 'mr-auto' 
                    : 'ml-auto text-right'
              }`}
            >
              <h2 className="heading-section text-white mb-3 drop-shadow-lg">
                {category.name}
              </h2>
              {category.tagline ? (
                <p className="text-white/90 text-lg md:text-xl drop-shadow-md">
                  {category.tagline}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Search result header */}
      {searchQuery && (
        <div className="container mx-auto px-6 pt-8">
          <h3 className="text-xl font-semibold text-cream">{category.name}</h3>
        </div>
      )}

      {/* Items Carousel */}
      <div className="container mx-auto px-6 py-8 md:py-12">
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-10 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-2 text-cream opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-10 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full p-2 text-cream opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-accent-foreground hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex-shrink-0 snap-start ${
                  isPizza ? 'w-[280px] md:w-[320px]' : 'w-[260px] md:w-[300px]'
                }`}
              >
                <MenuItemCard 
                  item={item} 
                  index={index}
                  isPizza={isPizza}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
