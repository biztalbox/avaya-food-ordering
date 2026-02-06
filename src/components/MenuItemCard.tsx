import { Leaf, Drumstick, Plus } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useCart } from '@/context/CartContext';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
}

const PLACEHOLDER_IMAGE = import.meta.env.VITE_BASE_URL + 'placeholder.jpg';
const veg_img = import.meta.env.VITE_BASE_URL + 'veg.png';
const non_veg_img = import.meta.env.VITE_BASE_URL + 'non-veg.png';

const MenuItemCard = ({ item, index }: MenuItemCardProps) => {
  const { addItem, removeItem, getItemQuantity } = useCart();
  
  // Calculate quantities for each variation
  const getVariationQuantity = (variationId: string) => {
    return getItemQuantity(item.id, variationId);
  };

  // Get quantity for normal items (without variations)
  const normalItemQuantity = getItemQuantity(item.id);

  const hasImage = item.image && item.image !== PLACEHOLDER_IMAGE;

  return (
    <div
      className="relative bg-secondary rounded-xl overflow-hidden shadow-card p-4 ring-1 ring-border/30"
    >
      <div className="flex gap-3">
        {/* Item Image */}
        <div className="w-16 h-16 rounded-full bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
          {hasImage ? (
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
            />
          ) : (
            <span className="text-2xl">🍽️</span>
          )}
        </div>

        {/* Item Details */}
        <div className="flex flex-col gap-1 w-full flex-grow">
          <div className="flex items-center gap-1">
            {/* Veg/Non-Veg Indicator */}
            <img src={item.isVeg ? veg_img : non_veg_img} alt="Veg/Non-Veg" className={`w-4 h-4`} />
            
            <h4 className="font-medium text-cream truncate text-base">
              {item.name.length > 20 ? item.name.slice(0, 20) + '...' : item.name}
            </h4>
            {/* {item.isVeg !== undefined && (
              <span className={`flex-shrink-0 ${item.isVeg ? 'text-green-400' : 'text-orange-400'}`}>
                {item.isVeg ? <Leaf className="w-3.5 h-3.5" /> : <Drumstick className="w-3.5 h-3.5" />}
              </span>
            )} */}
          </div>

          {/* {item.description && (
            <p className="text-sm text-cream-muted mt-1 truncate">{item.description}</p>
          )} */}
          
          {/* Show variations if available */}
          {item.variations && item.variations.length > 0 ? (
            <div className="flex flex-col gap-1">
              {/* Check if it's half plate/full plate pattern */}
              {item.variations.length === 2&& 
               item.variations.some(v => v.name.toLowerCase().includes('half')) &&
               item.variations.some(v => v.name.toLowerCase().includes('full')) ? (
                <div className="flex flex-col gap-1">
                  {item.variations.map((variation) => {
                    const variationQuantity = getVariationQuantity(variation.id);
                    return (
                      <div key={variation.id} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-cream-muted">
                          {variation.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {/* <button
                            onClick={() => {
                              const itemWithVariation = {
                                ...item,
                                price: variation.price,
                                selectedVariation: {
                                  id: variation.id,
                                  name: variation.name,
                                  price: variation.price
                                }
                              };
                              addItem(itemWithVariation);
                            }}
                            className="flex items-center gap-1 bg-[#004240] hover:bg-[#004240] text-[#B8936E] px-2 py-1 rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button> */}
                            <span className="text-sm text-accent font-semibold">₹{variation.price.toFixed(2)}</span>
                          {/* {variationQuantity > 0 && ( */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => removeItem(item.id, variation.id)}
                                className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white"
                              >
                                <span className="text-base -mt-1 leading-none">−</span>
                              </button>
                              <span className="text-xs font-medium text-cream min-w-[12px] text-center">
                                {variationQuantity}
                              </span>
                              <button
                                onClick={() => {
                                  const itemWithVariation = {
                                    ...item,
                                    price: variation.price,
                                    selectedVariation: {
                                      id: variation.id,
                                      name: variation.name,
                                      price: variation.price
                                    }
                                  };
                                  addItem(itemWithVariation);
                                }}
                                className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white"
                              >
                                <span className="text-base -mt-1 leading-none">+</span>
                              </button>
                            </div>
                          {/* )} */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {item.variations.map((variation) => {
                    const variationQuantity = getVariationQuantity(variation.id);
                    return (
                      <div key={variation.id} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-cream-muted truncate">
                          {variation.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-accent font-semibold">₹{variation.price.toFixed(2)}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => removeItem(item.id, variation.id)}
                              className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white"
                            >
                              <span className="text-base -mt-1 leading-none">−</span>
                            </button>
                            <span className="text-xs font-medium text-cream min-w-[12px] text-center">
                              {variationQuantity}
                            </span>
                            <button
                              onClick={() => {
                                const itemWithVariation = {
                                  ...item,
                                  price: variation.price,
                                  selectedVariation: {
                                    id: variation.id,
                                    name: variation.name,
                                    price: variation.price
                                  }
                                };
                                addItem(itemWithVariation);
                              }}
                              className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white"
                            >
                              <span className="text-base -mt-1 leading-none">+</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              {/* <button
                onClick={() => addItem(item)}
                className="flex items-center gap-1 bg-[#004240] hover:bg-[#004240] text-[#B8936E] px-2 py-1 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button> */}
                <span className="text-sm text-accent font-semibold">₹{item.price.toFixed(2)}</span>
              {/* {normalItemQuantity > 0 && ( */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white"
                  >
                    <span className="text-base -mt-1 leading-none">−</span>
                  </button>
                  <span className="text-base font-medium text-cream min-w-[12px] text-center">
                    {normalItemQuantity}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center text-white"
                  >
                    <span className="text-base leading-none">+</span>
                  </button>
                </div>
              {/* )} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
