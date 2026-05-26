import { ActionIcon, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';
import type { ChatMessageModel, SendMessageInput } from '@/shared/types/api';

interface Props {
  streamId: string;
  disabled?: boolean;
}

export function SendMessageForm({ streamId, disabled }: Props) {
  const qc = useQueryClient();
  const form = useForm<{ text: string }>({ initialValues: { text: '' } });

  const mut = useMutation({
    mutationFn: (data: SendMessageInput) =>
      gqlRequest<{ sendChatMessage: ChatMessageModel }, { data: SendMessageInput }>(
        ops.MUT_SEND_CHAT_MESSAGE,
        { data },
      ),
    onSuccess: async () => {
      form.reset();
      // Subscription path will append in real-time; refetch as a safety net.
      await qc.invalidateQueries({ queryKey: QK.chatMessages(streamId) });
    },
    onError: (err: Error) => notify.error(err.message),
  });

  return (
    <form
      onSubmit={form.onSubmit((v) => {
        const text = v.text.trim();
        if (!text) return;
        mut.mutate({ streamId, text });
      })}
    >
      <Group gap="xs">
        <TextInput
          flex={1}
          placeholder="Send a message"
          disabled={disabled}
          {...form.getInputProps('text')}
        />
        <ActionIcon
          type="submit"
          color="brand"
          variant="filled"
          size="lg"
          loading={mut.isPending}
          disabled={disabled}
          aria-label="Send"
        >
          <IconSend size={18} />
        </ActionIcon>
      </Group>
    </form>
  );
}
