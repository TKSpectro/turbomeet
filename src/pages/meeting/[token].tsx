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
  } = trpc.meeting.getOne.useQuery({
    token: token?.toString() || '',
  });

  const { data: user, isLoading: isLoadingUser } = trpc.user.me.useQuery();

  return (
    <MeetingDetailPage
      adminView={false}
      meeting={meeting}
      user={user}
      isLoading={isLoading || isLoadingUser}
      refetchMeeting={refetch}
    />
  );
};

export default MeetingDetail;
