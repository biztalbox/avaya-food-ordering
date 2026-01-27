// API Response Types
export interface APIVariation {
  variationid: string;
  name: string;
  price: string;
  variationrank?: string;
  active?: string;
  in_stock?: string;
}

export interface APIItem {
  itemid: string;
  itemname: string;
  price: string;
  itemdescription: string;
  item_categoryid: string;
  item_image_url: string;
  item_attributeid: string;
  itemallowvariation: string;
  itemrank?: string;
  variation: APIVariation[];
  active: string;
  in_stock: string;
}

export interface APICategory {
  categoryid: string;
  categoryname: string;
  category_image_url: string;
  categoryrank: string;
  active: string;
}

export interface APIMenuResponse {
  success: boolean;
  message?: string;
  restaurant_id?: string;
  menu?: {
    categories?: APICategory[];
    items?: APIItem[];
  };
}

// App Types
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  isVeg?: boolean;
  variations?: {
    id: string;
    name: string;
    price: number;
  }[];
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
  selectedVariation?: {
    id: string;
    name: string;
    price: number;
  };
}
