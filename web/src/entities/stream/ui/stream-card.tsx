import { Card, Group, Image, Stack, Text, Badge } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { StreamModel } from '@/shared/types/api';
import { UserAvatar } from '@/shared/ui/avatar/user-avatar';
import { ROUTES } from '@/shared/config/routes';

interface Props {
  stream: StreamModel;
}

export function StreamCard({ stream }: Props) {
  return (
    <Card
      component={Link}
      to={ROUTES.stream(stream.user.username)}
      padding={0}
      style={{ overflow: 'hidden' }}
    >
      <Image
        src={stream.thumbnailUrl ?? undefined}
        h={180}
        fallbackSrc="https://placehold.co/600x340/0b0b10/8b5cf6?text=Teastream"
        alt={stream.title}
        style={{ objectFit: 'cover' }}
      />
      <Stack gap="xs" p="md">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" miw={0}>
            <UserAvatar user={stream.user} size={36} />
            <Stack gap={0} miw={0}>
              <Text fw={600} lineClamp={1}>
                {stream.title}
              </Text>
              <Text size="xs" c="dimmed">
                {stream.user.displayName}
              </Text>
            </Stack>
          </Group>
          {stream.isLive ? (
            <Badge color="red" size="sm">
              LIVE
            </Badge>
          ) : (
            <Badge variant="light" size="sm">
              offline
            </Badge>
          )}
        </Group>
        {stream.category ? (
          <Text size="xs" c="dimmed">
            in {stream.category.title}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
