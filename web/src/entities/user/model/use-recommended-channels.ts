import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { UserModel } from '@/shared/types/api';

interface Q {
  findRecommendedChannels: UserModel[];
}

export function useRecommendedChannels() {
  return useQuery({
    queryKey: QK.recommendedChannels,
    queryFn: async () => {
      const data = await gqlRequest<Q>(ops.QUERY_FIND_RECOMMENDED_CHANNELS);
      return data.findRecommendedChannels;
    },
  });
}
