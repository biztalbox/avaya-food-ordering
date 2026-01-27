import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { APIMenuResponse, MenuCategory, MenuItem } from '@/types/menu';
import heroCoffee from '@/assets/hero-coffee.jpg';
import heroBreakfast from '@/assets/hero-breakfast.jpg';
import heroPizza from '@/assets/hero-pizza.jpg';
import heroSalad from '@/assets/hero-salad.jpg';
import heroRolls from '@/assets/hero-rolls.jpg';

const PLACEHOLDER_IMAGE = '/placeholder.svg';

// Hero images for categories (fallback)
const categoryHeroImages: Record<string, string> = {
  breakfast: heroBreakfast,
  coffee: heroCoffee,
  pizza: heroPizza,
  salad: heroSalad,
  rolls: heroRolls,
};

const getLayout = (index: number): 'left' | 'right' => {
  return index % 2 === 0 ? 'right' : 'left';
};

const getBgVariant = (index: number): 'default' | 'dark' | 'light' => {
  const variants: ('default' | 'dark' | 'light')[] = ['default', 'dark', 'light'];
  return variants[index % 3];
};

const getHeroImage = (categoryName: string, categoryImageUrl: string): string => {
  // If API provides an image, use it
  if (categoryImageUrl && categoryImageUrl.trim() !== '') {
    return categoryImageUrl;
  }
  
  // Fallback to local hero images based on category name
  const normalizedName = categoryName.toLowerCase();
  for (const [key, image] of Object.entries(categoryHeroImages)) {
    if (normalizedName.includes(key)) {
      return image;
    }
  }
  
  // Default fallback
  return heroCoffee;
};

const fetchMenuData = async (): Promise<MenuCategory[]> => {
  console.log('Fetching menu via edge function...');
  
  const { data, error } = await supabase.functions.invoke('fetch-menu');
  
  if (error) {
    console.error('Edge function error:', error);
    throw new Error('Failed to fetch menu data');
  }

  const apiData: APIMenuResponse = data;
  
  if (!apiData || !apiData.menu) {
    throw new Error('Invalid menu data received');
  }
  
  // Sort categories by rank (show ALL categories from API)
  const categories = (apiData.menu.categories ?? []).sort(
    (a, b) => parseInt(a.categoryrank || '0') - parseInt(b.categoryrank || '0')
  );
  
  // Map API data to app format
  const allItems = apiData.menu.items ?? [];

  const menuCategories: MenuCategory[] = categories.map((category, index) => {
    // Get items for this category
    const categoryItems = allItems
      .filter(item => item.item_categoryid === category.categoryid)
      .sort((a, b) => parseInt(a.itemrank || '0') - parseInt(b.itemrank || '0'))
      .map(item => {
        const menuItem: MenuItem = {
          id: item.itemid,
          name: item.itemname,
          price: parseFloat(item.price) || 0,
          description: item.itemdescription || '',
          image: item.item_image_url && item.item_image_url.trim() !== '' 
            ? item.item_image_url 
            : PLACEHOLDER_IMAGE,
          // item_attributeid: 1 = Veg, 2 = Non-Veg
          isVeg: item.item_attributeid === '1',
        };
        
        // Add variations if available
        if (item.variation && item.variation.length > 0) {
          menuItem.variations = item.variation
            .sort((a, b) => parseInt(a.variationrank || '0') - parseInt(b.variationrank || '0'))
            .map(v => ({
              id: v.variationid,
              name: v.variationname,
              price: parseFloat(v.variationprice) || 0,
            }));
        }
        
        return menuItem;
      });
    
    return {
      id: category.categoryid,
      name: category.categoryname,
      tagline: '',
      heroImage: getHeroImage(category.categoryname, category.category_image_url),
      items: categoryItems,
      layout: getLayout(index),
      bgVariant: getBgVariant(index),
    };
  });
  
  return menuCategories;
};

export const useMenuData = () => {
  return useQuery({
    queryKey: ['menuData'],
    queryFn: fetchMenuData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
