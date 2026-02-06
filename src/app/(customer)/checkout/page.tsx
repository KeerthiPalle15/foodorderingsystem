'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/customer';
import { AddressMap } from '@/components/customer/AddressMap';
import { Button, Card, Input } from '@/components/ui';
import { useCart } from '@/lib/hooks-cart';
import { supabase } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

interface DeliveryInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  instructions: string;
  latitude: number;
  longitude: number;
}

interface OrderItem {
  food_id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryFee, getTax, getTotal, clearCart, applyCoupon, removeCoupon, getDiscount, couponCode: storeCouponCode } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [mapAddress, setMapAddress] = useState('');
  
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: '',
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    fetchUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        setDeliveryInfo(prev => ({ ...prev, email: session.user?.email || '' }));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(session.user);
    setDeliveryInfo(prev => ({ ...prev, email: session.user.email || '' }));
  };

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setMapAddress(address);
    setDeliveryInfo(prev => ({
      ...prev,
      address: address,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return;

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Invalid coupon code');
        return;
      }

      setAppliedCoupon(data.coupon);
      applyCoupon(data.coupon.code, {
        type: data.coupon.type,
        discount_value: data.coupon.discount_value,
        minimum_order: data.coupon.minimum_order,
        maximum_discount: data.coupon.maximum_discount,
      });
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error('Failed to apply coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    removeCoupon();
    setPromoCode('');
    toast.success('Coupon removed');
  };

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const discount = getDiscount();
  const total = getTotal() - discount;
  const finalTotal = Math.max(total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!deliveryInfo.fullName.trim()) {
      toast.error('Please enter your full name');
      setLoading(false);
      return;
    }
    if (!deliveryInfo.phone.trim()) {
      toast.error('Please enter your phone number');
      setLoading(false);
      return;
    }
    if (!deliveryInfo.city.trim()) {
      toast.error('Please enter your city');
      setLoading(false);
      return;
    }
    if (!deliveryInfo.address.trim() && !mapAddress.trim()) {
      toast.error('Please select a delivery location from the map or enter an address');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Get auth token for API request
      const { data: { session } } = await supabase.auth.getSession();
      
      const orderItems: OrderItem[] = items.map((item) => ({
        food_id: item.food_item.id,
        name: item.food_item.name,
        price: item.food_item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        items: orderItems,
        deliveryAddress: deliveryInfo.address || mapAddress,
        deliveryPhone: deliveryInfo.phone,
        deliveryInstructions: deliveryInfo.instructions,
        paymentMethod,
        couponCode: storeCouponCode,
        latitude: deliveryInfo.latitude || 0,
        longitude: deliveryInfo.longitude || 0,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : '',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      clearCart();
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <Toaster position="top-center" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-4">Add some items to checkout</p>
            <Button onClick={() => router.push('/menu')}>Browse Menu</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster position="top-center" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={deliveryInfo.fullName}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={deliveryInfo.email}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={deliveryInfo.phone}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                  required
                />
                <Input
                  label="City"
                  value={deliveryInfo.city}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                  required
                />
                <Input
                  label="State"
                  value={deliveryInfo.state}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
                  required
                />
                <Input
                  label="ZIP Code"
                  value={deliveryInfo.zipCode}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, zipCode: e.target.value })}
                  required
                />
              </div>
              
              {/* Address Map */}
              <div className="mt-6">
                <AddressMap 
                  onAddressSelect={handleAddressSelect}
                  initialAddress={mapAddress}
                />
              </div>
              
              {/* Hidden address field for form validation */}
              <input 
                type="hidden" 
                name="address" 
                value={deliveryInfo.address} 
                required 
              />
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Instructions (optional)
                </label>
                <textarea
                  value={deliveryInfo.instructions}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, instructions: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="E.g., Ring the doorbell, leave at door..."
                />
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                  paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-orange-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-100 rounded text-xs font-medium text-green-700">✓ Available</span>
                  </div>
                </label>
              </div>
              <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pay with cash when your order is delivered at your doorstep
              </p>
            </Card>

            {/* Promo Code */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Promo Code</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <Button type="button" variant="outline" onClick={handleRemoveCoupon}>
                    Remove
                  </Button>
                ) : (
                  <Button type="button" onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                )}
              </div>
              {appliedCoupon && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">
                    {appliedCoupon.code} applied: {appliedCoupon.type === 'percentage' 
                      ? `${appliedCoupon.discount_value}% off` 
                      : formatCurrency(appliedCoupon.discount_value) + ' off'}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.food_item.name}</span>
                      <span className="font-medium">{formatCurrency(item.food_item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 shadow-lg shadow-orange-500/25"
                  size="lg"
                  loading={loading}
                >
                  Place Order
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing an order, you agree to our Terms & Privacy Policy
                </p>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
