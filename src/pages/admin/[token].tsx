import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { MeetingDetailPage } from '../../components/pages/meeting-detail';
import { trpc } from '../../utils/trpc';

const Admin: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const {
    data: meeting,
    isLoading,
    refetch,
  } = trpc.meeting.getOneAsAdmin.useQuery(
    {
      token: token?.toString() || '',
    },
    {
      onError: () => {
        if (user) {
          router.push('/dashboard');
        } else {
          router.push('/auth/login');
        }
      },
    },
  );

  const { data: user, isLoading: isLoadingUser } = trpc.user.me.useQuery();

  return (
    <MeetingDetailPage
      adminView={true}
      meeting={meeting}
      isLoading={isLoading}
      isLoadingUser={isLoadingUser}
      user={user}
      refetchMeeting={refetch}
    />
  );
};

export default Admin;
