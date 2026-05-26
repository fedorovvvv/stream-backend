import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { UserModel } from '@/shared/types/api';

interface ProfileQuery {
  findProfile: UserModel;
}

export function useProfileQuery(enabled = true) {
  return useQuery({
    queryKey: QK.profile,
    queryFn: async () => {
      const data = await gqlRequest<ProfileQuery>(ops.QUERY_PROFILE);
      return data.findProfile;
    },
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
