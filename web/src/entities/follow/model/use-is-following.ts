import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';

interface Q {
  isFollowing: boolean;
}

export function useIsFollowing(channelId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: QK.isFollowing(channelId ?? ''),
    enabled: !!channelId && enabled,
    queryFn: async () => {
      const data = await gqlRequest<Q, { channelId: string }>(ops.QUERY_IS_FOLLOWING, {
        channelId: channelId!,
      });
      return data.isFollowing;
    },
  });
}
