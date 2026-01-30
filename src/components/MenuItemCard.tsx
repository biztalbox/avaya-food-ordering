import { Leaf, Drumstick, Plus } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useCart } from '@/context/CartContext';
import QuantityButton from './QuantityButton';
import { useState } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  isPizza?: boolean;
}

const PLACEHOLDER_IMAGE = '/placeholder.svg';

const MenuItemCard = ({ item, index, isPizza = false }: MenuItemCardProps) => {
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
      className={`
        relative bg-[#005755] rounded-xl overflow-hidden
        shadow-card
        ${isPizza ? 'p-4' : 'p-4'}
        ring-1 ring-border/30
        h-[120px] sm:h-[130px]
      `}
    >
      <div className="flex items-center gap-3">
        {/* Item Image */}
        <div className={`
          ${isPizza ? 'w-20 h-20' : 'w-16 h-16'}
          rounded-full bg-muted flex-shrink-0 flex items-center justify-center
          overflow-hidden
        `}>
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
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Veg/Non-Veg Indicator */}
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
              item.isVeg ? 'bg-green-500' : 'bg-red-500'
            }`} />
            
            <h4 className={`font-medium text-cream truncate ${isPizza ? 'text-lg' : 'text-base'}`}>
              {item.name}
            </h4>
            {item.isVeg !== undefined && (
              <span className={`flex-shrink-0 ${item.isVeg ? 'text-green-400' : 'text-orange-400'}`}>
                {item.isVeg ? <Leaf className="w-3.5 h-3.5" /> : <Drumstick className="w-3.5 h-3.5" />}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-cream-muted mt-1 truncate">{item.description}</p>
          )}
          
          {/* Show variations if available */}
          {item.variations && item.variations.length > 0 ? (
            <div className="mt-1">
              {/* Check if it's half plate/full plate pattern */}
              {item.variations.length === 2&& 
               item.variations.some(v => v.name.toLowerCase().includes('half')) &&
               item.variations.some(v => v.name.toLowerCase().includes('full')) ? (
                <div className="space-y-1">
                  {item.variations.map((variation) => {
                    const variationQuantity = getVariationQuantity(variation.id);
                    return (
                      <div key={variation.id} className="flex items-center justify-between gap-2">
                        <span className="text-sm text-cream-muted capitalize">
                          {variation.name}
                        </span>
                        <div className="flex items-center gap-1">
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
                            className="flex items-center gap-1 bg-[#004240] hover:bg-[#004240] text-[#B8936E] px-2 py-1 rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span className="text-sm font-semibold">₹{variation.price.toFixed(2)}</span>
                          </button>
                          {variationQuantity > 0 && (
                            <div className="flex items-center gap-1 bg-card/50 border border-border/50 rounded px-2 py-1">
                              <button
                                onClick={() => removeItem(item.id, variation.id)}
                                className="w-4 h-4 rounded-full bg-muted hover:bg-destructive/20 flex items-center justify-center text-cream-muted hover:text-destructive transition-colors"
                              >
                                <span className="text-xs leading-none">−</span>
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
                                className="w-4 h-4 rounded-full bg-[#004240] hover:bg-[#004240] flex items-center justify-center text-[#B8936E] transition-colors"
                              >
                                <span className="text-xs leading-none">+</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <p className="text-accent font-semibold text-base">
                    ₹{item.variations[0].price.toFixed(2)} - ₹{item.variations[item.variations.length - 1].price.toFixed(2)}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-cream-muted">
                    {item.variations.slice(0, 4).map((v) => (
                      <li key={v.id} className="flex items-center justify-between gap-2">
                        <span className="truncate">{v.name}</span>
                        <span className="text-cream">₹{v.price.toFixed(2)}</span>
                      </li>
                    ))}
                    {item.variations.length > 4 ? (
                      <li className="text-cream-muted">+{item.variations.length - 4} more</li>
                    ) : null}
                  </ul>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => addItem(item)}
                className="flex items-center gap-1 bg-[#004240] hover:bg-[#004240] text-[#B8936E] px-2 py-1 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span className="text-sm font-semibold">₹{item.price.toFixed(2)}</span>
              </button>
              {normalItemQuantity > 0 && (
                <div className="flex items-center gap-1 bg-card/50 border border-border/50 rounded px-2 py-1">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-4 h-4 rounded-full bg-muted hover:bg-destructive/20 flex items-center justify-center text-cream-muted hover:text-destructive transition-colors"
                  >
                    <span className="text-xs leading-none">−</span>
                  </button>
                  <span className="text-xs font-medium text-cream min-w-[12px] text-center">
                    {normalItemQuantity}
                  </span>
                  <button
                    onClick={() => addItem(item)}
                    className="w-4 h-4 rounded-full bg-[#004240] hover:bg-[#004240] flex items-center justify-center text-[#B8936E] transition-colors"
                  >
                    <span className="text-xs leading-none">+</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
