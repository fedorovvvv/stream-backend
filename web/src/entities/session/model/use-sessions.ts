import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { SessionModel } from '@/shared/types/api';

interface QList {
  findSessionsByUser: SessionModel[];
}

export function useSessions(enabled = true) {
  return useQuery({
    queryKey: QK.sessions,
    enabled,
    queryFn: async () => {
      const data = await gqlRequest<QList>(ops.QUERY_FIND_SESSIONS);
      return data.findSessionsByUser;
    },
  });
}

interface QCurrent {
  findCurrentSession: SessionModel;
}

export function useCurrentSession(enabled = true) {
  return useQuery({
    queryKey: QK.currentSession,
    enabled,
    queryFn: async () => {
      const data = await gqlRequest<QCurrent>(ops.QUERY_FIND_CURRENT_SESSION);
      return data.findCurrentSession;
    },
  });
}
