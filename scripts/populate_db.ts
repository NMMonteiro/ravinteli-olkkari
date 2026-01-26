
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const menuItems = [
    { name: 'Cauliflower Bites', description: 'Crispy cauliflower with sesame seeds, spring onion, lemon & scallion emulsion', price: '€13', category: 'Food', image: 'https://images.unsplash.com/photo-1541014741259-df529411b96a?auto=format&fit=crop&w=400&q=80' },
    { name: 'Tiger Prawn', description: 'Herbal couscous salad and garlic herb mayo', price: '€15', category: 'Food', image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=400&q=80' },
    { name: 'Tartar', description: 'Petit tender with fried chanterelles, capers, horseradish, and black garlic', price: '€16', category: 'Food', image: 'https://images.unsplash.com/photo-1511112181689-5011a7a1b13b?auto=format&fit=crop&w=400&q=80' },
    { name: 'Pork Belly', description: 'Caramelized pork belly, pickle salad, coconut flakes', price: '€14', category: 'Food', image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=400&q=80' },
    { name: 'Brisket', description: 'Slow-cooked brisket, potato terrine, cauliflower puree, port wine sauce', price: '€33', category: 'Food', image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=400&q=80' },
    { name: 'White Fish', description: 'Pan-seared white fish, burnt leek, orange & citrus sauce, caramelized fennel purée', price: '€35', category: 'Food', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80' },
    { name: 'Steak Frites', description: 'Grilled petit tender with thin-cut fries, creamy brandy-bone marrow-peppercorn sauce', price: '€37', category: 'Food', image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&w=400&q=80' },
];

const drinks = [
    { name: 'Funky Monkey', description: 'Chartreuse, Galliano, Orange, Lime, Ginger Beer', price: '€15', category: 'Drinks', image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=400&q=80' },
    { name: 'Violent Negroni', description: 'Gin, Campari, Violet, Chambord', price: '€15', category: 'Drinks', image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=400&q=80' },
    { name: 'Espresso Martini', description: 'Stoli, Galliano, Espresso', price: '€15', category: 'Drinks', image: 'https://images.unsplash.com/photo-1545438102-793c79d10f99?auto=format&fit=crop&w=400&q=80' },
];

async function populate() {
    console.log('Populating menu items...');
    const { error: menuError } = await supabase.from('menu_items').upsert(menuItems, { onConflict: 'name' });
    if (menuError) console.error('Error populating menu:', menuError);
    else console.log('Successfully populated menu items.');

    console.log('Populating drinks...');
    // Check if we put drinks in menu_items with a category or a different table
    // According to types.ts there is only MenuItem
    const allItems = [...menuItems, ...drinks];
    const { error: allItemsError } = await supabase.from('menu_items').upsert(allItems, { onConflict: 'name' });
    if (allItemsError) console.error('Error populating all items:', allItemsError);
    else console.log('Successfully populated all items.');
}

populate();
