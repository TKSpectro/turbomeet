import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { MeetingDetailPage } from '../../components/pages/meeting-detail';
import { trpc } from '../../utils/trpc';

const MeetingDetail: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const {
    data: meeting,
    isLoading,
    refetch,
  } = trpc.meeting.getOne.useQuery(
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

  const { data: user, isLoading: isLoadingUser } = trpc.user.me.useQuery(undefined, {
    retry: false,
  });

  return (
    <MeetingDetailPage
      adminView={false}
      meeting={meeting}
      user={user}
      isLoading={isLoading}
      isLoadingUser={isLoadingUser}
      refetchMeeting={refetch}
    />
  );
};

export default MeetingDetail;
