import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus, Plus } from 'lucide-react';
import { MenuItem, SelectedAddon } from '@/types/menu';
import { Button } from '@/components/ui/button';

const MIN_QTY = 1;
const MAX_QTY = 20;

interface AddonModalProps {
  item: MenuItem;
  onConfirm: (selectedAddons: SelectedAddon[], quantity: number) => void;
  onClose: () => void;
}

export default function AddonModal({ item, onConfirm, onClose }: AddonModalProps) {
  const groups = item.addonGroups ?? [];
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    groups.forEach((g) => (init[g.groupId] = []));
    return init;
  });

  const selectedAddonsList = useMemo((): SelectedAddon[] => {
    const list: SelectedAddon[] = [];
    groups.forEach((group) => {
      const selectedIds = selections[group.groupId] ?? [];
      selectedIds.forEach((addonItemId) => {
        const option = group.items.find((i) => i.id === addonItemId);
        if (option) {
          list.push({
            addonItemId: option.id,
            addonItemName: option.name,
            addonGroupId: group.groupId,
            addonGroupName: group.groupName,
            price: option.price,
          });
        }
      });
    });
    return list;
  }, [groups, selections]);

  const addonsTotal = selectedAddonsList.reduce((sum, a) => sum + a.price, 0);
  const unitTotal = item.price + addonsTotal;
  const totalForQuantity = unitTotal * quantity;

  const validation = useMemo(() => {
    let valid = true;
    const messages: string[] = [];
    groups.forEach((group) => {
      const count = (selections[group.groupId] ?? []).length;
      if (count < group.min) {
        valid = false;
        messages.push(`${group.groupName}: choose at least ${group.min}`);
      }
      if (count > group.max) {
        valid = false;
        messages.push(`${group.groupName}: choose at most ${group.max}`);
      }
    });
    return { valid, messages };
  }, [groups, selections]);

  const toggleAddon = (groupId: string, addonItemId: string, max: number) => {
    setSelections((prev) => {
      const current = prev[groupId] ?? [];
      const exists = current.includes(addonItemId);
      if (exists) {
        return { ...prev, [groupId]: current.filter((id) => id !== addonItemId) };
      }
      if (current.length >= max) {
        if (max === 1) return { ...prev, [groupId]: [addonItemId] };
        return prev;
      }
      return { ...prev, [groupId]: [...current, addonItemId] };
    });
  };

  const handleAddToCart = () => {
    if (!validation.valid) return;
    onConfirm(selectedAddonsList, quantity);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative z-10 flex flex-col items-center w-full max-w-lg">
          {/* Close button - outside box, top center */}
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-background/90 hover:bg-muted border border-border/50 text-cream-muted hover:text-cream transition-colors shadow-lg mb-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal */}
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-background border border-border shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-border flex-shrink-0">
            <div>
              <h3 className="text-lg font-semibold text-cream">{item.name}</h3>
              <p className="text-sm text-cream-muted mt-0.5">
                Choose add-ons below. Base price ₹{item.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(MIN_QTY, q - 1))}
                disabled={quantity <= MIN_QTY}
                className="w-8 h-8 rounded-md flex items-center justify-center text-cream hover:bg-accent/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-cream font-semibold min-w-[28px] text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
                disabled={quantity >= MAX_QTY}
                className="w-8 h-8 rounded-md flex items-center justify-center text-cream hover:bg-accent/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Addon groups */}
          <div className="overflow-y-auto flex-1 p-5 space-y-6">
            {groups.map((group) => {
              const selectedIds = selections[group.groupId] ?? [];
              const isSingle = group.max === 1;
              return (
                <div key={group.groupId} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-cream">{group.groupName}</h4>
                    <span className="text-xs text-cream-muted">
                      {group.min === group.max
                        ? `Choose ${group.min}`
                        : `Choose ${group.min}–${group.max}`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((option) => {
                      const isSelected = selectedIds.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleAddon(group.groupId, option.id, group.max)}
                          className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border-2 text-left transition-all ${isSelected
                              ? 'border-accent bg-accent/10 text-cream'
                              : 'border-border/50 bg-muted/30 text-cream hover:border-accent/50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-accent bg-accent' : 'border-cream-muted'
                                }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-background" />}
                            </div>
                            <span className="font-medium">{option.name}</span>
                          </div>
                          <span className="text-accent font-semibold">
                            {option.price > 0 ? `+₹${option.price.toFixed(2)}` : 'Free'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Validation messages */}
          {!validation.valid && validation.messages.length > 0 && (
            <div className="px-5 pb-2 flex-shrink-0">
              <p className="text-sm text-amber-500">
                {validation.messages.join('. ')}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="p-5 border-t border-border flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between text-cream text-sm">
              <span>₹{unitTotal.toFixed(2)} × {quantity}</span>
              <span className="font-semibold text-accent">₹{totalForQuantity.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!validation.valid}
              className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold py-3 rounded-xl disabled:opacity-50 disabled:pointer-events-none"
            >
              Add to cart — ₹{totalForQuantity.toFixed(2)}
            </Button>
          </div>
        </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
