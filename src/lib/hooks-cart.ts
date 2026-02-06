'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useCartStore } from '@/stores/cart';
import { FoodItem, CartItem } from '@/types';

export function useCart() {
  const store = useCartStore();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Get user session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        await loadCartFromDatabase(session.user.id);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    // Initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        loadCartFromDatabase(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load cart from database
  const loadCartFromDatabase = async (uid: string) => {
    if (!uid) return;
    
    setSyncing(true);
    try {
      const { data: dbItems, error } = await (supabase.from('cart_items') as any)
        .select('*, food_items(*)')
        .eq('user_id', uid);

      if (error) {
        console.error('Error loading cart from database:', error);
        return;
      }

      if (dbItems && dbItems.length > 0) {
        // Convert database items to cart items
        const cartItems: CartItem[] = dbItems.map((item: any) => ({
          id: item.id,
          food_item: item.food_items as FoodItem,
          quantity: item.quantity,
          special_instructions: item.special_instructions,
        }));
        store.setItems(cartItems);
      } else {
        store.setItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Add item to cart (syncs to database)
  const addItem = useCallback(async (foodItem: FoodItem, specialInstructions?: string) => {
    // First add to local store
    store.addItem(foodItem, specialInstructions);

    // Then sync to database
    if (userId) {
      await syncItemToDatabase(userId, foodItem.id, 1, specialInstructions);
    }
  }, [userId, store]);

  // Remove item from cart (syncs to database)
  const removeItem = useCallback(async (foodItemId: string) => {
    // First remove from local store
    store.removeItem(foodItemId);

    // Then sync to database
    if (userId) {
      await removeItemFromDatabase(userId, foodItemId);
    }
  }, [userId, store]);

  // Update quantity (syncs to database)
  const updateQuantity = useCallback(async (foodItemId: string, quantity: number) => {
    // First update local store
    store.updateQuantity(foodItemId, quantity);

    // Then sync to database
    if (userId) {
      if (quantity <= 0) {
        await removeItemFromDatabase(userId, foodItemId);
      } else {
        await syncItemToDatabase(userId, foodItemId, quantity);
      }
    }
  }, [userId, store]);

  // Update special instructions (syncs to database)
  const updateSpecialInstructions = useCallback(async (foodItemId: string, instructions: string) => {
    // First update local store
    store.updateSpecialInstructions(foodItemId, instructions);

    // Then sync to database
    if (userId) {
      try {
        await (supabase.from('cart_items') as any)
          .update({ special_instructions: instructions })
          .eq('user_id', userId)
          .eq('food_item_id', foodItemId);
      } catch (error) {
        console.error('Error updating special instructions:', error);
      }
    }
  }, [userId, store]);

  // Clear cart (syncs to database)
  const clearCart = useCallback(async () => {
    store.clearCart();

    if (userId) {
      try {
        await (supabase.from('cart_items') as any)
          .delete()
          .eq('user_id', userId);
      } catch (error) {
        console.error('Error clearing cart from database:', error);
      }
    }
  }, [userId, store]);

  // Sync single item to database
  const syncItemToDatabase = async (uid: string, foodItemId: string, quantity: number, specialInstructions?: string) => {
    try {
      const { error } = await (supabase.from('cart_items') as any)
        .upsert({
          user_id: uid,
          food_item_id: foodItemId,
          quantity,
          special_instructions: specialInstructions || null,
        }, {
          onConflict: 'user_id, food_item_id'
        });

      if (error) {
        console.error('Error syncing item to database:', error);
      }
    } catch (error) {
      console.error('Error syncing cart item:', error);
    }
  };

  // Remove item from database
  const removeItemFromDatabase = async (uid: string, foodItemId: string) => {
    try {
      const { error } = await (supabase.from('cart_items') as any)
        .delete()
        .eq('user_id', uid)
        .eq('food_item_id', foodItemId);

      if (error) {
        console.error('Error removing item from database:', error);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  return {
    ...store,
    loading,
    syncing,
    userId,
    addItem,
    removeItem,
    updateQuantity,
    updateSpecialInstructions,
    clearCart,
  };
}

// Backward-compatible exports for existing code
export async function saveCartToDB(userId: string, items: any[]) {
  if (!userId) return;
  
  try {
    // Clear existing cart items for this user
    await (supabase.from('cart_items') as any)
      .delete()
      .eq('user_id', userId);
    
    // Insert new cart items
    for (const item of items) {
      await (supabase.from('cart_items') as any).upsert({
        user_id: userId,
        food_item_id: item.food_item.id,
        quantity: item.quantity,
        special_instructions: item.special_instructions,
      }, {
        onConflict: 'user_id, food_item_id'
      });
    }
  } catch (error) {
    console.error('Error saving cart to database:', error);
  }
}

export async function addToCartWithSync(foodItem: any, userId: string | null) {
  useCartStore.getState().addItem(foodItem);
  
  if (userId) {
    await saveCartToDB(userId, useCartStore.getState().items);
  }
}
