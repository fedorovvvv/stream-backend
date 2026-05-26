import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';

interface Q {
  findFollowersCountByChannel: number;
}

export function useFollowersCount(channelId: string | undefined) {
  return useQuery({
    queryKey: QK.followersCountByChannel(channelId ?? ''),
    enabled: !!channelId,
    queryFn: async () => {
      const data = await gqlRequest<Q, { channelId: string }>(
        ops.QUERY_FIND_FOLLOWERS_COUNT_BY_CHANNEL,
        { channelId: channelId! },
      );
      return data.findFollowersCountByChannel;
    },
  });
}
