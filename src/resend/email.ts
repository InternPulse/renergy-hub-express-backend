import { Resend } from 'resend';
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from './emailTemplates';

// Function to send verification email
const resend = new Resend(process.env.RESEND_API_KEY);
export const verificationEmail = async (
  to: string,
  verificationCode: string
) => {
  try {
    const html = VERIFICATION_EMAIL_TEMPLATE.replace(
      '{verificationCode}',
      verificationCode
    );

    const { data, error } = await resend.emails.send({
      from: 'RenergyHub <admin@megagigsolution.com>', // Use verified domain or default Resend domain
      to: [to],
      subject: 'Verify Your Email',
      html: html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};

// Function to send a welcome email
export const welcomeEmail = async (to: string, firstName: string) => {
  try {
    const html = WELCOME_EMAIL_TEMPLATE;

    const { data, error } = await resend.emails.send({
      from: 'RenergyHub <admin@megagigsolution.com>', // Use verified domain or default Resend domain
      to: [to],
      subject: 'Welcome to RenergyHub',
      html: html,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error: any) {
    console.error('Error sending welcome email:', error);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }
};
