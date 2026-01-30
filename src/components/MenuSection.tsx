import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuCategory } from '@/types/menu';
import { useCart } from '@/context/CartContext';
import MenuItemCard from './MenuItemCard';

interface MenuSectionProps {
  category: MenuCategory;
}

const MenuSection = ({ category }: MenuSectionProps) => {
  const { searchQuery, filterType } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLeft = category.layout === 'left';

  // Filter items based on search and veg/non-veg filter
  const filteredItems = category.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') {
      return matchesSearch;
    }
    
    // Filter by item_attributeid: 1 = veg, 2 or 24 = non-veg
    const isVeg = item.isVeg; // This should be set based on item_attributeid in useMenuData
    const matchesFilter = filterType === 'veg' ? isVeg : !isVeg;
    
    return matchesSearch && matchesFilter;
  });

  // If searching or filtering and no items match, don't show section
  if ((searchQuery || filterType !== 'all') && filteredItems.length === 0) {
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

  const SampleCategoryImage = import.meta.env.VITE_BASE_URL + 'sample_cat.jpeg';

  return (
        <section id={category.id} className={`${getBgClass()} py-0`}>
      {/* Hero Block - hide when searching */}
      {!searchQuery && (
        <div className={`relative min-h-[120px] md:min-h-[180px] flex items-center`}>
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={category.heroImage && category.heroImage.trim() !== '' ? category.heroImage : SampleCategoryImage}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = SampleCategoryImage; }}
            />
            {/* Minimal overlay for text readability */}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Text Content */}
          <div className="relative container mx-auto px-6">
            <div
              className={`max-w-lg ${isLeft ? 'mr-auto' : 'ml-auto text-right'}`}
            >
              <h2 className="text-3xl uppercase stroke-2 stroke-white font-normal tracking-wider text-white mb-3 drop-shadow-lg">
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
          <h3 className="text-xl font-semibold text-light">{category.name}</h3>
        </div>
      )}

      {/* Items Carousel */}
      <div className="container mx-auto px-6 pt-8 pb-24">
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
            className="flex gap-4 overflow-x-scroll pb-2 -mx-2 px-2 custom-scrollbar"
          >
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 snap-start w-[280px] md:w-[320px]"
              >
                <MenuItemCard
                  item={item}
                  index={index}
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
