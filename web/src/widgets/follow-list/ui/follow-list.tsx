import { Card, Group, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useMyFollowers, useMyFollowings } from '@/entities/follow';
import { UserAvatar } from '@/shared/ui/avatar/user-avatar';
import { ROUTES } from '@/shared/config/routes';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function FollowersList() {
  const list = useMyFollowers();
  if (list.isPending) return <PageLoader />;
  if (!list.data || list.data.length === 0) return <EmptyState title="No followers yet" />;
  return (
    <Stack>
      {list.data.map((f) => (
        <Card key={f.id} padding="sm" component={Link} to={ROUTES.channel(f.follower.username)}>
          <Group>
            <UserAvatar user={f.follower} size={36} />
            <Stack gap={0}>
              <Text fw={600}>{f.follower.displayName}</Text>
              <Text size="xs" c="dimmed">
                @{f.follower.username}
              </Text>
            </Stack>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}

export function FollowingsList() {
  const list = useMyFollowings();
  if (list.isPending) return <PageLoader />;
  if (!list.data || list.data.length === 0) return <EmptyState title="Not following anyone" />;
  return (
    <Stack>
      {list.data.map((f) => (
        <Card
          key={f.id}
          padding="sm"
          component={Link}
          to={ROUTES.channel(f.following.username)}
        >
          <Group>
            <UserAvatar user={f.following} size={36} />
            <Stack gap={0}>
              <Text fw={600}>{f.following.displayName}</Text>
              <Text size="xs" c={f.following.stream?.isLive ? 'red' : 'dimmed'}>
                {f.following.stream?.isLive ? 'LIVE' : `@${f.following.username}`}
              </Text>
            </Stack>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
