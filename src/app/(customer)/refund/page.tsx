'use client';

import { Header, Footer } from '@/components/customer';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
            <p className="text-gray-600 mb-4">
              At FoodieHub, we want you to be completely satisfied with your food delivery experience. 
              This Refund Policy outlines the terms and conditions under which refunds may be issued.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility for Refunds</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-3">You may be eligible for a refund if:</h3>
              <ul className="list-disc list-inside space-y-2 text-green-700">
                <li>Your order arrives more than 30 minutes late</li>
                <li>Items are missing from your order</li>
                <li>Food items are damaged or spoiled upon delivery</li>
                <li>You received the wrong items</li>
                <li>The restaurant cancels your order before preparation</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Refund Timeframe</h2>
            <p className="text-gray-600 mb-4">
              Refund requests must be submitted within <strong>24 hours</strong> of order delivery. 
              Requests submitted after this period may not be eligible for review.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How to Request a Refund</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Go to your Account &gt; Orders</li>
                <li>Select the order you wish to request a refund for</li>
                <li>Click on "Request Refund" button</li>
                <li>Select the reason for your refund request</li>
                <li>Submit your request with any relevant details or photos</li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Refund Processing</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h3 className="font-semibold text-orange-800 mb-2">Digital Payments</h3>
                <p className="text-orange-700">
                  Refunds to your original payment method will be processed within 5-7 business days.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-800 mb-2">Cash on Delivery</h3>
                <p className="text-blue-700">
                  Refunds will be issued as FoodieHub credits within 24 hours of approval.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Non-Refundable Items</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-700 mb-3">The following are not eligible for refunds:</p>
              <ul className="list-disc list-inside space-y-2 text-red-600">
                <li>Orders that have been consumed or partially consumed</li>
                <li>Requests made after 24 hours of delivery</li>
                <li>Customized orders with special ingredients</li>
                <li>Orders where the issue was not reported at delivery</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Refund Policy or need assistance with a refund request, 
              please contact our customer support team.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:support@foodiehub.com" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@foodiehub.com
              </a>
              <a href="tel:+1234567890" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +1 (234) 567-890
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
