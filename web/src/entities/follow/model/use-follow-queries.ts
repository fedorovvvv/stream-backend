import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { FollowModel } from '@/shared/types/api';

interface QF {
  findMyFollowers: FollowModel[];
}

export function useMyFollowers(enabled = true) {
  return useQuery({
    queryKey: QK.myFollowers,
    enabled,
    queryFn: async () => {
      const data = await gqlRequest<QF>(ops.QUERY_FIND_MY_FOLLOWERS);
      return data.findMyFollowers;
    },
  });
}

interface QFg {
  findMyFollowings: FollowModel[];
}

export function useMyFollowings(enabled = true) {
  return useQuery({
    queryKey: QK.myFollowings,
    enabled,
    queryFn: async () => {
      const data = await gqlRequest<QFg>(ops.QUERY_FIND_MY_FOLLOWINGS);
      return data.findMyFollowings;
    },
  });
}
