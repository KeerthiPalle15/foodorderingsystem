'use client';

import { useState } from 'react';
import { Header, Footer } from '@/components/customer';
import { Card } from '@/components/ui';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Ordering
  {
    question: 'How do I place an order?',
    answer: 'Browse our menu, add items to your cart, and proceed to checkout. Enter your delivery address and payment details to complete your order.',
    category: 'Ordering',
  },
  {
    question: 'Can I modify or cancel my order?',
    answer: 'You can modify or cancel your order within 5 minutes of placing it. After that, please contact our support team for assistance. Changes may not be possible once preparation has started.',
    category: 'Ordering',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order is confirmed, you\'ll receive a confirmation SMS and email with a tracking link. You can also track your order in real-time from your account dashboard under "My Orders".',
    category: 'Ordering',
  },
  {
    question: 'What if my order is wrong or missing items?',
    answer: 'We apologize for any inconvenience. Please contact our support team immediately with your order number, and we\'ll resolve the issue as quickly as possible.',
    category: 'Ordering',
  },
  
  // Delivery
  {
    question: 'What areas do you deliver to?',
    answer: 'We currently deliver to most areas within the city. Enter your address on the checkout page to confirm delivery availability to your specific location.',
    category: 'Delivery',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery times vary based on your location and the restaurant\'s preparation time. Average delivery time is 30-45 minutes. You\'ll receive an estimated delivery time when you place your order.',
    category: 'Delivery',
  },
  {
    question: 'Is delivery free?',
    answer: 'Delivery is free for orders over $20. For orders under $20, a small delivery fee of $2.99 applies. Delivery fees are displayed at checkout before you confirm your order.',
    category: 'Delivery',
  },
  {
    question: 'Can I schedule a delivery for later?',
    answer: 'Yes! You can schedule your delivery for up to 7 days in advance. Simply select your preferred delivery time slot at checkout.',
    category: 'Delivery',
  },
  
  // Payment
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI, Net Banking, and cash on delivery. We also support popular digital wallets.',
    category: 'Payment',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes, absolutely. All payments are processed through secure, encrypted connections. We never store your full payment details on our servers.',
    category: 'Payment',
  },
  {
    question: 'Can I split payment between multiple methods?',
    answer: 'Currently, we only support a single payment method per order. You can choose to pay with a gift card balance or coupon code along with your primary payment method.',
    category: 'Payment',
  },
  
  // Refunds & Returns
  {
    question: 'What is your refund policy?',
    answer: 'If you\'re not satisfied with your order for any reason, please contact us within 24 hours of delivery. We offer full refunds or replacements for orders that don\'t meet our quality standards.',
    category: 'Refunds',
  },
  {
    question: 'How long do refunds take?',
    answer: 'Refunds are typically processed within 5-7 business days. The refund will be credited to your original payment method. You\'ll receive a confirmation email once the refund is processed.',
    category: 'Refunds',
  },
  {
    question: 'Can I get a refund if I don\'t like the food?',
    answer: 'Yes, we stand behind our service. If you\'re not satisfied with your order, please contact our support team within 24 hours for a full refund or reorder.',
    category: 'Refunds',
  },
  
  // Account
  {
    question: 'Do I need an account to order?',
    answer: 'No, you can order as a guest. However, creating an account allows you to track orders, save favorite restaurants, and enjoy a faster checkout experience.',
    category: 'Account',
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click on "Sign In" at the top of the page, then select "Forgot Password". Enter your email address, and we\'ll send you a link to reset your password.',
    category: 'Account',
  },
  {
    question: 'How do I update my delivery address?',
    answer: 'Go to your Account Settings to update your default delivery address. You can also enter a different address at checkout for any specific order.',
    category: 'Account',
  },
  
  // Promotions
  {
    question: 'How do I apply a coupon code?',
    answer: 'Enter your coupon code in the "Coupon Code" field at checkout and click "Apply". The discount will be reflected in your order total if the code is valid.',
    category: 'Promotions',
  },
  {
    question: 'Why isn\'t my coupon working?',
    answer: 'Coupons may have minimum order requirements, expiration dates, or usage limits. Check the coupon terms and conditions, or contact our support team for assistance.',
    category: 'Promotions',
  },
  {
    question: 'How do I earn and redeem points?',
    answer: 'Create an account to start earning points with every order. Points can be redeemed for discounts in your account dashboard. 100 points = $1 off.',
    category: 'Promotions',
  },
];

const categories = ['All', 'Ordering', 'Delivery', 'Payment', 'Refunds', 'Account', 'Promotions'];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFAQs = selectedCategory === 'All'
    ? faqs
    : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about ordering, delivery, payments, and more.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 -mt-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <input
              type="search"
              placeholder="Search for answers..."
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
            />
            <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-8 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <Card
                key={index}
                className={`overflow-hidden transition-all ${
                  openIndex === index ? 'ring-2 ring-orange-500' : ''
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-medium text-orange-500 mb-1 block">{faq.category}</span>
                    <span className="font-semibold text-gray-900 text-lg">{faq.question}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-400 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
