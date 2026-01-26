import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import nodemailer from 'npm:nodemailer@6.9.1'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GMAIL_USER = 'ps.olkkari@gmail.com'
const GMAIL_PASS = 'aeonetmcbwjvkjyp'

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { to, subject, body } = await req.json()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS,
            },
        })

        const info = await transporter.sendMail({
            from: `"Ravinteli Olkkari" <${GMAIL_USER}>`,
            to: to,
            subject: subject,
            html: body,
        })

        console.log('Message sent: %s', info.messageId)

        return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        console.error('SMTP Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
