import { Resend } from 'resend';
import { render } from '@react-email/render';
import QRCode from 'qrcode';
import React from 'react';
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

    const qrBuffer = await QRCode.toBuffer(registrationCode, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 150,
    });

    const emailHtml = await render(
      RegistrationEmail({
        memberName,
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        registrationCode,
        status,
      }) as React.ReactElement
    );

    const { data: emailData, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: `Registration Confirmed: ${eventName}`,
      html: emailHtml,
      attachments: [
        {
          filename: 'qrcode.png',
          content: qrBuffer.toString('base64'),
          contentType: 'image/png',
          contentId: 'qrcode',
        },
      ],
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