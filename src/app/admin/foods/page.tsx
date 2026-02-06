'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import toast from 'react-hot-toast';

type FoodItem = Database['public']['Tables']['food_items']['Row'] & {
  categories?: { name: string };
};

type Category = Database['public']['Tables']['categories']['Row'];

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: categoriesData } = await (supabase.from('categories') as any)
        .select('*')
        .order('sort_order', { ascending: true });

      setCategories(categoriesData || []);

      const { data: foodsData } = await (supabase.from('food_items') as any)
        .select('*, categories(*)')
        .order('name', { ascending: true });

      setFoods(foodsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (foodId: string, currentStatus: boolean) => {
    try {
      await (supabase.from('food_items') as any)
        .update({ is_available: !currentStatus })
        .eq('id', foodId);

      setFoods(foods.map(f => 
        f.id === foodId ? { ...f, is_available: !f.is_available } : f
      ));
      
      toast.success('Updated');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const deleteFood = async (foodId: string) => {
    if (!confirm('Delete this food?')) return;
    
    try {
      await (supabase.from('food_items') as any).delete().eq('id', foodId);
      setFoods(foods.filter(f => f.id !== foodId));
      toast.success('Deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Food Items</h1>
        <Button onClick={() => setShowModal(true)}>Add New Food</Button>
      </div>

      {foods.length === 0 ? (
        <Card className="p-8 text-center">
          <span className="text-6xl mb-4 block">🍔</span>
          <p className="text-gray-500 mb-4">No food items found</p>
          <Button onClick={() => setShowModal(true)}>Add First Food Item</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <Card key={food.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                {food.image_url ? (
                  <img src={food.image_url} alt={food.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">🍔</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{food.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{food.description}</p>
                    {food.categories && (
                      <Badge variant="default" className="mt-2">{food.categories.name}</Badge>
                    )}
                  </div>
                  <Badge variant={food.is_available ? 'success' : 'danger'} className="ml-2">
                    {food.is_available ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="font-bold text-gray-900">{formatCurrency(food.price)}</span>
                    {food.original_price && food.original_price > food.price && (
                      <span className="text-sm text-gray-400 line-through ml-2">{formatCurrency(food.original_price)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600">{food.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => toggleAvailability(food.id, food.is_available)}
                    className="flex-1 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 border border-gray-200 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFood(food.id)}
                    className="flex-1 py-2 text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-200 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Food</h2>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const foodData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                category_id: formData.get('category_id') as string,
                is_available: true,
                preparation_time: parseInt(formData.get('preparation_time') as string) || 15,
              };
              
              await (supabase.from('food_items') as any).insert(foodData);
              fetchData();
              setShowModal(false);
              toast.success('Food added');
            }}>
              <input name="name" type="text" placeholder="Food Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              <textarea name="description" placeholder="Description" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" rows={3} required />
              <div className="grid grid-cols-2 gap-4">
                <input name="price" type="number" step="0.01" placeholder="Price" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
                <input name="preparation_time" type="number" placeholder="Prep Time (min)" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <select name="category_id" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">Save</Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
