import { Alert, Card, ScrollArea, Stack, Text } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useChatMessages, ChatMessageRow } from '@/entities/chat-message';
import { useProfileQuery } from '@/entities/user';
import { SendMessageForm } from '@/features/send-chat-message';
import { subscribe, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { ChatMessageModel } from '@/shared/types/api';

interface Props {
  streamId: string;
  isChatEnabled?: boolean;
}

interface SubData {
  chatMessageAdded: ChatMessageModel;
}

export function ChatBox({ streamId, isChatEnabled = true }: Props) {
  const qc = useQueryClient();
  const messages = useChatMessages(streamId);
  const profile = useProfileQuery();
  const viewportRef = useRef<HTMLDivElement>(null);

  // Live updates via GraphQL subscription.
  useEffect(() => {
    if (!streamId) return;
    const dispose = subscribe<SubData, { streamId: string }>(
      ops.SUB_CHAT_MESSAGE_ADDED,
      { streamId },
      (data) => {
        const incoming = data.chatMessageAdded;
        qc.setQueryData<ChatMessageModel[]>(QK.chatMessages(streamId), (prev) =>
          prev ? [...prev, incoming] : [incoming],
        );
      },
      (err) => console.warn('[chat subscription]', err),
    );
    return dispose;
  }, [streamId, qc]);

  // Auto-scroll on new messages.
  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.data?.length]);

  return (
    <Card padding="sm" h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Text fw={600} mb="xs">
        Stream chat
      </Text>
      <ScrollArea h={420} viewportRef={viewportRef} type="auto" mb="sm">
        <Stack gap="xs">
          {messages.data?.length === 0 ? (
            <Text size="sm" c="dimmed">
              No messages yet. Be the first to say hi.
            </Text>
          ) : null}
          {messages.data?.map((m) => <ChatMessageRow key={m.id} message={m} />)}
        </Stack>
      </ScrollArea>
      {!isChatEnabled ? (
        <Alert color="gray">Chat is disabled for this stream.</Alert>
      ) : !profile.data ? (
        <Alert color="brand" variant="light">
          Sign in to chat.
        </Alert>
      ) : (
        <SendMessageForm streamId={streamId} disabled={!isChatEnabled} />
      )}
    </Card>
  );
}
