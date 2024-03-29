import { createTransport } from 'nodemailer';
import { invite, inviteNoAccount, votedPublicMeetingNoAccount } from './templates';

const TEMPLATES = {
  INVITE: invite,
  INVITE_NO_ACCOUNT: inviteNoAccount,
  VOTED_PUBLIC_MEETING_NO_ACCOUNT: votedPublicMeetingNoAccount,
} as const;

const sendMail = async (
  template: keyof typeof TEMPLATES,
  to: string,
  data: Parameters<(typeof TEMPLATES)[typeof template]>[0],
) => {
  const transporter = createTransport({
    url: process.env.EMAIL_SERVER,
  });

  const { html, subject, text } = TEMPLATES[template](data as never);

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
