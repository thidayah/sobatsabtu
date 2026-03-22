import { Resend } from 'resend';
import { render } from '@react-email/render';
import { RegistrationEmail } from '@/components/emails/RegistrationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

interface RegistrationEmailData {
  memberName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  registrationCode: string;
  status: string;
}

export async function sendRegistrationEmail(
  to: string,
  data: RegistrationEmailData
) {
  const { memberName, eventName, eventDate, eventTime, eventLocation, registrationCode, status } = data;

  try {
    // Render the email component to HTML
    const emailHtml = render(
      await RegistrationEmail({
        memberName,
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        registrationCode,
        status,
      })
    );

    const { data: emailData, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: `Registration Confirmed: ${eventName}`,
      html: await emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return { success: false, error };
  }
}