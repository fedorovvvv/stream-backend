import { Group, Stack, Text, Badge } from '@mantine/core';
import type { NotificationModel } from '@/shared/types/api';
import { formatRelative } from '@/shared/lib/format/date';

const TYPE_LABEL: Record<string, string> = {
  STREAM_START: 'Stream started',
  NEW_FOLLOWER: 'New follower',
  NEW_SPONSORSHIP: 'New sponsorship',
  ENABLE_TWO_FACTOR: '2FA enabled',
  VERIFIED_CHANNEL: 'Channel verified',
};

export function NotificationRow({ notification }: { notification: NotificationModel }) {
  return (
    <Stack gap={4}>
      <Group justify="space-between">
        <Badge variant="light" color={notification.isRead ? 'gray' : 'brand'} size="sm">
          {TYPE_LABEL[notification.type] ?? notification.type}
        </Badge>
        <Text size="xs" c="dimmed">
          {formatRelative(notification.createdAt)}
        </Text>
      </Group>
      <Text size="sm">{notification.message}</Text>
    </Stack>
  );
}
