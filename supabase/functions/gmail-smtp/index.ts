import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts'

// These are baked in because we couldn't set secrets due to permission issues
const GMAIL_USER = 'ps.olkkari@gmail.com'
const GMAIL_PASS = 'aeonetmcbwjvkjyp'

serve(async (req) => {
    try {
        const { to, subject, body } = await req.json()

        const client = new SmtpClient()
        await client.connect({
            hostname: 'smtp.gmail.com',
            port: 587,
            username: GMAIL_USER,
            password: GMAIL_PASS,
        })

        await client.send({
            from: GMAIL_USER,
            to: to,
            subject: subject,
            content: body,
            html: body,
        })

        await client.close()

        return new Response(JSON.stringify({ success: true }), {
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
