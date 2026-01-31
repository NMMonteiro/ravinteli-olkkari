import json
import os
from supabase import create_client, Client

# Supabase credentials - Production project
SUPABASE_URL = "https://nudtmksamwwmzrbgstlm.supabase.co"
# Anon key for public access (safe to use client-side)
SUPABASE_KEY = "sb_publishable_6wPpjqpX9ss8IAidXWqh1Q_PA4TZ7XF"

if not SUPABASE_KEY:
    print("ERROR: Please set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY environment variable")
    print("You can find this in your Supabase project settings > API")
    exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

print("="*80)
print("POPULATING SUPABASE TABLES FROM EXCEL DATA")
print("="*80)

# Load menu data
with open('scripts/menu_data.json', 'r', encoding='utf-8') as f:
    menu_data = json.load(f)

print(f"\n📋 Loading {len(menu_data)} food menu items...")

# Transform and insert food menu items
food_items = []
for item in menu_data:
    food_item = {
        "category": item.get("Category", ""),
        "dish_name": item.get("Dish Name", ""),
        "description": item.get("Description", ""),
        "price": float(item.get("Price (€)", 0)),
        "is_chef_choice": item.get("Category") == "5-Course Menu"  # Mark special menu
    }
    food_items.append(food_item)

# Insert food items
try:
    result = supabase.table("food_menu").insert(food_items).execute()
    print(f"✅ Successfully inserted {len(result.data)} food menu items")
except Exception as e:
    print(f"❌ Error inserting food menu: {e}")

print("\n" + "="*80)

# Load cocktail data
with open('scripts/cocktail_data.json', 'r', encoding='utf-8') as f:
    cocktail_data = json.load(f)

print(f"\n🍸 Loading {len(cocktail_data)} cocktail items...")

# Transform and insert cocktails
cocktail_items = []
for item in cocktail_data:
    cocktail_item = {
        "category": item.get("Category", ""),
        "cocktail_name": item.get("Cocktail", ""),
        "abv_notes": item.get("ABV / Notes"),
        "ingredients": item.get("Ingredients", ""),
        "method": item.get("Method", ""),
        "garnish": item.get("Garnish", ""),
        "price": 14.00,  # Default price (can be updated later)
        "is_signature": item.get("Category") == "Signature"
    }
    cocktail_items.append(cocktail_item)

# Insert cocktails
try:
    result = supabase.table("cocktails").insert(cocktail_items).execute()
    print(f"✅ Successfully inserted {len(result.data)} cocktail items")
except Exception as e:
    print(f"❌ Error inserting cocktails: {e}")

print("\n" + "="*80)
print("✅ DATA POPULATION COMPLETE!")
print("="*80)

# Verify counts
try:
    food_count = supabase.table("food_menu").select("id", count="exact").execute()
    cocktail_count = supabase.table("cocktails").select("id", count="exact").execute()
    
    print(f"\n📊 Final counts:")
    print(f"   - Food Menu: {food_count.count} items")
    print(f"   - Cocktails: {cocktail_count.count} items")
except Exception as e:
    print(f"⚠️  Could not verify counts: {e}")
