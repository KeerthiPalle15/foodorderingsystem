'use client';

import { useState, useEffect } from 'react';
import { Header, Footer, FoodCard } from '@/components/customer';
import { Input, Badge, Card } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

type Category = Database['public']['Tables']['categories']['Row'];
type FoodItem = Database['public']['Tables']['food_items']['Row'];

// Category icons mapping
const categoryIcons: Record<string, string> = {
  '1': '🍔',
  '2': '🍕',
  '3': '🍚',
  '4': '🥗',
  '5': '🍰',
  '6': '🥤',
  'default': '🍽️',
};

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, searchQuery, foodItems]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      // Fetch food items
      const { data: foodData } = await supabase
        .from('food_items')
        .select('*')
        .eq('is_available', true)
        .order('name');
      
      if (categoriesData) {
        setCategories([
          { id: 'all', name: 'All', description: null, image_url: null, sort_order: 0, is_active: true, created_at: '' },
          ...categoriesData
        ]);
      }
      
      if (foodData) {
        setFoodItems(foodData);
        setFilteredItems(foodData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = foodItems;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category_id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Our Menu</h1>
          <p className="mt-2 text-gray-500">Discover delicious food from the best restaurants</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="search"
              placeholder="Search for delicious food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-sm">
              Showing <span className="font-semibold text-gray-900">{filteredItems.length}</span> items
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200 hover:border-orange-200'
                  }`}
                >
                  <span className="text-lg">{categoryIcons[category.id] || categoryIcons['default']}</span>
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin" style={{ borderBottomColor: '#f97316' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🍔</span>
                </div>
              </div>
              <p className="mt-4 text-gray-500">Loading delicious food...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No food items found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or category filter</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear filters
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} food={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
