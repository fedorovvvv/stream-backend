import { Button, Stack, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';
import type { ChangeChatSettingsInput, StreamModel } from '@/shared/types/api';

export function ChatSettingsForm({ stream }: { stream: StreamModel }) {
  const qc = useQueryClient();
  const form = useForm<ChangeChatSettingsInput>({
    initialValues: {
      isChatEnabled: stream.isChatEnabled,
      isChatFollowersOnly: stream.isChatFollowersOnly,
      isChatPremiumFollowersOnly: stream.isChatPremiumFollowersOnly,
    },
  });
  const mut = useMutation({
    mutationFn: (data: ChangeChatSettingsInput) =>
      gqlRequest<{ changeChatSettings: boolean }, { data: ChangeChatSettingsInput }>(
        ops.MUT_CHANGE_CHAT_SETTINGS,
        { data },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.profile });
      notify.success('Chat settings saved');
    },
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <form onSubmit={form.onSubmit((v) => mut.mutate(v))}>
      <Stack>
        <Switch label="Chat enabled" {...form.getInputProps('isChatEnabled', { type: 'checkbox' })} />
        <Switch
          label="Followers-only chat"
          {...form.getInputProps('isChatFollowersOnly', { type: 'checkbox' })}
        />
        <Switch
          label="Sponsors-only chat"
          {...form.getInputProps('isChatPremiumFollowersOnly', { type: 'checkbox' })}
        />
        <Button type="submit" loading={mut.isPending}>
          Save chat settings
        </Button>
      </Stack>
    </form>
  );
}
