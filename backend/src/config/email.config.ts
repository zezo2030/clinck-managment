import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@clinic.com',
    fromName: process.env.SENDGRID_FROM_NAME || 'Clinic Management',
  },
  templates: {
    appointmentConfirmation: 'appointment-confirmation',
    appointmentReminder: 'appointment-reminder',
    appointmentCancellation: 'appointment-cancellation',
    waitingListNotification: 'waiting-list-notification',
  },
}));
