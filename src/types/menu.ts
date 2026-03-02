// API Response Types
export interface APIVariation {
  variationid: string;
  name: string;
  price: string;
  variationrank?: string;
  active?: string;
  in_stock?: string;
}

// API addon types (from fetchMenu response)
export interface APIAddonGroupRef {
  addon_group_id: string;
  addon_item_selection_min: string;
  addon_item_selection_max: string;
}

export interface APIAddonItem {
  addonitemid: string;
  addonitem_name: string;
  addonitem_price: string;
  addonitem_rank?: string;
  active?: string;
  attributes?: string;
}

export interface APIAddonGroup {
  addongroupid: string;
  addongroup_name: string;
  addongroup_rank?: string;
  active?: string;
  addongroupitems: APIAddonItem[];
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
  itemallowaddon?: string;
  itemaddonbasedon?: string;
  itemrank?: string;
  variation: APIVariation[];
  addon?: APIAddonGroupRef[];
  active: string;
  in_stock: string;
  ignore_taxes?: string;  // "0" = tax inclusive, else not
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

export interface APIDiscount {
  discountid: string;
  discountname: string;
  discounttype: string;  // 1=Percentage, 2=Fixed, 3=BOGO OR BXGY, 7=Freebie
  bogobuyqty: string;
  bogogetqty: string;
  bogotype: string;  // 1 = percentage
  discount: string;  // discount amount
  bogoapplicableonpurchase: string;
  bogoapplicableonpurchaseitemids: string;
  bogoapplicableon: string;
  bogoapplicableonitemids: string;
  bogoapplicableonitem: string;
  bogoitemamountlimit: string;
  bogopurchasediscount: string;
  bogoapplicableonpurchaseitem: string;
  discountordertype: string;
  discountapplicableon: string;
  discountdays: string;
  discountontotal: string;
  discountstarts: string;
  discountends: string;
  discounttimefrom: string;
  discounttimeto: string;
  discountminamount: string;
  discountmaxamount: string;
  freebie_item_count: string;
  freebie_item_ids: string;
  discounthascoupon: string;
  discountcategoryitemids: string;
  active: string;
  discountmaxlimit: string;
  rank: string;
  ignore_discount?: string;  // 0 = apply discount, 1 = ignore discount
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
    discounts?: APIDiscount[];
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

// App addon types
export interface AddonItemOption {
  id: string;
  name: string;
  price: number;
  rank?: number;
}

export interface AddonGroup {
  groupId: string;
  groupName: string;
  min: number;
  max: number;
  items: AddonItemOption[];
}

export interface SelectedAddon {
  addonItemId: string;
  addonItemName: string;
  addonGroupId: string;
  addonGroupName: string;
  price: number;
}

// App Types
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  isVeg?: boolean;
  ignore_taxes?: string;  // "0" = tax inclusive, else not
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
  /** Addon groups for this item (min/max selection per group) */
  addonGroups?: AddonGroup[];
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
  /** Addons chosen for this line (affects price and order payload) */
  selectedAddons?: SelectedAddon[];
}
