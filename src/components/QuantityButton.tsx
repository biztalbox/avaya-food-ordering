import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface QuantityButtonProps {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  size?: 'sm' | 'md';
}

const QuantityButton = ({ quantity, onAdd, onRemove, size = 'sm' }: QuantityButtonProps) => {
  const buttonSize = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence mode="wait">
        {quantity > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRemove}
            className={`${buttonSize} rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors`}
          >
            <Minus className={`${iconSize} text-cream`} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {quantity > 0 && (
          <motion.span
            key={quantity}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="w-6 text-center font-medium text-cream text-sm"
          >
            {quantity}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAdd}
        className={`${buttonSize} rounded-full bg-accent hover:bg-accent/90 flex items-center justify-center transition-colors`}
      >
        <Plus className={`${iconSize} text-accent-foreground`} />
      </motion.button>
    </div>
  );
};

export default QuantityButton;
