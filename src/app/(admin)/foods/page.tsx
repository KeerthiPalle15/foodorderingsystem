'use client';

import { useState, useEffect } from 'react';
import { Button, Badge, Card, Input } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_available: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [foodsData, categoriesData] = await Promise.all([
        (supabase.from('food_items') as any).select('*, categories(*)').order('name'),
        (supabase.from('categories') as any).select('*').order('name'),
      ]);

      if (foodsData.data) setFoods(foodsData.data);
      if (categoriesData.data) setCategories(categoriesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await (supabase.from('food_items') as any).insert({
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        is_available: formData.is_available,
      });

      if (error) throw error;

      setShowForm(false);
      setFormData({ name: '', description: '', price: '', category_id: '', is_available: true });
      fetchData();
    } catch (error) {
      console.error('Error creating food:', error);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      await (supabase as any).from('food_items').update({ is_available: !current }).eq('id', id);
      fetchData();
    } catch (error) {
      console.error('Error updating food:', error);
    }
  };

  const deleteFood = async (id: string) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    
    try {
      await (supabase as any).from('food_items').delete().eq('id', id);
      fetchData();
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Food Items</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Food Item'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Food Item</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Available</span>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">Create Food Item</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{food.name}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">{food.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    {food.categories ? (
                      <Badge>{food.categories.name}</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-orange-500">{formatCurrency(food.price)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={food.is_available ? 'success' : 'danger'}>
                      {food.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAvailability(food.id, food.is_available)}
                      >
                        {food.is_available ? 'Mark Unavailable' : 'Mark Available'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteFood(food.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
