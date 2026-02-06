'use client';

import { Header, Footer } from '@/components/customer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Privacy <span className="text-orange-500">Policy</span>
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
                <h2 className="text-xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to FoodieHub's Privacy Policy. This policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may collect personal information that you voluntarily provide to us when you register on the Site, express an interest in obtaining information about us or our products and services, when you participate in activities on the Site, or otherwise when you contact us.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Personal and Identification Information:</strong> Name, email address, telephone number, delivery address, and payment information.</li>
                  <li><strong>Transaction Information:</strong> Order history, payment transactions, and customer support requests.</li>
                  <li><strong>Technical Information:</strong> IP address, browser type, operating system, and device information.</li>
                  <li><strong>Usage Data:</strong> Pages visited, time spent on pages, and interaction with the Site.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Process and manage your orders, including payment processing and order fulfillment.</li>
                  <li>Send you order confirmations, updates, and administrative messages.</li>
                  <li>Improve our services, user experience, and website functionality.</li>
                  <li>Send you promotional communications about offers, features, and products (with your consent).</li>
                  <li>Respond to your comments, questions, and provide customer support.</li>
                  <li>Detect and prevent fraud, unauthorized transactions, and other illegal activities.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>With Service Providers:</strong> We may share your information with third-party vendors who perform services for us.</li>
                  <li><strong>With Restaurant Partners:</strong> We share necessary order information with the restaurants preparing your food.</li>
                  <li><strong>With Delivery Partners:</strong> We share delivery-related information with our delivery personnel.</li>
                  <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose your information when required by law or in response to valid legal requests.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to help customize the Site and improve your experience. Most browsers are set to accept cookies by default. You can remove or reject cookies, but be aware that such action could affect the availability and functionality of the Site.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>The right to access the personal information we hold about you.</li>
                  <li>The right to request correction of inaccurate or incomplete information.</li>
                  <li>The right to request deletion of your personal information.</li>
                  <li>The right to opt-out of marketing communications.</li>
                  <li>The right to data portability.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  The Site is not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">9. Third-Party Links</h2>
                <p className="text-gray-600 leading-relaxed">
                  The Site may contain links to third-party websites and applications of interest. Once you use these links to leave the Site, you should note that we do not have any control over that third-party website. We are not responsible for the protection and privacy of any information which you provide while visiting such sites.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date at the top of this privacy policy. You are advised to review this privacy policy periodically for any changes.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 space-y-2 text-gray-600">
                  <p>Email: privacy@foodiehub.com</p>
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
