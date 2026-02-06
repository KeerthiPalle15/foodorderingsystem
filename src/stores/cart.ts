'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, FoodItem } from '@/types';

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  setItems: (items: CartItem[]) => void;
  addItem: (foodItem: FoodItem, specialInstructions?: string) => void;
  removeItem: (foodItemId: string) => void;
  updateQuantity: (foodItemId: string, quantity: number) => void;
  updateSpecialInstructions: (foodItemId: string, instructions: string) => void;
  applyCoupon: (code: string) => void;
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

      applyCoupon: (code: string) => {
        set({ couponCode: code });
      },

      removeCoupon: () => {
        set({ couponCode: null });
      },

      clearCart: () => {
        set({ items: [], couponCode: null });
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
        return 0; // Will be calculated based on coupon validation
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
