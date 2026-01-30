import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
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
        const { receiptUrl, bookingId } = await req.json();

        if (!receiptUrl || !bookingId) {
            throw new Error("Missing receiptUrl or bookingId");
        }

        // 1. Fetch the image to send to Gemini
        const imageRes = await fetch(receiptUrl);
        if (!imageRes.ok) throw new Error("Failed to fetch image from URL");

        const imageBlob = await imageRes.blob();
        const imageBuffer = await imageBlob.arrayBuffer();
        const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));

        // 2. Prepare Gemini Prompt
        const prompt = `
        You are an expert financial auditor at Ravinteli Olkkari.
        Please extract the data from this restaurant receipt image and return it EXACTLY in the following JSON format:
        {
            "vendor": "Name of restaurant/store",
            "date": "YYYY-MM-DD",
            "items": [
                {"name": "Item name", "quantity": 1, "price": 0.00}
            ],
            "tax": 0.00,
            "total": 0.00,
            "currency": "EUR"
        }
        Return ONLY the JSON object. Do not include markdown code blocks.
        `;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: imageBlob.type || "image/jpeg",
                                data: base64Image
                            }
                        }
                    ]
                }]
            }),
        });

        const geminiData = await geminiResponse.json();
        if (!geminiResponse.ok) {
            console.error('Gemini API Error:', geminiData);
            throw new Error("Gemini extraction failed");
        }

        let extractedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        // Clean up markdown if Gemini included it
        extractedText = extractedText.replace(/```json/g, '').replace(/```/g, '').trim();

        const receiptData = JSON.parse(extractedText);

        // 3. Update Supabase
        const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
        const { error: updateError } = await supabase
            .from('bookings')
            .update({ receipt_data: receiptData })
            .eq('id', bookingId);

        if (updateError) throw updateError;

        return new Response(
            JSON.stringify({ success: true, data: receiptData }),
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
