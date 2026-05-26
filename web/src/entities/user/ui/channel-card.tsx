import { Card, Group, Stack, Text, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { UserModel } from '@/shared/types/api';
import { UserAvatar } from '@/shared/ui/avatar/user-avatar';
import { ROUTES } from '@/shared/config/routes';

export function ChannelCard({ user }: { user: UserModel }) {
  return (
    <Card component={Link} to={ROUTES.channel(user.username)} padding="md">
      <Group wrap="nowrap">
        <UserAvatar user={user} size={56} />
        <Stack gap={2} miw={0}>
          <Group gap="xs">
            <Text fw={600} truncate>
              {user.displayName}
            </Text>
            {user.isVerified ? (
              <Badge size="xs" color="brand" variant="light">
                verified
              </Badge>
            ) : null}
          </Group>
          <Text size="xs" c="dimmed">
            @{user.username}
          </Text>
          {user.bio ? (
            <Text size="xs" c="dimmed" lineClamp={2}>
              {user.bio}
            </Text>
          ) : null}
        </Stack>
      </Group>
    </Card>
  );
}
