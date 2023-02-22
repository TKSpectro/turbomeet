import { createTransport } from 'nodemailer';
import { invite, inviteNoAccount } from './templates';

const TEMPLATES = {
  INVITE: invite,
  INVITE_NO_ACCOUNT: inviteNoAccount,
} as const;

const sendMail = async (
  template: keyof typeof TEMPLATES,
  to: string,
  data: Parameters<(typeof TEMPLATES)[typeof template]>[0],
) => {
  const transporter = createTransport({
    url: process.env.EMAIL_SERVER,
  });

  const { html, subject, text } = TEMPLATES[template](data as any);

  let info;
  try {
    info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      html: html,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.error('[MAIL]', error);
  }

  return info;
};

export { sendMail };
