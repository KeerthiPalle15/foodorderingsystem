'use client';

import { Header, Footer } from '@/components/customer';

export default function AboutPage() {
  const features = [
    {
      icon: '🍔',
      title: 'Quality Food',
      description: 'We partner with the best restaurants to ensure every meal meets our high standards.',
    },
    {
      icon: '⚡',
      title: 'Fast Delivery',
      description: 'Our optimized delivery network ensures your food arrives hot and fresh.',
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Enjoy great deals and discounts on your favorite foods every day.',
    },
    {
      icon: '🎯',
      title: 'Customer First',
      description: 'Your satisfaction is our priority with 24/7 support and easy returns.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Restaurant Partners' },
    { value: '50,000+', label: 'Happy Customers' },
    { value: '100,000+', label: 'Orders Delivered' },
    { value: '4.8', label: 'Average Rating' },
  ];

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: null,
    },
    {
      name: 'Sarah Johnson',
      role: 'Head of Operations',
      image: null,
    },
    {
      name: 'Mike Chen',
      role: 'Head of Technology',
      image: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-orange-500">FoodieHub</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're on a mission to make delicious food accessible to everyone, 
              connecting food lovers with the best local restaurants through 
              technology and exceptional service.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2020, FoodieHub started with a simple idea: everyone deserves 
                  access to great food without the hassle. What began as a small startup 
                  has grown into one of the leading food delivery platforms.
                </p>
                <p>
                  Today, we partner with over 500 restaurants across the country, 
                  delivering thousands of meals every day. Our commitment to quality, 
                  speed, and customer satisfaction remains unchanged.
                </p>
                <p>
                  We believe in supporting local businesses, sustainable practices, 
                  and creating jobs in our communities. Every order you place helps 
                  us grow and improve our service.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl flex items-center justify-center">
                <span className="text-8xl">🍽️</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-orange-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best food delivery experience
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center">
                <span className="text-8xl">🎯</span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">❤️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Quality First</h3>
                    <p className="text-gray-600">Never compromise on food quality or delivery speed.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Community</h3>
                    <p className="text-gray-600">Support local businesses and create opportunities.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Sustainability</h3>
                    <p className="text-gray-600">Eco-friendly packaging and responsible practices.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💡</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Innovation</h3>
                    <p className="text-gray-600">Constantly improve our technology and service.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind FoodieHub
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Order?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Experience the best food delivery service today. Download our app 
            or order directly from our website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/menu"
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
            >
              Browse Menu
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
