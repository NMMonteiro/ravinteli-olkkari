# Quick Setup Guide - Food & Cocktail Tables

## Step 1: Create Tables in Supabase

1. Go to https://supabase.com/dashboard
2. Select project: **nudtmksamwwmzrbgstlm**
3. Click **SQL Editor** → **New Query**
4. Copy/paste the SQL from below and click **Run**

## Step 2: Populate Data

After tables are created, run this in your terminal:

```bash
python scripts/populate_supabase.py
```

This will insert:
- 15 food items (Starter, Main, Dessert, 5-Course Menu)
- 13 cocktails (Signature, Classic)

## Step 3: Test

Refresh your app at http://localhost:3000/ and check the Menu screen!

---

## SQL to Run in Supabase Dashboard

```sql
-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create food menu table
CREATE TABLE IF NOT EXISTS public.food_menu (
    id BIGSERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    dish_name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    is_chef_choice BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.food_menu ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on food_menu"
    ON public.food_menu FOR SELECT TO public
    USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access on food_menu"
    ON public.food_menu FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER set_food_menu_updated_at
    BEFORE UPDATE ON public.food_menu
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add indexes
CREATE INDEX idx_food_menu_category ON public.food_menu(category);
CREATE INDEX idx_food_menu_is_chef_choice ON public.food_menu(is_chef_choice) WHERE is_chef_choice = true;

-- Create cocktails table
CREATE TABLE IF NOT EXISTS public.cocktails (
    id BIGSERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    cocktail_name TEXT NOT NULL,
    abv_notes TEXT,
    ingredients TEXT,
    method TEXT,
    garnish TEXT,
    price NUMERIC(10, 2) DEFAULT 14.00,
    image TEXT,
    is_signature BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cocktails ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on cocktails"
    ON public.cocktails FOR SELECT TO public
    USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access on cocktails"
    ON public.cocktails FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create updated_at trigger
CREATE TRIGGER set_cocktails_updated_at
    BEFORE UPDATE ON public.cocktails
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add indexes
CREATE INDEX idx_cocktails_category ON public.cocktails(category);
CREATE INDEX idx_cocktails_is_signature ON public.cocktails(is_signature) WHERE is_signature = true;
```

---

## ✅ Checklist

- [ ] Run SQL in Supabase SQL Editor
- [ ] Run `python scripts/populate_supabase.py`
- [ ] Test menu in browser
- [ ] Verify login still works (it will!)
