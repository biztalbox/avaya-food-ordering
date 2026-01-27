import { Leaf, Drumstick } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useCart } from '@/context/CartContext';
import QuantityButton from './QuantityButton';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  isPizza?: boolean;
}

const PLACEHOLDER_IMAGE = '/placeholder.svg';

const MenuItemCard = ({ item, index, isPizza = false }: MenuItemCardProps) => {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const hasImage = item.image && item.image !== PLACEHOLDER_IMAGE;

  return (
    <div
      className={`
        relative bg-gradient-card rounded-xl overflow-hidden
        shadow-card
        ${isPizza ? 'p-4' : 'p-3'}
        ${quantity > 0 ? 'ring-2 ring-accent' : 'ring-1 ring-border/30'}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Item Image */}
        <div className={`
          ${isPizza ? 'w-16 h-16' : 'w-12 h-12'}
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
            <h4 className={`font-medium text-cream truncate ${isPizza ? 'text-base' : 'text-sm'}`}>
              {item.name}
            </h4>
            {item.isVeg !== undefined && (
              <span className={`flex-shrink-0 ${item.isVeg ? 'text-green-400' : 'text-orange-400'}`}>
                {item.isVeg ? <Leaf className="w-3.5 h-3.5" /> : <Drumstick className="w-3.5 h-3.5" />}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-cream-muted mt-0.5 truncate">{item.description}</p>
          )}
          
          {/* Show variations if available */}
          {item.variations && item.variations.length > 0 ? (
            <div className="mt-1">
              <p className="text-accent font-semibold text-sm">
                ₹{item.variations[0].price.toFixed(2)} - ₹{item.variations[item.variations.length - 1].price.toFixed(2)}
              </p>

              <ul className="mt-1 space-y-0.5 text-xs text-cream-muted">
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
            </div>
          ) : (
            <p className="text-accent font-semibold mt-1 text-sm">₹{item.price.toFixed(2)}</p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex-shrink-0">
          <QuantityButton
            quantity={quantity}
            onAdd={() => addItem(item)}
            onRemove={() => removeItem(item.id)}
            size={isPizza ? 'md' : 'sm'}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
