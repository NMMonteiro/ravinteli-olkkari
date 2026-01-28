import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBSITE_URL = "https://ravinteliolkkari.fi/";

Deno.serve(async (req) => {
    // CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
            }
        });
    }

    try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        console.log(`Fetching website content from ${WEBSITE_URL}...`);

        // Use a simple fetch to get the HTML
        const response = await fetch(WEBSITE_URL);
        if (!response.ok) throw new Error(`Failed to fetch website: ${response.statusText}`);

        const html = await response.text();

        // Basic "Scraper" logic to extract meaningful text
        // In a real edge environment, we can't use DOMParser easily without extra deps,
        // so we'll use regex to get meta description and some key identifiers.

        const descriptionMatch = html.match(/<meta name="description" content="([^"]+)"/i) ||
            html.match(/<meta property="og:description" content="([^"]+)"/i);
        const description = descriptionMatch ? descriptionMatch[1] : "";

        // Look for common patterns like Address or Phone if they exist in the text
        const phoneMatch = html.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/g);
        const contactInfo = phoneMatch ? `Contact Phone: ${phoneMatch[0]}` : "";

        // Extracting text between common tags (simplified)
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : "Ravinteli Olkkari";

        const now = new Date().toISOString();

        // Update the Knowledge Base
        const updates = [
            { category: 'Website Auto-Summary', content: `Auto-synced from ${WEBSITE_URL} on ${now}. ${description}` },
            { category: 'Website Title', content: title }
        ];

        if (contactInfo) {
            updates.push({ category: 'Contact Info (Auto)', content: contactInfo });
        }

        // Upsert into knowledge_base
        // For simplicity in this demo, we'll just insert/update based on category
        for (const update of updates) {
            const { error: upsertError } = await supabase
                .from('knowledge_base')
                .upsert(
                    { category: update.category, content: update.content, updated_at: now },
                    { onConflict: 'category' }
                );

            if (upsertError) console.error(`Error upserting ${update.category}:`, upsertError);
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Website context synced successfully",
            synced_at: now
        }), {
            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
        });

    } catch (error) {
        console.error('Sync Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
        });
    }
});
