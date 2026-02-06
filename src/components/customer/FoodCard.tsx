'use client';

import Image from 'next/image';
import { Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { FoodItem, DietaryInfo } from '@/types';
import { useCart } from '@/lib/hooks-cart';
import { cn } from '@/lib/utils';

interface FoodCardProps {
  food: FoodItem;
}

export function FoodCard({ food }: FoodCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(food);
  };

  const discountPercentage = food.original_price && food.original_price > food.price
    ? Math.round((1 - food.price / food.original_price) * 100)
    : 0;

  const dietaryInfo = food.dietary_info as DietaryInfo | null;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {food.image_url ? (
          <Image
            src={food.image_url}
            alt={food.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Dietary Badges */}
        {dietaryInfo && (
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {dietaryInfo.vegetarian && (
              <div className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                Veg
              </div>
            )}
            {dietaryInfo.vegan && (
              <div className="bg-green-400 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                Vegan
              </div>
            )}
          </div>
        )}

        {/* Add Button Overlay */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!food.is_available}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all",
              food.is_available 
                ? "bg-orange-500 text-white hover:bg-orange-600 hover:scale-110" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1 text-lg">{food.name}</h3>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">{food.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 min-h-[2.5rem]">{food.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">{formatCurrency(food.price)}</span>
            {food.original_price && food.original_price > food.price && (
              <span className="text-sm text-gray-400 line-through">{formatCurrency(food.original_price)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!food.is_available}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              food.is_available 
                ? "bg-orange-500 text-white hover:bg-orange-600" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {food.is_available ? 'Add' : 'Out'}
          </button>
        </div>

        {/* Preparation Time */}
        {food.preparation_time && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs text-gray-500">{food.preparation_time} mins</span>
          </div>
        )}
      </div>
    </div>
  );
}
