-- FoodieHub Database Setup Script with Full Seed Data
-- Run this in Supabase SQL Editor

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS homepage_content CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS coupon_type CASCADE;

-- Create Enums
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'driver');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('card', 'cash', 'razorpay');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');

-- Create Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    avatar_url TEXT,
    role user_role DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'driver')),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Create Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Create Food Items Table
CREATE TABLE food_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    image_url TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT true,
    preparation_time INTEGER DEFAULT 15,
    dietary_info JSONB DEFAULT '{}'::jsonb,
    allergens JSONB DEFAULT '[]'::jsonb,
    stock_quantity INTEGER DEFAULT 100,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_food_items_category ON food_items(category_id);
CREATE INDEX idx_food_items_available ON food_items(is_available);
CREATE INDEX idx_food_items_price ON food_items(price);
CREATE INDEX idx_food_items_rating ON food_items(rating DESC);

-- Create Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    status order_status DEFAULT 'pending',
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    coupon_code TEXT,
    delivery_address TEXT NOT NULL,
    delivery_phone TEXT NOT NULL,
    delivery_instructions TEXT,
    payment_method payment_method DEFAULT 'card',
    payment_status payment_status DEFAULT 'pending',
    payment_id TEXT,
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_date ON orders(order_date DESC);

-- Create Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES food_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Create Coupons Table
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    type coupon_type DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    minimum_order DECIMAL(10, 2) DEFAULT 0,
    maximum_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    usage_limit_per_user INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);

-- Create Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_food_item ON reviews(food_item_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);

-- Create Homepage Content Table
CREATE TABLE homepage_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_name TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    media JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_homepage_content_sort ON homepage_content(sort_order);

-- Create Cart Items Table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, food_item_id)
);

CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_cart_items_food ON cart_items(food_item_id);

-- ============================================
-- INSERT SEED DATA
-- ============================================

-- Insert Sample Profiles (Admin, Driver, Customers)
INSERT INTO profiles (id, email, full_name, phone, role, address) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@foodiehub.com', 'Admin User', '+1 234 567 8900', 'admin', ''),
('a0000000-0000-0000-0000-000000000002', 'driver@foodiehub.com', 'Delivery Driver', '+1 234 567 8905', 'driver', ''),
('a0000000-0000-0000-0000-000000000003', 'john.doe@example.com', 'John Doe', '+1 234 567 8901', 'customer', '123 Main St, City, NY 10001'),
('a0000000-0000-0000-0000-000000000004', 'jane.smith@example.com', 'Jane Smith', '+1 234 567 8902', 'customer', '456 Oak Ave, Town, NY 10002'),
('a0000000-0000-0000-0000-000000000005', 'mike.wilson@example.com', 'Mike Wilson', '+1 234 567 8903', 'customer', '789 Pine Rd, Village, NY 10003'),
('a0000000-0000-0000-0000-000000000006', 'sarah.johnson@example.com', 'Sarah Johnson', '+1 234 567 8904', 'customer', '321 Elm St, Borough, NY 10004');

-- Insert Categories
INSERT INTO categories (id, name, description, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'Burgers', 'Juicy and delicious burgers with fresh ingredients', 1),
('c0000000-0000-0000-0000-000000000002', 'Pizza', 'Wood-fired and specialty pizzas', 2),
('c0000000-0000-0000-0000-000000000003', 'Rice Bowls', 'Biryani, fried rice and healthy bowls', 3),
('c0000000-0000-0000-0000-000000000004', 'Pasta', 'Italian pasta dishes', 4),
('c0000000-0000-0000-0000-000000000005', 'Seafood', 'Fresh fish and seafood delicacies', 5),
('c0000000-0000-0000-0000-000000000006', 'Salads', 'Fresh and healthy salads', 6),
('c0000000-0000-0000-0000-000000000007', 'Desserts', 'Sweet treats and desserts', 7),
('c0000000-0000-0000-0000-000000000008', 'Beverages', 'Refreshing drinks and smoothies', 8);

-- Insert Food Items
INSERT INTO food_items (name, description, price, original_price, category_id, is_available, preparation_time, dietary_info, allergens, stock_quantity, rating, review_count) VALUES

-- Burgers
('Classic Burger', 'Juicy beef patty with lettuce, tomato, onion, and our special sauce', 12.99, 15.99, 'c0000000-0000-0000-0000-000000000001', true, 15, '{"vegetarian": false}', '["gluten", "dairy"]', 100, 4.5, 128),
('Double Cheese Burger', 'Two beef patties with double cheese, pickles, and special sauce', 15.99, NULL, 'c0000000-0000-0000-0000-000000000001', true, 18, '{"vegetarian": false}', '["gluten", "dairy"]', 80, 4.7, 89),
('Chicken Burger', 'Grilled chicken breast with fresh veggies and mayo', 11.99, NULL, 'c0000000-0000-0000-0000-000000000001', true, 15, '{"vegetarian": false}', '["gluten"]', 90, 4.4, 67),
('Veggie Burger', 'Crispy veggie patty with avocado and sprouts', 10.99, 12.99, 'c0000000-0000-0000-0000-000000000001', true, 12, '{"vegetarian": true}', '["gluten"]', 70, 4.2, 45),

-- Pizza
('Margherita Pizza', 'Traditional Italian pizza with fresh mozzarella and basil', 14.99, NULL, 'c0000000-0000-0000-0000-000000000002', true, 20, '{"vegetarian": true}', '["gluten", "dairy"]', 60, 4.8, 256),
('Pepperoni Pizza', 'Classic pizza with pepperoni, mozzarella, and our special sauce', 16.99, 18.99, 'c0000000-0000-0000-0000-000000000002', true, 20, '{"vegetarian": false}', '["gluten", "dairy"]', 55, 4.6, 198),
('Chicken Pizza', 'Grilled chicken with bell peppers and onions', 15.99, NULL, 'c0000000-0000-0000-0000-000000000002', true, 20, '{"vegetarian": false}', '["gluten", "dairy"]', 50, 4.5, 134),
('Veggie Supreme Pizza', 'Loaded with fresh vegetables and olives', 13.99, NULL, 'c0000000-0000-0000-0000-000000000002', true, 18, '{"vegetarian": true}', '["gluten", "dairy"]', 45, 4.4, 98),

-- Rice Bowls
('Chicken Biryani', 'Aromatic basmati rice cooked with tender chicken and spices', 16.99, 18.99, 'c0000000-0000-0000-0000-000000000003', true, 25, '{"gluten_free": true}', '[]', 40, 4.7, 189),
('Vegetable Fried Rice', 'Stir-fried rice with fresh vegetables and soy sauce', 11.99, NULL, 'c0000000-0000-0000-0000-000000000003', true, 15, '{"vegan": true}', '["soy"]', 55, 4.4, 145),
('Shrimp Rice Bowl', 'Fresh shrimp with jasmine rice and veggies', 18.99, NULL, 'c0000000-0000-0000-0000-000000000003', true, 22, '{"gluten_free": true}', '["shellfish", "soy"]', 35, 4.6, 78),
('Paneer Rice Bowl', 'Indian cottage cheese with aromatic rice', 14.99, NULL, 'c0000000-0000-0000-0000-000000000003', true, 20, '{"vegetarian": true, "gluten_free": true}', '["dairy"]', 45, 4.5, 112),

-- Pasta
('Spaghetti Carbonara', 'Classic Italian pasta with creamy egg sauce and bacon', 14.99, NULL, 'c0000000-0000-0000-0000-000000000004', true, 18, '{"vegetarian": false}', '["gluten", "dairy", "eggs"]', 50, 4.7, 234),
('Penne Arrabbiata', 'Penne pasta in spicy tomato garlic sauce', 12.99, NULL, 'c0000000-0000-0000-0000-000000000004', true, 16, '{"vegan": true}', '["gluten"]', 55, 4.3, 167),
('Fettuccine Alfredo', 'Creamy parmesan Alfredo sauce with fettuccine', 13.99, 15.99, 'c0000000-0000-0000-0000-000000000004', true, 17, '{"vegetarian": true}', '["gluten", "dairy"]', 60, 4.5, 198),
('Seafood Pasta', 'Mixed seafood in white wine garlic sauce', 19.99, NULL, 'c0000000-0000-0000-0000-000000000004', true, 22, '{"vegetarian": false}', '["gluten", "shellfish", "dairy"]', 30, 4.6, 89),

-- Seafood
('Grilled Salmon', 'Fresh Atlantic salmon with lemon butter sauce', 22.99, 25.99, 'c0000000-0000-0000-0000-000000000005', true, 25, '{"gluten_free": true}', '["fish", "dairy"]', 25, 4.8, 156),
('Fish and Chips', 'Crispy battered fish with golden fries and tartar sauce', 15.99, NULL, 'c0000000-0000-0000-0000-000000000005', true, 20, '{"vegetarian": false}', '["gluten", "fish"]', 40, 4.6, 198),
('Shrimp Tempura', 'Crispy tempura shrimp with dipping sauce', 17.99, NULL, 'c0000000-0000-0000-0000-000000000005', true, 18, '{"vegetarian": false}', '["gluten", "shellfish", "soy"]', 35, 4.7, 134),
('Crab Cakes', 'Pan-seared crab cakes with remoulade sauce', 19.99, NULL, 'c0000000-0000-0000-0000-000000000005', true, 20, '{"vegetarian": false}', '["gluten", "shellfish", "eggs"]', 20, 4.5, 67),

-- Salads
('Greek Salad', 'Fresh mix of tomatoes, cucumbers, olives, and feta cheese', 9.99, NULL, 'c0000000-0000-0000-0000-000000000006', true, 10, '{"vegetarian": true, "gluten_free": true}', '["dairy"]', 60, 4.5, 78),
('Caesar Salad', 'Romaine lettuce with parmesan, croutons, and caesar dressing', 10.99, NULL, 'c0000000-0000-0000-0000-000000000006', true, 10, '{"vegetarian": true}', '["gluten", "dairy", "eggs"]', 65, 4.4, 156),
('Chicken Salad', 'Grilled chicken over mixed greens with avocado', 14.99, NULL, 'c0000000-0000-0000-0000-000000000006', true, 15, '{"vegetarian": false}', '[]', 45, 4.6, 98),
('Quinoa Bowl', 'Superfood quinoa with roasted veggies and tahini', 12.99, NULL, 'c0000000-0000-0000-0000-000000000006', true, 12, '{"vegan": true}', '[]', 50, 4.3, 67),

-- Desserts
('Chocolate Lava Cake', 'Warm chocolate cake with molten center and vanilla ice cream', 7.99, 8.99, 'c0000000-0000-0000-0000-000000000007', true, 12, '{"vegetarian": true}', '["gluten", "dairy", "eggs"]', 80, 4.9, 312),
('Tiramisu', 'Classic Italian coffee-flavored dessert', 8.99, NULL, 'c0000000-0000-0000-0000-000000000007', true, 5, '{"vegetarian": true}', '["gluten", "dairy", "eggs"]', 40, 4.8, 198),
('New York Cheesecake', 'Creamy cheesecake with graham cracker crust', 7.99, 9.99, 'c0000000-0000-0000-0000-000000000007', true, 5, '{"vegetarian": true}', '["gluten", "dairy"]', 50, 4.7, 245),
('Gulab Jamun', 'Traditional Indian milk sweets in sugar syrup', 6.99, NULL, 'c0000000-0000-0000-0000-000000000007', true, 5, '{"vegetarian": true}', '["dairy", "nuts"]', 60, 4.6, 167),

-- Beverages
('Fresh Lemonade', 'Freshly squeezed lemons with mint', 3.99, NULL, 'c0000000-0000-0000-0000-000000000008', true, 3, '{"vegan": true}', '[]', 200, 4.4, 234),
('Mango Smoothie', 'Fresh mango blended with yogurt', 5.99, NULL, 'c0000000-0000-0000-0000-000000000008', true, 5, '{"vegetarian": true}', '["dairy"]', 120, 4.7, 189),
('Iced Coffee', 'Cold brew coffee with milk', 4.99, NULL, 'c0000000-0000-0000-0000-000000000008', true, 3, '{"vegetarian": true}', '["dairy"]', 150, 4.3, 312),
('Green Tea', 'Premium Japanese green tea', 2.99, NULL, 'c0000000-0000-0000-0000-000000000008', true, 2, '{"vegan": true}', '[]', 180, 4.5, 156);

-- Insert Coupons
INSERT INTO coupons (code, description, type, discount_value, minimum_order, maximum_discount, usage_limit, usage_limit_per_user, valid_from, valid_until, is_active, used_count) VALUES
('WELCOME20', '20 percent off for new customers', 'percentage', 20, 10, 15, 100, 1, NOW(), NOW() + INTERVAL '90 days', true, 45),
('FREEDELIVERY', 'Free delivery on orders above 25 dollars', 'fixed', 2.99, 25, NULL, 500, 3, NOW(), NOW() + INTERVAL '30 days', true, 123),
('SAVE10', '10 dollars off orders above 50 dollars', 'fixed', 10, 50, NULL, NULL, 5, NOW(), NOW() + INTERVAL '60 days', true, 67),
('WEEKEND15', '15 percent off on weekends', 'percentage', 15, 20, 8, 200, 2, NOW(), NOW() + INTERVAL '30 days', true, 89),
('FLAT5', '5 dollars off any order', 'fixed', 5, 15, NULL, NULL, 3, NOW(), NOW() + INTERVAL '90 days', true, 234),
('EXPIRED50', '50 percent off (expired)', 'percentage', 50, 30, 15, NULL, 1, NOW() - INTERVAL '60 days', NOW() - INTERVAL '7 days', false, 34);

-- Insert Sample Orders
INSERT INTO orders (user_id, order_number, status, subtotal, discount, delivery_fee, tax, total, coupon_code, delivery_address, delivery_phone, delivery_instructions, payment_method, payment_status, order_date, delivered_at) VALUES
('a0000000-0000-0000-0000-000000000003', 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || '-0001', 'pending', 42.10, 0, 2.99, 3.12, 48.21, NULL, '123 Main St, City, NY 10001', '+1 234 567 8901', 'Leave at door', 'card', 'pending', NOW(), NULL),
('a0000000-0000-0000-0000-000000000004', 'ORD' || TO_CHAR(NOW(), 'YYYYMMDD') || '-0002', 'confirmed', 55.50, 5, 2.99, 4.56, 58.05, 'SAVE10', '456 Oak Ave, Town, NY 10002', '+1 234 567 8902', '', 'razorpay', 'completed', NOW(), NULL),
('a0000000-0000-0000-0000-000000000005', 'ORD' || TO_CHAR(NOW() - INTERVAL '1 day', 'YYYYMMDD') || '-7891', 'delivered', 28.50, 0, 2.99, 2.52, 34.01, NULL, '789 Pine Rd, Village, NY 10003', '+1 234 567 8903', 'Ring doorbell', 'cash', 'completed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '20 hours'),
('a0000000-0000-0000-0000-000000000006', 'ORD' || TO_CHAR(NOW() - INTERVAL '1 day', 'YYYYMMDD') || '-7892', 'preparing', 72.58, 10, 0, 6.59, 69.17, 'FREEDELIVERY', '321 Elm St, Borough, NY 10004', '+1 234 567 8904', 'Please deliver fast!', 'card', 'completed', NOW() - INTERVAL '1 day', NULL),
('a0000000-0000-0000-0000-000000000003', 'ORD' || TO_CHAR(NOW() - INTERVAL '2 days', 'YYYYMMDD') || '-4561', 'delivered', 35.99, 0, 2.99, 3.12, 42.10, NULL, '123 Main St, City, NY 10001', '+1 234 567 8901', '', 'card', 'completed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '45 hours'),
('a0000000-0000-0000-0000-000000000004', 'ORD' || TO_CHAR(NOW() - INTERVAL '3 days', 'YYYYMMDD') || '-3456', 'delivered', 89.99, 10, 0, 7.79, 87.78, 'WELCOME20', '456 Oak Ave, Town, NY 10002', '+1 234 567 8902', '', 'razorpay', 'completed', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '45 minutes'),
('a0000000-0000-0000-0000-000000000005', 'ORD' || TO_CHAR(NOW() - INTERVAL '4 days', 'YYYYMMDD') || '-2345', 'cancelled', 22.99, 0, 2.99, 2.08, 28.06, NULL, '789 Pine Rd, Village, NY 10003', '+1 234 567 8903', '', 'card', 'refunded', NOW() - INTERVAL '4 days', NULL);

-- Done!
SELECT 'FoodieHub database setup complete!' as message;
SELECT 'Tables created: profiles, categories, food_items, orders, order_items, coupons, reviews, cart_items, homepage_content' as info;
SELECT 'Seed data inserted: 6 users, 8 categories, 32 food items, 6 coupons, 7 orders' as seed_info;
