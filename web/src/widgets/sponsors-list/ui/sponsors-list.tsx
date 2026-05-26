import { Card, Group, Stack, Text } from '@mantine/core';
import { useMySponsors } from '@/entities/subscription';
import { UserAvatar } from '@/shared/ui/avatar/user-avatar';
import { formatDate } from '@/shared/lib/format/date';
import { formatMoney } from '@/shared/lib/format/money';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function MySponsorsList() {
  const list = useMySponsors();
  if (list.isPending) return <PageLoader />;
  if (!list.data || list.data.length === 0) return <EmptyState title="No sponsors yet" />;
  return (
    <Stack>
      {list.data.map((s) => (
        <Card key={s.id} padding="sm">
          <Group justify="space-between">
            <Group>
              <UserAvatar user={s.user} size={36} />
              <Stack gap={0}>
                <Text fw={600}>{s.user.displayName}</Text>
                <Text size="xs" c="dimmed">
                  {s.plan.title} · {formatMoney(s.plan.price)}
                </Text>
              </Stack>
            </Group>
            <Text size="xs" c="dimmed">
              Expires {formatDate(s.expiresAt)}
            </Text>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
