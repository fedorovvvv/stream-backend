import { Alert, Anchor, Button, Stack, Switch } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';
import type {
  ChangeNotificationsSettingsInput,
  ChangeNotificationsSettingsResponse,
  NotificationSettingsModel,
} from '@/shared/types/api';

export function NotificationSettingsForm({
  settings,
}: {
  settings: NotificationSettingsModel | null | undefined;
}) {
  const qc = useQueryClient();
  const [telegramToken, setTelegramToken] = useState<string | null>(null);
  const form = useForm<ChangeNotificationsSettingsInput>({
    initialValues: {
      siteNotifications: settings?.siteNotifications ?? true,
      telegramNotifications: settings?.telegramNotifications ?? false,
    },
  });
  const mut = useMutation({
    mutationFn: (data: ChangeNotificationsSettingsInput) =>
      gqlRequest<
        { changeNotificationsSettings: ChangeNotificationsSettingsResponse },
        { data: ChangeNotificationsSettingsInput }
      >(ops.MUT_CHANGE_NOTIFICATIONS_SETTINGS, { data }),
    onSuccess: async (res) => {
      await qc.invalidateQueries({ queryKey: QK.profile });
      setTelegramToken(res.changeNotificationsSettings.telegramAuthToken ?? null);
      notify.success('Notification settings saved');
    },
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <form onSubmit={form.onSubmit((v) => mut.mutate(v))}>
      <Stack>
        <Switch
          label="Site notifications"
          {...form.getInputProps('siteNotifications', { type: 'checkbox' })}
        />
        <Switch
          label="Telegram notifications"
          {...form.getInputProps('telegramNotifications', { type: 'checkbox' })}
        />
        <Button type="submit" loading={mut.isPending}>
          Save preferences
        </Button>
        {telegramToken ? (
          <Alert color="brand">
            Open the bot and send <code>/start {telegramToken}</code>, or follow{' '}
            <Anchor href={`https://t.me/share/url?url=${telegramToken}`} target="_blank">
              this link
            </Anchor>
            .
          </Alert>
        ) : null}
      </Stack>
    </form>
  );
}
