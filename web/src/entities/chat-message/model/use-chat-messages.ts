import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { ChatMessageModel } from '@/shared/types/api';

interface Q {
  findChatMessageByStream: ChatMessageModel[];
}

export function useChatMessages(streamId: string | undefined) {
  return useQuery({
    queryKey: QK.chatMessages(streamId ?? ''),
    enabled: !!streamId,
    staleTime: 10_000,
    queryFn: async () => {
      const data = await gqlRequest<Q, { streamId: string }>(ops.QUERY_FIND_CHAT_MESSAGES, {
        streamId: streamId!,
      });
      return data.findChatMessageByStream;
    },
  });
}
