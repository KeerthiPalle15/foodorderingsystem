'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header, Footer, FoodCard } from '@/components/customer';
import { Button } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type Category = Database['public']['Tables']['categories']['Row'];
type FoodItem = Database['public']['Tables']['food_items']['Row'];

const categoryIcons: Record<string, string> = {
  '1': '🍔',
  '2': '🍕',
  '3': '🍚',
  '4': '🥗',
  '5': '🍰',
  '6': '🥤',
  'default': '🍽️',
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredFoods, setFeaturedFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')
        .limit(6);

      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Fetch featured foods (top rated, available)
      const { data: foodsData } = await supabase
        .from('food_items')
        .select('*')
        .eq('is_available', true)
        .order('rating', { ascending: false })
        .limit(4);

      if (foodsData) {
        setFeaturedFoods(foodsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Fast Delivery Available
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Delicious Food, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Delivered Fast</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg">
                Order your favorite meals from the best restaurants in town. Fresh ingredients, expert chefs, and quick delivery right to your doorstep.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/menu">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-orange-500/25">
                    Order Now
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View Menu
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="mt-10 flex items-center gap-8">
                {[
                  { value: '30+', label: 'Restaurants', icon: '🏪' },
                  { value: `${featuredFoods.length > 0 ? '50+' : '500+'}`, label: 'Dishes', icon: '🍽️' },
                  { value: '10k+', label: 'Happy Customers', icon: '⭐' },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-slide-up hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-[2.5rem] blur-2xl opacity-20 transform rotate-6" />
                <div className="relative aspect-square bg-gradient-to-br from-orange-400 via-red-500 to-orange-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-orange-500/20">
                  <div className="absolute inset-4 bg-white/10 rounded-[2rem] border border-white/20" />
                  <span className="text-[10rem] lg:text-[12rem] filter drop-shadow-2xl">🍔</span>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
                      <p className="text-xs text-gray-500">On orders over $20</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Browse Categories</h2>
              <p className="mt-2 text-gray-500">Explore our wide variety of delicious categories</p>
            </div>
            <Link href="/menu" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-6 bg-gray-50 rounded-2xl animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/menu?category=${category.id}`}
                  className="group relative flex flex-col items-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100"
                >
                  <div className={`w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                    <span className="text-3xl">{categoryIcons[category.id] || categoryIcons['default']}</span>
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{category.name}</span>
                  <span className="text-sm text-gray-500 mt-1">View items</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { id: '1', name: 'Burgers', icon: '🍔', color: 'bg-orange-100' },
                { id: '2', name: 'Pizza', icon: '🍕', color: 'bg-red-100' },
                { id: '3', name: 'Rice Bowls', icon: '🍚', color: 'bg-yellow-100' },
                { id: '4', name: 'Salads', icon: '🥗', color: 'bg-green-100' },
                { id: '5', name: 'Desserts', icon: '🍰', color: 'bg-pink-100' },
                { id: '6', name: 'Drinks', icon: '🥤', color: 'bg-blue-100' },
              ].map((category) => (
                <Link
                  key={category.id}
                  href={`/menu?category=${category.id}`}
                  className="group relative flex flex-col items-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100"
                >
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <span className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{category.name}</span>
                  <span className="text-sm text-gray-500 mt-1">View items</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Featured Foods Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Popular Dishes</h2>
              <p className="mt-2 text-gray-500">Top rated dishes loved by our customers</p>
            </div>
            <Link href="/menu" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors">
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredFoods.map((food) => (
                <FoodCard key={food.id} food={food as any} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { id: '1', name: 'Classic Burger', description: 'Juicy beef patty with fresh lettuce, tomato', price: 12.99, original_price: 15.99, category_id: '1', is_available: true, preparation_time: 15, dietary_info: null, allergens: [], stock_quantity: 50, rating: 4.5, review_count: 128, created_at: '', updated_at: '' },
                { id: '2', name: 'Margherita Pizza', description: 'Traditional Italian pizza with fresh mozzarella', price: 14.99, original_price: null, category_id: '2', is_available: true, preparation_time: 20, dietary_info: { vegetarian: true }, allergens: ['gluten', 'dairy'], stock_quantity: 30, rating: 4.8, review_count: 256, created_at: '', updated_at: '' },
                { id: '3', name: 'Chicken Biryani', description: 'Aromatic basmati rice with tender chicken', price: 16.99, original_price: 18.99, category_id: '3', is_available: true, preparation_time: 25, dietary_info: { gluten_free: true }, allergens: [], stock_quantity: 20, rating: 4.7, review_count: 189, created_at: '', updated_at: '' },
                { id: '4', name: 'Vegetable Salad', description: 'Fresh mix of seasonal vegetables', price: 8.99, original_price: null, category_id: '4', is_available: true, preparation_time: 10, dietary_info: { vegan: true, vegetarian: true, gluten_free: true }, allergens: [], stock_quantity: 40, rating: 4.3, review_count: 95, created_at: '', updated_at: '' },
              ].map((food) => (
                <FoodCard key={food.id} food={food as any} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">Ordering delicious food has never been easier. Just follow these simple steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { icon: '📍', title: 'Choose Location', desc: 'Enter your delivery address to find restaurants near you', color: 'bg-blue-100' },
              { icon: '🍽️', title: 'Choose Food', desc: 'Browse menus and select your favorite dishes', color: 'bg-orange-100' },
              { icon: '🚚', title: 'Get Delivery', desc: 'Track your order and enjoy your meal at home', color: 'bg-green-100' },
            ].map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <span className="text-4xl">{step.icon}</span>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-gray-200" />
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* App Download Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">
                Download Our App for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Better Experience</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Get exclusive deals, faster ordering, and easy order tracking with our mobile app. Download now and start enjoying delicious food!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center gap-4 bg-white text-gray-900 px-6 py-4 rounded-2xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Download on the</p>
                    <p className="text-lg font-bold">App Store</p>
                  </div>
                </button>
                <button className="flex items-center gap-4 bg-white text-gray-900 px-6 py-4 rounded-2xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.49l-2.302 2.302-8.634-8.634z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Get it on</p>
                    <p className="text-lg font-bold">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-[3rem] blur-2xl" />
              <div className="relative aspect-[9/16] max-w-sm mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] border-8 border-gray-700 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                <span className="text-[8rem] filter drop-shadow-2xl">📱</span>
                
                {/* App UI Mockup */}
                <div className="absolute bottom-8 left-4 right-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Order Delivered!</p>
                      <p className="text-gray-400 text-xs">Your food is at the door</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
