import { Stack, Title } from '@mantine/core';
import { NotificationsPanel } from '@/widgets/notifications-panel';

export function NotificationsPage() {
  return (
    <Stack>
      <Title order={2}>Notifications</Title>
      <NotificationsPanel />
    </Stack>
  );
}
