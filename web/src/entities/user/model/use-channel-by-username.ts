import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { UserModel } from '@/shared/types/api';

interface ChannelQuery {
  findChannelByUsername: UserModel;
}

export function useChannelByUsername(username: string | undefined) {
  return useQuery({
    queryKey: QK.channelByUsername(username ?? ''),
    queryFn: async () => {
      const data = await gqlRequest<ChannelQuery, { username: string }>(
        ops.QUERY_FIND_CHANNEL_BY_USERNAME,
        { username: username! },
      );
      return data.findChannelByUsername;
    },
    enabled: !!username,
  });
}
