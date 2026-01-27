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

export interface APITax {
  taxid: string;
  taxname: string;
  tax: string;
  taxtype: string;
  tax_ordertype: string;
  active: string;
  tax_coreortotal: string;
  tax_taxtype: string;
  rank: string;
  consider_in_core_amount: string;
  description: string;
}

export interface APIMenuResponse {
  success: boolean;
  message?: string;
  restaurant_id?: string;
  menu?: {
    success?: string;
    message?: string;
    restaurants?: any[];
    ordertypes?: any[];
    group_categories?: any[];
    categories?: APICategory[];
    items?: APIItem[];
    variations?: any[];
    addongroups?: any[];
    attributes?: any[];
    taxes?: APITax[];
    discounts?: any[];
    serverdatetime?: string;
    db_version?: string;
    application_version?: string;
    http_code?: number;
    error?: string;
  };
  metadata?: {
    id: number;
    status: string;
    created_at: string;
    updated_at: string;
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
  selectedVariation?: {
    id: string;
    name: string;
    price: number;
  };
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
