import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { MeetingDetailPage } from '../../components/pages/meeting-detail';
import { trpc } from '../../utils/trpc';

const Admin: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const { data: meeting, isLoading } = trpc.meeting.getOneAsAdmin.useQuery({
    token: token?.toString() || '',
  });

  return <MeetingDetailPage adminView={true} meeting={meeting} isLoading={isLoading} />;
};

export default Admin;
