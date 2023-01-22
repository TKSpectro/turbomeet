import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { MeetingPage } from '../../components/pages/meeting';
import { trpc } from '../../utils/trpc';

const Admin: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const { data: meeting, isLoading } = trpc.meeting.getOneAsAdmin.useQuery({
    token: token?.toString() || '',
  });

  return <MeetingPage adminView={true} meeting={meeting} isLoading={isLoading} />;
};

export default Admin;
