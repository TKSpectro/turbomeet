type MailTemplate = {
  html: string;
  subject: string;
  text: string;
};

export const invite = ({
  meetingTitle,
  inviteeName,
  meetingToken,
}: {
  meetingTitle: string;
  inviteeName: string;
  meetingToken: string;
}): MailTemplate => {
  return {
    html: ``,
    subject: 'You have been invited to a meeting',
    text: `You have been invited to the meeting ${meetingTitle} by ${inviteeName}. You can join the meeting by clicking on the following link: ${process.env.NEXTAUTH_URL}/meeting/${meetingToken}.`,
  };
};

export const inviteNoAccount = ({
  meetingTitle,
  inviteeName,
}: {
  meetingTitle: string;
  inviteeName: string;
}): MailTemplate => {
  return {
    html: ``,
    subject: 'You have been invited to a meeting',
    text: `You have been invited to the meeting ${meetingTitle} by ${inviteeName}. As you currently have no account on this platform, you can create one by clicking on the following link: ${process.env.NEXTAUTH_URL}/auth/login. (Please use the same email address as you have been invited with.)`,
  };
};

export const votedPublicMeetingNoAccount = ({
  meetingTitle,
}: {
  meetingTitle: string;
}): MailTemplate => {
  return {
    html: ``,
    subject: 'Please confirm your email',
    text: `You have voted on a public meeting ${meetingTitle}. As you currently have no account on this platform, you need to confirm it by signing in on the following link: ${process.env.NEXTAUTH_URL}/auth/login. (Please use the same email address as you have been invited with.)`,
  };
};
