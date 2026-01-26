import { supabase } from '../supabase';

export const NotificationService = {
    /**
     * Request push notification permissions (OneSignal or browser native)
     */
    async requestPermission() {
        if (!('Notification' in window)) {
            console.log('This browser does not support push notifications.');
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    },

    /**
     * Send an email notification via Supabase Edge Functions (proxy to Resend)
     */
    async sendEmail(to: string, subject: string, html: string) {
        try {
            const { data, error } = await supabase.functions.invoke('resend-email', {
                body: { to, subject, html },
            });
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error sending email:', err);
            return null;
        }
    },

    /**
     * Send a push notification (placeholder for OneSignal/FCM integration)
     * 
     * RECOMMENDATION: Use OneSignal for the fastest setup.
     * 1. Create a OneSignal account.
     * 2. Add their Web SDK to your index.html.
     * 3. Initialize with OneSignal.init({ appId: "YOUR_APP_ID" }).
     */
    async sendPush(userId: string, title: string, body: string) {
        console.log(`Push notification sent to ${userId}: ${title} - ${body}`);
    },

    /**
     * EMAIL SETUP (Resend + Supabase):
     * 1. Get an API Key from https://resend.com
     * 2. Create a Supabase Edge Function: `supabase functions new resend-email`
     * 3. Use the Resend SDK in that function to send emails.
     * 4. Call `supabase.functions.invoke('resend-email')` from the client.
     */
};
