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
     * Send a branded email via OneSignal (using our Supabase Edge Function bridge)
     */
    async sendEmail(to: string, subject: string, html: string) {
        try {
            const { data, error } = await supabase.functions.invoke('onesignal-email', {
                body: {
                    email: to,
                    subject: subject,
                    body: html,
                    name: "Membership Alert"
                },
            });
            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error sending OneSignal email:', err);
            return null;
        }
    },

    /**
     * Send a push notification (OneSignal)
     */
    async sendPush(userId: string, title: string, body: string) {
        // This can use the same pattern as email once you configure OneSignal Push
        console.log(`Push notification logic ready for OneSignal ID: ${userId} - ${title}: ${body}`);
    }
};
