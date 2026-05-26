import { Card, Divider, Stack } from '@mantine/core';
import { NotificationRow, useNotifications } from '@/entities/notification';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function NotificationsPanel() {
  const list = useNotifications();
  if (list.isPending) return <PageLoader />;
  if (!list.data || list.data.length === 0) {
    return <EmptyState title="No notifications yet" />;
  }
  return (
    <Card padding="md">
      <Stack>
        {list.data.map((n, i) => (
          <Stack key={n.id} gap="xs">
            <NotificationRow notification={n} />
            {i < list.data.length - 1 ? <Divider /> : null}
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
