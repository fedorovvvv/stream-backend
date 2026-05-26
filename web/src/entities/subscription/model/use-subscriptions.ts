import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { SubscriptionModel } from '@/shared/types/api';

interface QMine {
  findMySponsors: SubscriptionModel[];
}

export function useMySponsors(enabled = true) {
  return useQuery({
    queryKey: QK.mySponsors,
    enabled,
    queryFn: async () => {
      const data = await gqlRequest<QMine>(ops.QUERY_FIND_MY_SPONSORS);
      return data.findMySponsors;
    },
  });
}

interface QByChannel {
  findSponsorsByChannel: SubscriptionModel[];
}

export function useSponsorsByChannel(channelId: string | undefined) {
  return useQuery({
    queryKey: QK.sponsorsByChannel(channelId ?? ''),
    enabled: !!channelId,
    queryFn: async () => {
      const data = await gqlRequest<QByChannel, { channelId: string }>(
        ops.QUERY_FIND_SPONSORS_BY_CHANNEL,
        { channelId: channelId! },
      );
      return data.findSponsorsByChannel;
    },
  });
}
