// API Configuration
const API_CONFIG = {
  baseUrl: 'https://qle1yy2ydc.execute-api.ap-southeast-1.amazonaws.com/V1',
  saveOrderEndpoint: 'https://qle1yy2ydc.execute-api.ap-southeast-1.amazonaws.com/V1/save_order',
  fetchMenuEndpoint: 'https://avayacafe.com/online-order/api/fetchMenu.php',
  accessToken: '1cce78e98ea6739f92e2673b190747fda7b6f211',
  appKey: '7b04w6os3njqkvtrmycix52f9zgu8a1p',
  appSecret: '94eab54924201de23132672a68c16d375a0c57cd'
};

// Import RestaurantData from useMenuData
interface RestaurantData {
  restID: string;
  res_name: string;
  address: string;
  contact_information: string;
}

// Order interface
export interface OrderData {
  customer_name: string;
  customer_phone: string;
  customer_remark: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

// Restaurant interface (keeping for backward compatibility)
export interface RestaurantDataInterface {
  restID: string;
  res_name: string;
  address: string;
  contact_information: string;
}

// API Request interface
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
        details: {
          name: string;
          phone: string;
        };
      };
      OrderItem: {
        details: OrderItemDetail[];
      };
      Tax: {
        details: TaxDetail[];
      };
    };
  };
}

export interface OrderItem {
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
  variation?: {
    id: string;
    name: string;
    price: number;
  };
}

// Order Item Detail for API
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
      console.log('Restaurant data retrieved from localStorage:', restaurantData);
      return restaurantData;
    }
    
    // If no data in localStorage, fetch from API (fallback)
    console.log('No restaurant data in localStorage, fetching from API...');
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
      restID: data.restaurant_id || restaurantDetails.restaurantid || 'xxxxxx',
      res_name: restaurantDetails.restaurantname || 'Unknown Restaurant',
      address: restaurantDetails.address || 'Address not available',
      contact_information: restaurantDetails.contact || 'Contact not available'
    };
    
    // Store in localStorage for future use
    localStorage.setItem('restaurantData', JSON.stringify(restaurant));
    console.log('Restaurant data fetched and stored:', restaurant);
    return restaurant;
    
  } catch (error) {
    console.error('Error getting restaurant data:', error);
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
  
  // Transform order items
  const orderItemDetails: OrderItemDetail[] = orderData.items.map(item => {
    // Calculate tax amounts for this item
    const itemTaxDetails = taxes.map(tax => ({
      id: tax.taxid || tax.id,
      name: tax.taxname || tax.name,
      tax_percentage: (tax.tax || tax.price).toString(),
      amount: ((parseFloat(item.price.toString()) * parseFloat(tax.tax || '0')) / 100).toFixed(2)
    }));
    
    const itemPrice = parseFloat(item.price.toString());
    const itemDiscount = orderData.discount > 0 ? (orderData.discount / orderData.items.length).toFixed(2) : '0';
    const finalPrice = (itemPrice - parseFloat(itemDiscount)).toFixed(2);
    
    return {
      id: item.item_id,
      name: item.item_name,
      tax_inclusive: true,
      gst_liability: 'vendor',
      item_tax: itemTaxDetails,
      item_discount: itemDiscount,
      price: itemPrice.toFixed(2),
      final_price: finalPrice,
      quantity: item.quantity.toString(),
      description: '',
      variation_name: item.variation?.name || '',
      variation_id: item.variation?.id || ''
    };
  });
  
  // Transform tax details
  const taxDetails: TaxDetail[] = taxes.map(tax => ({
    id: tax.taxid || tax.id,
    title: tax.taxname || tax.name,
    type: 'P',
    price: (tax.tax || tax.price).toString(),
    tax: ((orderData.subtotal * parseFloat(tax.tax || '0')) / 100).toFixed(2),
    restaurant_liable_amt: '0.00'
  }));
  
  return {
    app_key: API_CONFIG.appKey,
    app_secret: API_CONFIG.appSecret,
    access_token: API_CONFIG.accessToken,
    orderinfo: {
      OrderInfo: {
        Restaurant: {
          details: restaurantData
        },
        Customer: {
          details: {
            name: orderData.customer_name,
            phone: orderData.customer_phone
          }
        },
        OrderItem: {
          details: orderItemDetails
        },
        Tax: {
          details: taxDetails
        }
      }
    }
  };
};

// Save order API call
export const saveOrder = async (orderData: OrderData, taxes: any[] = []): Promise<any> => {
  try {
    const transformedData = await transformOrderData(orderData, taxes);
    console.log('Original order data:', orderData);
    console.log('Transformed order data:', JSON.stringify(transformedData, null, 2));
    console.log('API Endpoint:', API_CONFIG.saveOrderEndpoint);
    
    const response = await fetch(API_CONFIG.saveOrderEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transformedData)
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('API Success Response:', result);
    return result;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};
