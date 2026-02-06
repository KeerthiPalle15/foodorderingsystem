'use client';

import { Header, Footer } from '@/components/customer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Terms of <span className="text-orange-500">Service</span>
          </h1>
          <p className="text-xl text-gray-600">
            Last Updated: February 5, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using FoodieHub's website and mobile application, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  FoodieHub provides an online platform for ordering food delivery services. You agree to use the service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the service.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By using our service, you agree to provide accurate, current, and complete information about yourself as prompted by the registration and ordering processes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When you create an account with us, you must provide us with accurate and complete information. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Safeguarding the password and account details.</li>
                  <li>All activities that occur under your account.</li>
                  <li>Notifying us immediately of any unauthorized use of your account.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Orders and Payments</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  When you place an order through our service, you agree to pay all applicable charges, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>The price of the food items ordered.</li>
                  <li>Delivery fees and any applicable taxes.</li>
                  <li>Any discounts or promotional offers applied at the time of order.</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Payment must be made at the time of order placement or upon delivery, depending on the payment method selected.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Delivery Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We strive to deliver orders within the estimated time frame provided at checkout. However, delivery times may vary due to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Restaurant preparation time.</li>
                  <li>Traffic and weather conditions.</li>
                  <li>Delivery distance and availability of delivery partners.</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  You agree to be available at the delivery address provided. If you are not available, we may leave the order at a safe location or return it to the restaurant, and you may be charged for the order.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Cancellation and Refunds</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You may cancel your order within 5 minutes of placing it without any charges. After this period:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>If the restaurant has not started preparing your order, you may cancel with a full refund.</li>
                  <li>If preparation has started, cancellation may not be possible.</li>
                  <li>Refunds for quality issues will be evaluated on a case-by-case basis.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Food Quality and Allergies</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We work with restaurant partners to ensure food quality and accuracy. However:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>We cannot guarantee that any food item is free of allergens.</li>
                  <li>It is your responsibility to inform us of any allergies or dietary restrictions.</li>
                  <li>Please review allergen information provided on product pages before ordering.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Promotions and Coupons</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  From time to time, we may offer promotions, discounts, or coupon codes. These are subject to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Minimum order requirements as specified in the offer.</li>
                  <li>Expiration dates and usage limits.</li>
                  <li>Exclusion from certain menu items or restaurants.</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-4">
                  We reserve the right to modify or withdraw any promotion at any time without prior notice.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content on this website and app, including logos, trademarks, designs, text, graphics, and software, is the property of FoodieHub or its licensors and is protected by copyright and trademark laws. You may not use any of our intellectual property without our prior written consent.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  To the maximum extent permitted by law, FoodieHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">11. Disclaimer of Warranties</h2>
                <p className="text-gray-600 leading-relaxed">
                  The service is provided on an "as is" and "as available" basis. FoodieHub makes no representations or warranties of any kind, express or implied, regarding the operation or availability of the service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">12. Termination</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will cease immediately.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">13. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide notice prior to any new terms taking effect. Your continued use of the service after such changes constitutes acceptance of the new Terms.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about these Terms, please contact us:
                </p>
                <div className="mt-4 space-y-2 text-gray-600">
                  <p>Email: support@foodiehub.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Address: 123 Foodie Street, City, State 12345</p>
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
