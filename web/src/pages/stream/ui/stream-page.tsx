import { Alert, AspectRatio, Badge, Card, Grid, Group, Stack, Title } from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import { useChannelByUsername, useFollowersCount, useProfileQuery } from '@/entities/user';
import { useIsFollowing } from '@/entities/follow';
import { FollowButton } from '@/features/follow-channel';
import { SponsorButton } from '@/features/sponsorship-make-payment';
import { useMyPlans } from '@/entities/plan';
import { ChatBox } from '@/widgets/chat-box';
import { StreamPlayer } from '@/widgets/stream-player';
import { UserAvatar } from '@/shared/ui/avatar/user-avatar';
import { ROUTES } from '@/shared/config/routes';
import { PageLoader } from '@/shared/ui/loader/page-loader';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';

export function StreamPage() {
  const { username } = useParams<{ username: string }>();
  const channel = useChannelByUsername(username);
  const profile = useProfileQuery();
  const followers = useFollowersCount(channel.data?.id);
  const isOwn = profile.data?.id === channel.data?.id;
  const myPlans = useMyPlans(!!profile.data && !isOwn);
  const following = useIsFollowing(channel.data?.id, !!profile.data && !isOwn);

  if (channel.isPending) return <PageLoader />;
  if (!channel.data) return <EmptyState title="Channel not found" />;

  const user = channel.data;
  const stream = user.stream;

  if (!stream) {
    return <Alert color="brand">This channel has no stream yet.</Alert>;
  }

  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Stack>
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <AspectRatio ratio={16 / 9} bg="dark.7">
              <StreamPlayer
                channelId={user.id}
                serverUrl={stream.serverUrl}
                isLive={stream.isLive}
              />
            </AspectRatio>
          </Card>

          <Card padding="md">
            <Group justify="space-between" wrap="wrap">
              <Group>
                <UserAvatar user={user} size={56} />
                <Stack gap={0}>
                  <Group gap="xs">
                    <Title order={4}>{stream.title}</Title>
                    <Badge color={stream.isLive ? 'red' : 'gray'} size="sm">
                      {stream.isLive ? 'LIVE' : 'offline'}
                    </Badge>
                  </Group>
                  <Link to={ROUTES.channel(user.username)}>
                    {user.displayName} · {followers.data ?? 0} followers
                  </Link>
                </Stack>
              </Group>
              <Group>
                {profile.data && !isOwn ? (
                  <FollowButton channelId={user.id} isFollowing={!!following.data} />
                ) : null}
                {profile.data && !isOwn && myPlans.data && myPlans.data.length > 0 ? (
                  <SponsorButton planId={myPlans.data[0].id} />
                ) : null}
              </Group>
            </Group>
          </Card>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <ChatBox streamId={stream.id} isChatEnabled={stream.isChatEnabled} />
      </Grid.Col>
    </Grid>
  );
}
