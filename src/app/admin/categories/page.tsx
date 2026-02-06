'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';
import toast from 'react-hot-toast';

type Category = Database['public']['Tables']['categories']['Row'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await (supabase.from('categories') as any)
        .select('*')
        .order('sort_order', { ascending: true });

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (categoryId: string, currentStatus: boolean) => {
    try {
      await (supabase.from('categories') as any)
        .update({ is_active: !currentStatus })
        .eq('id', categoryId);

      setCategories(categories.map(c => 
        c.id === categoryId ? { ...c, is_active: !c.is_active } : c
      ));
      
      toast.success('Updated');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button onClick={() => setShowModal(true)}>Add New Category</Button>
      </div>

      {categories.length === 0 ? (
        <Card className="p-8 text-center">
          <span className="text-6xl mb-4 block">🍽️</span>
          <p className="text-gray-500 mb-4">No categories found</p>
          <Button onClick={() => setShowModal(true)}>Add First Category</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                {category.image_url ? (
                  <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl">🍽️</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  </div>
                  <Badge variant={category.is_active ? 'success' : 'danger'}>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Sort: {category.sort_order}</span>
                  <button 
                    onClick={() => toggleActive(category.id, category.is_active)} 
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    {category.is_active ? 'Deactivate' : 'Activate'}
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Category</h2>
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const categoryData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                sort_order: parseInt(formData.get('sort_order') as string) || 0,
                is_active: true,
              };
              
              await (supabase.from('categories') as any).insert(categoryData);
              fetchCategories();
              setShowModal(false);
              toast.success('Category added');
            }}>
              <input name="name" type="text" placeholder="Category Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
              <textarea name="description" placeholder="Description" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" rows={3} />
              <input name="sort_order" type="number" placeholder="Sort Order" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
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
