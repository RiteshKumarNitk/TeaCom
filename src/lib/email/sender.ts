import { Resend } from 'resend';

// Initialize Resend with env variable
// If missing, we'll log warnings instead of crashing (dev mode)
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM_EMAIL = 'TeaCom <orders@teacom.com>'; // Update with verified domain

export async function sendEmail({
    to,
    subject,
    react
}: {
    to: string;
    subject: string;
    react: React.ReactNode;
}) {
    if (!resend) {
        console.warn("Resend API Key missing. Skipping email send.");
        console.log("To:", to, "Subject:", subject);
        return { success: false, error: "Missing API Key" }; // Mock success for dev?
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject,
            react,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Email Send Exception:", error);
        return { success: false, error };
    }
}
