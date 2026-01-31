import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Utensils } from 'lucide-react';

const SukhdeviViharTableRequired = () => {
  const [tableNumber, setTableNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) return;
    
    setIsLoading(true);
    // Redirect with table number to sukhdevi vihar page
    window.location.href = `/sukhdevvihar?q=${tableNumber.trim()}`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-card/50 backdrop-blur-md rounded-2xl p-8 border border-border/30 shadow-xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <Store className="w-8 h-8 text-accent-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-cream mb-2">Table Number Required</h1>
            <p className="text-cream-muted text-sm">
              To view the menu, please enter your table or room number below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="table" className="block text-sm font-medium text-cream mb-2">
                Table / Room Number
              </label>
              <input
                type="text"
                id="table"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Enter your table number"
                className="w-full px-4 py-3 bg-muted/50 border border-accent rounded-xl text-cream placeholder:text-cream-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!tableNumber.trim() || isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Utensils className="w-5 h-5" />
                  Submit
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-cream-muted">
              Avaya Cafe & Bakery • Sukhdevi Vihar • Fine Dining Experience
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SukhdeviViharTableRequired;
