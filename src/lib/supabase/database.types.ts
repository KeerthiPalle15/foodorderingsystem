export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'customer' | 'admin' | 'driver';
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin' | 'driver';
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin' | 'driver';
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      food_items: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          original_price: number | null;
          image_url: string | null;
          category_id: string;
          is_available: boolean;
          preparation_time: number;
          dietary_info: Json | null;
          allergens: string[] | null;
          stock_quantity: number;
          rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          image_url?: string | null;
          category_id: string;
          is_available?: boolean;
          preparation_time?: number;
          dietary_info?: Json | null;
          allergens?: string[] | null;
          stock_quantity?: number;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          original_price?: number | null;
          image_url?: string | null;
          category_id?: string;
          is_available?: boolean;
          preparation_time?: number;
          dietary_info?: Json | null;
          allergens?: string[] | null;
          stock_quantity?: number;
          rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          subtotal: number;
          discount: number;
          delivery_fee: number;
          tax: number;
          total: number;
          coupon_code: string | null;
          delivery_address: string;
          delivery_phone: string;
          delivery_instructions: string | null;
          payment_method: 'card' | 'cash' | 'razorpay';
          payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          payment_id: string | null;
          order_date: string;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number?: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          subtotal: number;
          discount?: number;
          delivery_fee?: number;
          tax?: number;
          total: number;
          coupon_code?: string | null;
          delivery_address: string;
          delivery_phone: string;
          delivery_instructions?: string | null;
          payment_method?: 'card' | 'cash' | 'wallet';
          payment_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          payment_id?: string | null;
          order_date?: string;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_number?: string;
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
          subtotal?: number;
          discount?: number;
          delivery_fee?: number;
          tax?: number;
          total?: number;
          coupon_code?: string | null;
          delivery_address?: string;
          delivery_phone?: string;
          delivery_instructions?: string | null;
          payment_method?: 'card' | 'cash' | 'wallet';
          payment_status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
          payment_id?: string | null;
          order_date?: string;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          food_item_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
          special_instructions: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          food_item_id: string;
          quantity?: number;
          unit_price: number;
          subtotal: number;
          special_instructions?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          food_item_id?: string;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
          special_instructions?: string | null;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          food_item_id: string;
          quantity: number;
          special_instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          food_item_id: string;
          quantity?: number;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          food_item_id?: string;
          quantity?: number;
          special_instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          type: 'percentage' | 'fixed';
          discount_value: number;
          minimum_order: number;
          maximum_discount: number | null;
          usage_limit: number | null;
          usage_limit_per_user: number;
          used_count: number;
          valid_from: string;
          valid_until: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          type?: 'percentage' | 'fixed';
          discount_value: number;
          minimum_order?: number;
          maximum_discount?: number | null;
          usage_limit?: number | null;
          usage_limit_per_user?: number;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          description?: string | null;
          type?: 'percentage' | 'fixed';
          discount_value?: number;
          minimum_order?: number;
          maximum_discount?: number | null;
          usage_limit?: number | null;
          usage_limit_per_user?: number;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          food_item_id: string;
          order_id: string | null;
          rating: number;
          comment: string | null;
          images: string[] | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          food_item_id: string;
          order_id?: string | null;
          rating: number;
          comment?: string | null;
          images?: string[] | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          food_item_id?: string;
          order_id?: string | null;
          rating?: number;
          comment?: string | null;
          images?: string[] | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      homepage_content: {
        Row: {
          id: string;
          section_name: string;
          title: string | null;
          content: string | null;
          media: Json | null;
          metadata: Json | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_name: string;
          title?: string | null;
          content?: string | null;
          media?: Json | null;
          metadata?: Json | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_name?: string;
          title?: string | null;
          content?: string | null;
          media?: Json | null;
          metadata?: Json | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
