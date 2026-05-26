import { Card, Group, Stack, Text, Badge } from '@mantine/core';
import { useCurrentSession, useSessions } from '@/entities/session';
import { RevokeSessionButton } from '@/features/session-remove';
import { formatRelative } from '@/shared/lib/format/date';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function SessionsBoard() {
  const list = useSessions();
  const current = useCurrentSession();
  if (list.isPending) return <PageLoader />;
  if (!list.data || list.data.length === 0) return <EmptyState title="No active sessions" />;
  return (
    <Stack>
      {list.data.map((s) => (
        <Card key={s.id} padding="md">
          <Group justify="space-between">
            <Stack gap={2}>
              <Group gap="xs">
                <Text fw={600}>
                  {s.metadata.device.browser} · {s.metadata.device.os}
                </Text>
                {current.data?.id === s.id ? (
                  <Badge color="green" size="sm">
                    current
                  </Badge>
                ) : null}
              </Group>
              <Text size="xs" c="dimmed">
                {s.metadata.location.city || '—'},{' '}
                {s.metadata.location.country || 'unknown'} · {s.metadata.ip} · started{' '}
                {formatRelative(s.createdAt)}
              </Text>
            </Stack>
            {current.data?.id === s.id ? null : <RevokeSessionButton sessionId={s.id} />}
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
