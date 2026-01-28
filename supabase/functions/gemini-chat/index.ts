import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const MODEL_NAME = "gemini-2.0-flash";

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
            }
        });
    }

    try {
        const { message, chatHistory, userName, userId } = await req.json();

        // 1. Initialize Supabase Client (Service Role for logging)
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

        // 2. Fetch Live Context
        const [menuRes, eventsRes, artRes, staffRes, knowledgeRes] = await Promise.all([
            supabase.from('menu_items').select('name, category, subcategory, price, description'),
            supabase.from('events').select('title, date, time, description').eq('is_tonight', false),
            supabase.from('art_pieces').select('title, medium, price'),
            supabase.from('staff').select('name, role, description'),
            supabase.from('knowledge_base').select('category, content')
        ]);

        const menuContext = menuRes.data?.map(i => `- ${i.name} (${i.category}${i.subcategory ? '/' + i.subcategory : ''}): ${i.price}. ${i.description}`).join('\n') || 'None';
        const eventsContext = eventsRes.data?.map(e => `- ${e.title} on ${e.date} at ${e.time}: ${e.description}`).join('\n') || 'No upcoming scheduled events';
        const artContext = artRes.data?.map(a => `- "${a.title}" (${a.medium}): ${a.price}`).join('\n') || 'Current exhibition by Elena Rossi';
        const staffContext = staffRes.data?.map(s => `- ${s.name}, ${s.role}: ${s.description}`).join('\n') || 'Our team of professional chefs available for hire';
        const knowledgeContext = knowledgeRes.data?.map(k => `### ${k.category}\n${k.content}`).join('\n\n') || '';

        const systemInstruction = `
You are the Olkkari Concierge, the premium digital host for Ravinteli Olkkari in Helsinki.
Tone: SOPHISTICATED, WARM, PRO-ACTIVE.

CORE INSTRUCTION:
When a user asks about something that has a dedicated page in our app, ALWAYS provide a helpful answer and then pro-actively offer to open that page using a Markdown link.

SMART LINKS:
- Chef for Hire -> [Open Chef Hire Page](/chef)
    - Table Booking / Reservations -> [Book a Table](/booking)
    - Menu / Food -> [Browse Full Menu](/menu)
    - Events / Parties -> [View Events](/events)
    - Music / Atmosphere -> Suggest [Browse Gallery](/gallery)

Currently speaking with: ${userName || 'a Guest'}.

RESTAURANT KNOWLEDGE:
${knowledgeContext}

### MENU:
${menuContext}

### EVENTS:
${eventsContext}

### ART & EXHIBITION:
${artContext}

### TEAM & CHEF HIRE:
${staffContext}
`;

        // 3. Call Gemini
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    ...(chatHistory || []),
                    { role: 'user', parts: [{ text: message }] }
                ],
                systemInstruction: {
                    parts: [{ text: systemInstruction }]
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            throw new Error(`Gemini API error`);
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I'm having a slight moment of contemplation. Could you please repeat that?";

        // 4. LOG ENGAGEMENT (Fire and forget, don't block response)
        try {
            await supabase.from('chat_logs').insert([{
                user_id: userId || null,
                user_name: userName || 'Anonymous Guest',
                message: message,
                response: reply,
                metadata: {
                    model: MODEL_NAME,
                    history_length: chatHistory?.length || 0
                }
            }]);
        } catch (logError) {
            console.error('Logging Error:', logError);
        }

        return new Response(
            JSON.stringify({ reply }),
            {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            },
        );
    } catch (error) {
        console.error('Edge Function Error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            },
        );
    }
});

