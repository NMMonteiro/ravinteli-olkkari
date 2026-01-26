import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const MODEL_NAME = "gemini-1.5-flash";

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
    }

    try {
        const { message } = await req.json();

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }],
                    systemInstruction: {
                        parts: [{
                            text: "You are the AI Concierge for 'Ravinteli Olkkari', a premium dining 'living room' in Helsinki. Your tone is warm, professional, and very welcoming, making guests feel like they are at home but in a high-end restaurant. You know about our menu items (Wagyu sliders, sea bass carpaccio, etc.), our current art exhibition by Elena Rossi, and that we offer private chef hire for home events. Keep responses concise and helpful. If guests ask about bookings, encourage them to use the 'Book Table' feature."
                        }]
                    }
                }),
            }
        );

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

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
