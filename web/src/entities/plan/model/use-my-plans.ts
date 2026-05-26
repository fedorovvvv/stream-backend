import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { PlanModel } from '@/shared/types/api';

interface Q {
  findMySponsorshipPlans: PlanModel[];
}

export function useMyPlans(enabled = true) {
  return useQuery({
    queryKey: QK.myPlans,
    enabled,
    queryFn: async () => {
      const data = await gqlRequest<Q>(ops.QUERY_FIND_MY_PLANS);
      return data.findMySponsorshipPlans;
    },
  });
}
