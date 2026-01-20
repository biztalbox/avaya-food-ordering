import { motion } from 'framer-motion';
import { Leaf, Drumstick } from 'lucide-react';
import { MenuItem } from '@/types/menu';
import { useCart } from '@/context/CartContext';
import QuantityButton from './QuantityButton';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  isPizza?: boolean;
}

const MenuItemCard = ({ item, index, isPizza = false }: MenuItemCardProps) => {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        relative group bg-gradient-card rounded-xl overflow-hidden
        shadow-card hover:shadow-card-hover transition-all duration-300
        ${isPizza ? 'p-4' : 'p-3'}
        ${quantity > 0 ? 'ring-2 ring-accent' : 'ring-1 ring-border/30'}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Item Image Placeholder (circle) */}
        <div className={`
          ${isPizza ? 'w-16 h-16' : 'w-12 h-12'}
          rounded-full bg-muted flex-shrink-0 flex items-center justify-center
          overflow-hidden
        `}>
          <span className="text-2xl">
            {item.name.includes('Coffee') || item.name.includes('Espresso') || item.name.includes('Latte') || item.name.includes('Cappuccino') || item.name.includes('Mocha') || item.name.includes('Americano') || item.name.includes('Macchiato') || item.name.includes('Cold') ? '☕' :
             item.name.includes('Pancake') ? '🥞' :
             item.name.includes('Avocado') ? '🥑' :
             item.name.includes('Omelette') ? '🍳' :
             item.name.includes('Croissant') ? '🥐' :
             item.name.includes('Granola') ? '🥣' :
             item.name.includes('English') ? '🍳' :
             item.name.includes('Pizza') || item.name.includes('Margherita') || item.name.includes('Pepperoni') || item.name.includes('Formaggi') || item.name.includes('Chicken') || item.name.includes('Veggie') || item.name.includes('Truffle') || item.name.includes('BBQ') ? '🍕' :
             item.name.includes('Caesar') || item.name.includes('Greek') || item.name.includes('Quinoa') || item.name.includes('Garden') || item.name.includes('Asian') ? '🥗' :
             item.name.includes('Wrap') || item.name.includes('Falafel') || item.name.includes('Paneer') || item.name.includes('Turkey') || item.name.includes('Mexican') || item.name.includes('Shrimp') ? '🌯' :
             '🍽️'}
          </span>
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
          <p className="text-accent font-semibold mt-1 text-sm">${item.price.toFixed(2)}</p>
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
    </motion.div>
  );
};

export default MenuItemCard;
