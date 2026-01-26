import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID')
const ONESIGNAL_API_KEY = Deno.env.get('ONESIGNAL_API_KEY')

serve(async (req) => {
    try {
        const { email, subject, body, name } = await req.json()

        const response = await fetch('https://api.onesignal.com/notifications?c=email', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${ONESIGNAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                email_subject: subject,
                email_body: body,
                email_from_name: "Ravinteli Olkkari",
                // Targeting specific email
                email_to: [email],
                // Optional: include internal name for tracking
                name: name || "Member Email",
            }),
        })

        const result = await response.json()

        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
