'use client';

import Image from 'next/image';
import { Button } from '@/components/ui';
import { useCart } from '@/lib/hooks-cart';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  id: string;
}

export function CartItem({ id }: CartItemProps) {
  const { items, updateQuantity, removeItem } = useCart();
  const item = items.find((i) => i.id === id);

  if (!item) return null;

  const { food_item, quantity, special_instructions } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        {food_item.image_url ? (
          <Image
            src={food_item.image_url}
            alt={food_item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{food_item.name}</h4>
        <p className="text-sm text-gray-500 mt-1">{formatCurrency(food_item.price)}</p>
        
        {special_instructions && (
          <p className="text-xs text-gray-400 mt-1">Note: {special_instructions}</p>
        )}
        
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              className="px-2 py-1 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => updateQuantity(food_item.id, quantity - 1)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
            <button
              className="px-2 py-1 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => updateQuantity(food_item.id, quantity + 1)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <button
            className="text-red-500 hover:text-red-600 transition-colors"
            onClick={() => removeItem(food_item.id)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-medium text-gray-900">{formatCurrency(food_item.price * quantity)}</p>
      </div>
    </div>
  );
}
