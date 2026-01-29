import { useQuery } from '@tanstack/react-query';
import { APIMenuResponse, MenuCategory, MenuItem, APITax, APIDiscount } from '@/types/menu';
import heroCoffee from '@/assets/hero-coffee.jpg';
const heroBreakfast = 'https://images.unsplash.com/photo-1542276867-c7f5032e1835?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJyZWFrZmFzdHxlbnwwfHwwfHx8MA%3D%3D';
import heroPizza from '@/assets/hero-pizza.jpg';
import heroSalad from '@/assets/hero-salad.jpg';
import heroRolls from '@/assets/hero-rolls.jpg';

// Restaurant data interface
export interface RestaurantData {
  restID: string;
  res_name: string;
  address: string;
  contact_information: string;
}

// Dummy images for food items when API doesn't provide images
const dummyFoodImages = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&crop=center&q=80', // Pizza
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&crop=center&q=80', // Burger
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center&q=80', // Coffee
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center&q=80', // Sandwich
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center&q=80', // Pasta
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop&crop=center&q=80', // Salad
  'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop&crop=center&q=80', // Cake
  'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop&crop=center&q=80', // Breakfast
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&crop=center&q=80', // Drink
  'https://images.unsplash.com/photo-1506354666793-36e9caf08faa?w=400&h=300&fit=crop&crop=center&q=80' // Dessert
];

// Category-specific dummy images for better relevance
const categorySpecificImages: Record<string, string[]> = {
  coffee: [
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=center&q=80'
  ],
  pizza: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&crop=center&q=80'
  ],
  breakfast: [
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1506354666793-36e9caf08faa?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop&crop=center&q=80'
  ],
  salad: [
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center&q=80'
  ],
  rolls: [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center&q=80'
  ]
};

// High-quality hero images for categories when API doesn't provide images
const dummyHeroImages = [
  'https://images.unsplash.com/photo-1542276867-c7f5032e1835?w=1200&h=600&auto=format&fit=crop&q=80&ixlib=rb-4.1.0', // Breakfast
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&h=600&fit=crop&crop=center&q=80', // Coffee
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&h=600&fit=crop&crop=center&q=80', // Pizza
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&h=600&fit=crop&crop=center&q=80', // Salad
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop&crop=center&q=80'  // Sandwich/Rolls
];

// Get a dummy hero image based on category name for consistency
const getDummyHeroImage = (categoryName: string): string => {
  const nameHash = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = nameHash % dummyHeroImages.length;
  return dummyHeroImages[index];
};

// Get a dummy image based on item name for consistency
const getDummyImage = (itemName: string, itemId: string, categoryName?: string): string => {
  // First try to use category-specific images if category name is provided
  if (categoryName) {
    const normalizedName = categoryName.toLowerCase();
    for (const [key, images] of Object.entries(categorySpecificImages)) {
      if (normalizedName.includes(key)) {
        const nameHash = itemName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = nameHash % images.length;
        return images[index];
      }
    }
  }
  
  // Fallback to general dummy images
  const nameHash = itemName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = nameHash % dummyFoodImages.length;
  return dummyFoodImages[index];
};

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
  
  // Final fallback to dummy hero images
  return getDummyHeroImage(categoryName);
};

const fetchMenuData = async (): Promise<{ categories: MenuCategory[], taxes: APITax[], discounts: APIDiscount[] }> => {
  const endpoint =
    (import.meta.env.VITE_MENU_API_URL as string | undefined) ??
    'https://avayacafe.com/online-order/api/fetchMenu.php';

  const restaurantId = import.meta.env.VITE_RESTAURANT_ID as string | undefined;

  const url = new URL(endpoint, window.location.origin);
  if (restaurantId && restaurantId.trim() !== '') {
    url.searchParams.set('restaurant_id', restaurantId.trim());
  }

  const res = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Menu API request failed (${res.status})`);
  }

  const apiData = (await res.json()) as APIMenuResponse;

  if (!apiData?.success || !apiData.menu) {
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
            : getDummyImage(item.itemname, item.itemid, category.categoryname),
          // item_attributeid: 1 = Veg, 2 = Non-Veg
          isVeg: item.item_attributeid === '1',
        };
        
        // Add variations if available
        if (item.variation && item.variation.length > 0) {
          menuItem.variations = item.variation
            .sort((a, b) => parseInt(a.variationrank || '0') - parseInt(b.variationrank || '0'))
            .map(v => ({
              id: v.variationid,
              name: v.name,
              price: parseFloat(v.price) || 0,
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
  
  // Extract and store restaurant details in localStorage
  const restaurantDetails = apiData.menu?.restaurants?.[0]?.details;
  
  if (restaurantDetails) {
    const restaurantData: RestaurantData = {
      restID: apiData.restaurant_id || restaurantDetails.restaurantid || 'xxxxxx',
      res_name: restaurantDetails.restaurantname || 'Unknown Restaurant',
      address: restaurantDetails.address || 'Address not available',
      contact_information: restaurantDetails.contact || 'Contact not available'
    };
    
    // Store restaurant data in localStorage
    localStorage.setItem('restaurantData', JSON.stringify(restaurantData));
    console.log('Restaurant data stored in localStorage:', restaurantData);
  }
  
  return {
    categories: menuCategories,
    taxes: apiData.menu?.taxes || [],
    discounts: apiData.menu?.discounts || []
  };
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

// Hook to get restaurant data from localStorage
export const useRestaurantData = (): RestaurantData | null => {
  try {
    const storedData = localStorage.getItem('restaurantData');
    if (storedData) {
      return JSON.parse(storedData) as RestaurantData;
    }
    return null;
  } catch (error) {
    console.error('Error reading restaurant data from localStorage:', error);
    return null;
  }
};
