-- Add latitude and longitude columns to orders table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_latitude numeric(10, 7);

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_longitude numeric(10, 7);

-- Verify the columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN ('delivery_latitude', 'delivery_longitude');
