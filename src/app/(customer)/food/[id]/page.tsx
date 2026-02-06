'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Header, Footer } from '@/components/customer';
import { Button, Badge, Card } from '@/components/ui';
import { useCart } from '@/lib/hooks-cart';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import type { Database } from '@/lib/supabase/database.types';
import type { DietaryInfo } from '@/types';

type FoodItem = Database['public']['Tables']['food_items']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export default function FoodDetailPage() {
  const params = useParams();
  const [food, setFood] = useState<(FoodItem & { category?: Category }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    fetchFood();
  }, [params.id]);

  const fetchFood = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*, categories(*)')
        .eq('id', params.id)
        .single() as { data: (FoodItem & { category?: Category }) | null; error: any };

      if (data && !error) {
        setFood(data);
      }
    } catch (error) {
      console.error('Error fetching food:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (food) {
      addItem(food as any, specialInstructions);
      toast.success(`${food.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin" style={{ borderBottomColor: '#f97316' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🍔</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">😕</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Food not found</h2>
            <p className="text-gray-500 mb-4">This item may have been removed from the menu</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercentage = food.original_price && food.original_price > food.price
    ? Math.round((1 - food.price / food.original_price) * 100)
    : 0;

  const dietaryInfo = food.dietary_info as DietaryInfo | null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-gray-500">
            <li><a href="/" className="hover:text-orange-500">Home</a></li>
            <li>/</li>
            <li><a href="/menu" className="hover:text-orange-500">Menu</a></li>
            <li>/</li>
            <li className="text-gray-900">{food.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
            {food.image_url ? (
              <Image
                src={food.image_url}
                alt={food.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-50 to-red-50">
                <span className="text-[8rem]">🍔</span>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <Badge className="bg-red-500 text-white text-sm font-bold px-3 py-1">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {!food.is_available && (
                <Badge variant="destructive" className="text-sm">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {food.category && (
                  <Badge variant="default" className="bg-orange-100 text-orange-700">
                    {food.category.name}
                  </Badge>
                )}
                <Badge variant={food.is_available ? 'success' : 'destructive'}>
                  {food.is_available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{food.name}</h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-medium">{food.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({food.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{food.preparation_time} mins</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-orange-500">
                {formatCurrency(food.price)}
              </span>
              {food.original_price && food.original_price > food.price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatCurrency(food.original_price)}
                </span>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed">{food.description}</p>

            {/* Dietary Info */}
            {dietaryInfo && (
              <div className="flex flex-wrap gap-2">
                {dietaryInfo.vegetarian && (
                  <Badge variant="success" className="bg-green-100 text-green-700">Vegetarian</Badge>
                )}
                {dietaryInfo.vegan && (
                  <Badge variant="success" className="bg-green-100 text-green-700">Vegan</Badge>
                )}
                {dietaryInfo.gluten_free && (
                  <Badge className="bg-blue-100 text-blue-700">Gluten Free</Badge>
                )}
                {dietaryInfo.spice_level && (
                  <Badge className="bg-red-100 text-red-700">
                    {dietaryInfo.spice_level === 'mild' && '🌶️ Mild'}
                    {dietaryInfo.spice_level === 'medium' && '🌶️🌶️ Medium'}
                    {dietaryInfo.spice_level === 'hot' && '🌶️🌶️🌶️ Hot'}
                    {dietaryInfo.spice_level === 'very_hot' && '🌶️🌶️🌶️🌶️ Very Hot'}
                  </Badge>
                )}
                {dietaryInfo.calories && (
                  <Badge className="bg-gray-100 text-gray-700">{dietaryInfo.calories} cal</Badge>
                )}
              </div>
            )}

            {/* Allergens */}
            {food.allergens && Array.isArray(food.allergens) && food.allergens.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-yellow-800">Contains allergens:</p>
                    <p className="text-sm text-yellow-700">{food.allergens.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests? (optional)"
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full h-14 text-lg shadow-lg shadow-orange-500/25"
              onClick={handleAddToCart}
              disabled={!food.is_available}
            >
              {food.is_available ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart - {formatCurrency(food.price * quantity)}
                </>
              ) : (
                'Out of Stock'
              )}
            </Button>

            {/* Stock Info */}
            {food.is_available && food.stock_quantity < 10 && (
              <p className="text-sm text-orange-600 text-center">
                Only {food.stock_quantity} items left in stock!
              </p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
