// Database Enums
export type UserRole = 'customer' | 'admin' | 'driver';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'cash' | 'razorpay';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type CouponType = 'percentage' | 'fixed';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Profile Types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: UserRole;
  address?: string;
  created_at: string;
  updated_at: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// Food Item Types
export interface DietaryInfo {
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean;
  spice_level?: 'mild' | 'medium' | 'hot' | 'very_hot';
  calories?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  category_id: string;
  category?: Category;
  is_available: boolean;
  preparation_time: number;
  dietary_info?: DietaryInfo | null | Json;
  allergens?: string[] | null;
  stock_quantity: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  user?: Profile;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  tax: number;
  total: number;
  coupon_code?: string;
  delivery_address: string;
  delivery_phone: string;
  delivery_instructions?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_id?: string;
  order_date: string;
  delivered_at?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  food_item_id: string;
  food_item?: FoodItem;
  quantity: number;
  unit_price: number;
  subtotal: number;
  special_instructions?: string;
  created_at: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  type: CouponType;
  discount_value: number;
  minimum_order: number;
  maximum_discount?: number;
  usage_limit?: number | null;
  usage_limit_per_user: number;
  used_count: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Review Types
export interface Review {
  id: string;
  user_id: string;
  user?: Profile;
  food_item_id: string;
  food_item?: FoodItem;
  order_id?: string;
  rating: number;
  comment?: string;
  images?: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Cart Types
export interface CartItem {
  id: string;
  food_item: FoodItem;
  quantity: number;
  special_instructions?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  tax: number;
  total: number;
}

// Homepage Content Types
export interface HomepageContent {
  id: string;
  section_name: string;
  title?: string;
  content?: string;
  media?: Record<string, any>;
  metadata?: Record<string, any>;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface AuthSession {
  user: Profile;
  accessToken: string;
  refreshToken: string;
}
