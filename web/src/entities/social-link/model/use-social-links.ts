import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { SocialLinkModel } from '@/shared/types/api';

interface Q {
  findSocialLinks: SocialLinkModel[];
}

export function useSocialLinks(enabled = true) {
  return useQuery({
    queryKey: QK.socialLinks,
    enabled,
    queryFn: async () => {
      const data = await gqlRequest<Q>(ops.QUERY_FIND_SOCIAL_LINKS);
      return data.findSocialLinks;
    },
  });
}
