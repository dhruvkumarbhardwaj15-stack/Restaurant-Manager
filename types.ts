
export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number; // Full Plate Price
  halfPrice?: number; // Optional Half Plate Price
  category: string;
  image: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
  selectedSize: 'Half' | 'Full';
}

export enum Category {
  All = 'All',
  Starters = 'Starters',
  MainCourse = 'Main Course',
  Desserts = 'Desserts',
  Beverages = 'Beverages',
  Drinks = 'Drinks',
  Specials = 'Specials'
}

export interface CustomerRecord {
  id: string;
  name: string;
  contact: string;
  total: number;
  timestamp: string;
  items: string; // Summary of items ordered
  paymentMethod: string;
  cartItems?: CartItem[];
}

export interface InvoiceDetails {
  customerName: string;
  customerContact: string;
  orderId: string;
  date: string;
  items: CartItem[];
  total: number;
}

export interface RestaurantProfile {
  name: string;
  address: string;
  contact: string;
  logo: string;
  ownerName: string;
  receiptHeader?: string; // Section 2 Text
  receiptFooter?: string; // Section 5 Text
  themeColor: string; // preset name or hex code
  fontPair: string; // preset name or 'custom'
  customFontFamily?: string; // Name of Google Font
}
