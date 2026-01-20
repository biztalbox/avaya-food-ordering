export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  isVeg?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  tagline: string;
  heroImage: string;
  items: MenuItem[];
  layout?: 'left' | 'right';
  bgVariant?: 'default' | 'dark' | 'light';
}

export interface CartItem extends MenuItem {
  quantity: number;
}
