import {
  Anchor,
  Badge,
  Card,
  Group,
  Stack,
  Title,
  Text,
  Button,
  Image,
  SimpleGrid,
} from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import { useChannelByUsername, useFollowersCount, useProfileQuery } from '@/entities/user';
import { useIsFollowing } from '@/entities/follow';
import { useSponsorsByChannel } from '@/entities/subscription';
import { FollowButton } from '@/features/follow-channel';
import { UserAvatar } from '@/shared/ui/avatar/user-avatar';
import { ROUTES } from '@/shared/config/routes';
import { PageLoader } from '@/shared/ui/loader/page-loader';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import { formatDate } from '@/shared/lib/format/date';

export function ChannelPage() {
  const { username } = useParams<{ username: string }>();
  const channel = useChannelByUsername(username);
  const profile = useProfileQuery();
  const followersCount = useFollowersCount(channel.data?.id);
  const sponsors = useSponsorsByChannel(channel.data?.id);
  const isOwn = profile.data?.id === channel.data?.id;
  const following = useIsFollowing(channel.data?.id, !!profile.data && !isOwn);

  if (channel.isPending) return <PageLoader />;
  if (!channel.data) return <EmptyState title="Channel not found" />;

  const user = channel.data;
  const isFollowing = !!following.data;

  return (
    <Stack gap="lg">
      <Card padding="lg">
        <Group justify="space-between" wrap="wrap">
          <Group wrap="nowrap">
            <UserAvatar user={user} size={96} />
            <Stack gap={2}>
              <Group gap="xs">
                <Title order={2}>{user.displayName}</Title>
                {user.isVerified ? <Badge color="brand">verified</Badge> : null}
              </Group>
              <Text c="dimmed">@{user.username}</Text>
              {user.bio ? <Text mt="xs" maw={480}>{user.bio}</Text> : null}
              <Text size="sm" c="dimmed">
                {followersCount.data ?? 0} followers
              </Text>
            </Stack>
          </Group>
          <Group>
            {profile.data && !isOwn ? (
              <FollowButton channelId={user.id} isFollowing={isFollowing} />
            ) : null}
            {user.stream?.isLive ? (
              <Button component={Link} to={ROUTES.stream(user.username)} color="red">
                Watch live
              </Button>
            ) : null}
          </Group>
        </Group>
      </Card>

      {user.stream ? (
        <Card padding="md">
          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={4}>{user.stream.title}</Title>
              {user.stream.category ? (
                <Anchor
                  component={Link}
                  to={ROUTES.category(user.stream.category.slug)}
                  size="sm"
                  c="dimmed"
                >
                  in {user.stream.category.title}
                </Anchor>
              ) : null}
            </Stack>
            <Badge color={user.stream.isLive ? 'red' : 'gray'}>
              {user.stream.isLive ? 'LIVE' : 'offline'}
            </Badge>
          </Group>
          {user.stream.thumbnailUrl ? (
            <Image
              src={user.stream.thumbnailUrl}
              mt="md"
              h={320}
              radius="md"
              style={{ objectFit: 'cover' }}
            />
          ) : null}
        </Card>
      ) : null}

      {user.socialLinks && user.socialLinks.length > 0 ? (
        <Card padding="md">
          <Title order={5} mb="xs">
            Social
          </Title>
          <Group>
            {user.socialLinks
              .slice()
              .sort((a, b) => a.position - b.position)
              .map((s) => (
                <Anchor key={s.id} href={s.url} target="_blank" rel="noreferrer">
                  {s.title}
                </Anchor>
              ))}
          </Group>
        </Card>
      ) : null}

      {sponsors.data && sponsors.data.length > 0 ? (
        <Card padding="md">
          <Title order={5} mb="sm">
            Sponsors
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="sm">
            {sponsors.data.map((s) => (
              <Card key={s.id} padding="sm">
                <Group>
                  <UserAvatar user={s.user} size={32} />
                  <Stack gap={0}>
                    <Text fw={600}>{s.user.displayName}</Text>
                    <Text size="xs" c="dimmed">
                      {s.plan.title} · until {formatDate(s.expiresAt, 'DD MMM YYYY')}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        </Card>
      ) : null}
    </Stack>
  );
}
