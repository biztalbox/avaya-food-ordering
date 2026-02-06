// API Configuration
const API_CONFIG = {
  baseUrl: 'https://qle1yy2ydc.execute-api.ap-southeast-1.amazonaws.com/V1',
  saveOrderEndpoint: 'https://qle1yy2ydc.execute-api.ap-southeast-1.amazonaws.com/V1/save_order',
  fetchMenuEndpoint: 'https://avayacafe.com/online-order/api/fetchMenu.php',
  accessToken: '1cce78e98ea6739f92e2673b190747fda7b6f211',
  appKey: '7b04w6os3njqkvtrmycix52f9zgu8a1p',
  appSecret: '94eab54924201de23132672a68c16d375a0c57cd'
};

// Hardcoded defaults for save_order API (dine-in / table order)
const ORDER_DEFAULTS = {
  order_type: 'D',
  ondc_bap: 'buyerAppName',
  advanced_order: 'N',
  urgent_order: false,
  urgent_time: 20,
  payment_type: 'COD',
  service_charge: '0',
  sc_tax_amount: '0',
  delivery_charges: '0',
  dc_tax_percentage: '0',
  dc_tax_amount: '0',
  packing_charges: '0',
  pc_tax_percentage: '0',
  pc_tax_amount: '0',
  no_of_persons: '0',
  discount_type: 'F',
  enable_delivery: 0,
  min_prep_time: 20,
  callback_url: '',
  collect_cash: '0',
  otp: ''
};

// Import RestaurantData from useMenuData
interface RestaurantData {
  restID: string;
  res_name: string;
  address: string;
  contact_information: string;
}

// Order interface (from CheckoutDrawer)
export interface OrderData {
  customer_name: string;
  customer_phone: string;
  customer_remark: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  table_no?: string;
  description?: string;
  customer_email?: string;
  customer_address?: string;
  latitude?: string;
  longitude?: string;
}

// Restaurant interface (keeping for backward compatibility)
export interface RestaurantDataInterface {
  restID: string;
  res_name: string;
  address: string;
  contact_information: string;
}

/**
 * Generates a unique numeric order ID based on timestamp.
 * Format: {timestamp_ms}{random_3_digits} for uniqueness.
 */
export const generateOrderId = (): string => {
  const timestamp = Date.now();
  const randomSuffix = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `${timestamp}${randomSuffix}`;
};

// Customer details for API
export interface CustomerDetails {
  email: string;
  name: string;
  address: string;
  phone: string;
  latitude: string;
  longitude: string;
}

// Order details for API (full structure)
export interface OrderDetailsApi {
  orderID: string;
  preorder_date: string;
  preorder_time: string;
  service_charge: string;
  sc_tax_amount: string;
  delivery_charges: string;
  dc_tax_percentage: string;
  dc_tax_amount: string;
  dc_gst_details: { gst_liable: string; amount: string }[];
  packing_charges: string;
  pc_tax_amount: string;
  pc_tax_percentage: string;
  pc_gst_details: { gst_liable: string; amount: string }[];
  order_type: string;
  ondc_bap: string;
  advanced_order: string;
  urgent_order: boolean;
  urgent_time: number;
  payment_type: string;
  table_no: string;
  no_of_persons: string;
  discount_total: string;
  tax_total: string;
  discount_type: string;
  total: string;
  description: string;
  created_on: string;
  enable_delivery: number;
  min_prep_time: number;
  callback_url: string;
  collect_cash: string;
  otp: string;
}

// Addon item for order line
export interface AddonItemDetail {
  id: string;
  name: string;
  group_name: string;
  price: string;
  group_id: number;
  quantity: string;
}

// Discount detail for API
export interface DiscountDetail {
  id: string;
  title: string;
  type: string;
  price: string;
}

// API Request interface (full required format)
export interface SaveOrderRequest {
  app_key: string;
  app_secret: string;
  access_token: string;
  orderinfo: {
    OrderInfo: {
      Restaurant: {
        details: RestaurantData;
      };
      Customer: {
        details: CustomerDetails;
      };
      Order: {
        details: OrderDetailsApi;
      };
      OrderItem: {
        details: OrderItemDetailWithAddon[];
      };
      Tax: {
        details: TaxDetail[];
      };
      Discount: {
        details: DiscountDetail[];
      };
    };
  };
  udid: string;
  device_type: string;
}

export interface OrderItem {
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
  ignore_taxes?: string | number;  // "0" or 0 = tax inclusive, else not
  variation?: {
    id: string;
    name: string;
    price: number;
  };
}

// Order Item Detail for API (with AddonItem)
export interface OrderItemDetail {
  id: string;
  name: string;
  tax_inclusive: boolean;
  gst_liability: string;
  item_tax: {
    id: string;
    name: string;
    tax_percentage: string;
    amount: string;
  }[];
  item_discount: string;
  price: string;
  final_price: string;
  quantity: string;
  description: string;
  variation_name: string;
  variation_id: string;
}

export interface OrderItemDetailWithAddon extends OrderItemDetail {
  AddonItem?: { details: AddonItemDetail[] };
}

// Tax Detail for API
export interface TaxDetail {
  id: string;
  title: string;
  type: string;
  price: string;
  tax: string;
  restaurant_liable_amt: string;
}

// Get restaurant data from localStorage (no API call)
export const fetchRestaurantData = async (): Promise<RestaurantData> => {
  try {
    // Try to get restaurant data from localStorage first
    const storedData = localStorage.getItem('restaurantData');
    
    if (storedData) {
      const restaurantData = JSON.parse(storedData) as RestaurantData;
      
      return restaurantData;
    }
    
    // If no data in localStorage, fetch from API (fallback)
    
    const response = await fetch(API_CONFIG.fetchMenuEndpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch restaurant data: ${response.status}`);
    }
    const data = await response.json();
    
    // Extract restaurant details from API response
    const restaurantDetails = data.menu?.restaurants?.[0]?.details;
    
    if (!restaurantDetails) {
      throw new Error('Restaurant details not found in API response');
    }
    
    const restaurant: RestaurantData = {
      restID: data.restaurant_id || restaurantDetails.restaurantid,
      res_name: restaurantDetails.restaurantname,
      address: restaurantDetails.address,
      contact_information: restaurantDetails.contact
    };
    
    // Store in localStorage for future use
    localStorage.setItem('restaurantData', JSON.stringify(restaurant));
    
    return restaurant;
    
  } catch (error) {
    
    // Return default restaurant data on error
    return {
      restID: 'xxxxxx',
      res_name: 'Dynamite Lounge',
      address: '2nd Floor, Reliance Mall, Nr.Akshar Chowk',
      contact_information: '9427846660'
    };
  }
};

// Transform order data to match API format
const transformOrderData = async (orderData: OrderData, taxes: any[] = []): Promise<SaveOrderRequest> => {
  // Get restaurant data
  const restaurantData = await fetchRestaurantData();

  // Dynamic date/time for order
  const now = new Date();
  const preorderDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const preorderTime = now.toTimeString().slice(0, 8);   // HH:mm:ss
  const createdOn = `${preorderDate} ${preorderTime}`;  // YYYY-MM-DD HH:mm:ss
  const orderID = generateOrderId();
  
  // Transform order items (with AddonItem; addons empty for now)
  const orderItemDetails: OrderItemDetailWithAddon[] = orderData.items.map(item => {
    const itemTaxDetails = taxes.map(tax => ({
      id: tax.taxid || tax.id,
      name: tax.taxname || tax.name,
      tax_percentage: (tax.tax || tax.price).toString(),
      amount: ((parseFloat(item.price.toString()) * item.quantity * parseFloat(tax.tax || '0')) / 100).toFixed(2)
    }));
    const itemPrice = parseFloat(item.price.toString());
    const itemDiscount = orderData.discount > 0 ? (orderData.discount / orderData.items.length).toFixed(2) : '0';
    const finalPrice = (itemPrice * item.quantity - parseFloat(itemDiscount)).toFixed(2);
    // tax_inclusive: true when item.ignore_taxes === 0, else false
    const taxInclusive = item.ignore_taxes === 0 || item.ignore_taxes === '0';
    return {
      id: item.item_id,
      name: item.item_name,
      tax_inclusive: taxInclusive,
      gst_liability: 'restaurant',
      item_tax: itemTaxDetails,
      item_discount: itemDiscount,
      price: itemPrice.toFixed(2),
      final_price: finalPrice,
      quantity: item.quantity.toString(),
      description: '',
      variation_name: item.variation?.name || '',
      variation_id: item.variation?.id || '',
      AddonItem: { details: [] }
    };
  });

  // Tax details
  const taxDetails: TaxDetail[] = taxes.map(tax => ({
    id: tax.taxid || tax.id,
    title: tax.taxname || tax.name,
    type: 'P',
    price: (tax.tax || tax.price).toString(),
    tax: ((orderData.subtotal * parseFloat(tax.tax || '0')) / 100).toFixed(2),
    restaurant_liable_amt: '0.00'
  }));

  // Discount details (one entry when discount > 0)
  const discountDetails: DiscountDetail[] = orderData.discount > 0
    ? [{ id: '0', title: 'Discount', type: ORDER_DEFAULTS.discount_type, price: orderData.discount.toFixed(2) }]
    : [];

  // Order details (full API shape)
  const orderDetails: OrderDetailsApi = {
    orderID,
    preorder_date: preorderDate,
    preorder_time: preorderTime,
    service_charge: ORDER_DEFAULTS.service_charge,
    sc_tax_amount: ORDER_DEFAULTS.sc_tax_amount,
    delivery_charges: ORDER_DEFAULTS.delivery_charges,
    dc_tax_percentage: ORDER_DEFAULTS.dc_tax_percentage,
    dc_tax_amount: ORDER_DEFAULTS.dc_tax_amount,
    dc_gst_details: [
      { gst_liable: 'vendor', amount: ORDER_DEFAULTS.dc_tax_amount },
      { gst_liable: 'restaurant', amount: '0' }
    ],
    packing_charges: ORDER_DEFAULTS.packing_charges,
    pc_tax_amount: ORDER_DEFAULTS.pc_tax_amount,
    pc_tax_percentage: ORDER_DEFAULTS.pc_tax_percentage,
    pc_gst_details: [
      { gst_liable: 'vendor', amount: ORDER_DEFAULTS.pc_tax_amount },
      { gst_liable: 'restaurant', amount: '0' }
    ],
    order_type: ORDER_DEFAULTS.order_type,
    ondc_bap: ORDER_DEFAULTS.ondc_bap,
    advanced_order: ORDER_DEFAULTS.advanced_order,
    urgent_order: ORDER_DEFAULTS.urgent_order,
    urgent_time: ORDER_DEFAULTS.urgent_time,
    payment_type: ORDER_DEFAULTS.payment_type,
    table_no: orderData.table_no || '',
    no_of_persons: ORDER_DEFAULTS.no_of_persons,
    discount_total: orderData.discount.toFixed(2),
    tax_total: orderData.tax.toFixed(2),
    discount_type: ORDER_DEFAULTS.discount_type,
    total: orderData.total.toFixed(2),
    description: orderData.description || '',
    created_on: createdOn,
    enable_delivery: ORDER_DEFAULTS.enable_delivery,
    min_prep_time: ORDER_DEFAULTS.min_prep_time,
    callback_url: ORDER_DEFAULTS.callback_url,
    collect_cash: orderData.total.toFixed(2),
    otp: ORDER_DEFAULTS.otp
  };

  // Customer details (email, address, lat/long optional from form later)
  const customerDetails: CustomerDetails = {
    email: orderData.customer_email || '',
    name: orderData.customer_name,
    address: orderData.customer_address || '',
    phone: orderData.customer_phone,
    latitude: orderData.latitude || '',
    longitude: orderData.longitude || ''
  };

  return {
    app_key: API_CONFIG.appKey,
    app_secret: API_CONFIG.appSecret,
    access_token: API_CONFIG.accessToken,
    orderinfo: {
      OrderInfo: {
        Restaurant: { details: restaurantData },
        Customer: { details: customerDetails },
        Order: { details: orderDetails },
        OrderItem: { details: orderItemDetails },
        Tax: { details: taxDetails },
        Discount: { details: discountDetails }
      }
    },
    udid: '',
    device_type: 'Web'
  };
};

// Save order API call
export const saveOrder = async (orderData: OrderData, taxes: any[] = []): Promise<any> => {
  try {
    const transformedData = await transformOrderData(orderData, taxes);
    
    
    const response = await fetch(API_CONFIG.saveOrderEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transformedData)
    });

    

    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    
    return result;
  } catch (error) {
    
    throw error;
  }
};
