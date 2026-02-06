'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, FoodItem } from '@/types';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDetails: {
    type: 'percentage' | 'fixed';
    discount_value: number;
    minimum_order: number;
    maximum_discount?: number;
  } | null;
  setItems: (items: CartItem[]) => void;
  addItem: (foodItem: FoodItem, specialInstructions?: string) => void;
  removeItem: (foodItemId: string) => void;
  updateQuantity: (foodItemId: string, quantity: number) => void;
  updateSpecialInstructions: (foodItemId: string, instructions: string) => void;
  applyCoupon: (code: string, details?: any) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.08;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDetails: null,

      addItem: (foodItem: FoodItem, specialInstructions?: string) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.food_item.id === foodItem.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.food_item.id === foodItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: crypto.randomUUID(),
                food_item: foodItem,
                quantity: 1,
                special_instructions: specialInstructions,
              },
            ],
          };
        });
      },

      removeItem: (foodItemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.food_item.id !== foodItemId),
        }));
      },

      updateQuantity: (foodItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(foodItemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.food_item.id === foodItemId ? { ...item, quantity } : item
          ),
        }));
      },

      updateSpecialInstructions: (foodItemId: string, instructions: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.food_item.id === foodItemId
              ? { ...item, special_instructions: instructions }
              : item
          ),
        }));
      },

      applyCoupon: (code: string, details?: any) => {
        set({ couponCode: code, couponDetails: details || null });
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDetails: null });
      },

      clearCart: () => {
        set({ items: [], couponCode: null, couponDetails: null });
      },

      setItems: (items: CartItem[]) => {
        set({ items });
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.food_item.price * item.quantity,
          0
        );
      },

      getDiscount: () => {
        const { couponDetails } = get();
        if (!couponDetails) return 0;
        
        const subtotal = get().getSubtotal();
        
        // Check minimum order requirement
        if (subtotal < couponDetails.minimum_order) {
          return 0;
        }
        
        let discount = 0;
        if (couponDetails.type === 'percentage') {
          discount = subtotal * (couponDetails.discount_value / 100);
        } else {
          discount = couponDetails.discount_value;
        }
        
        // Apply maximum discount if set
        if (couponDetails.maximum_discount) {
          discount = Math.min(discount, couponDetails.maximum_discount);
        }
        
        return discount;
      },

      getDeliveryFee: () => {
        return get().items.length > 0 ? DELIVERY_FEE : 0;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        return (subtotal - discount) * TAX_RATE;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTax();
        return subtotal - discount + deliveryFee + tax;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
