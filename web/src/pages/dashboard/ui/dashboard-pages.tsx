import { Alert, Card, Grid, Stack, Title } from '@mantine/core';
import { StreamSettings } from '@/widgets/stream-settings';
import { SponsorshipBoard } from '@/widgets/sponsorship-board';
import { MySponsorsList } from '@/widgets/sponsors-list';
import { FollowersList } from '@/widgets/follow-list';
import { ChatBox } from '@/widgets/chat-box';
import { ChatSettingsForm } from '@/features/change-chat-settings';
import { useProfileQuery } from '@/entities/user';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function DashboardOverviewPage() {
  return (
    <Stack>
      <Title order={2}>Creator dashboard</Title>
      <StreamSettings />
    </Stack>
  );
}

export function DashboardSponsorshipPage() {
  return (
    <Stack>
      <Title order={2}>Sponsorship</Title>
      <SponsorshipBoard />
    </Stack>
  );
}

export function DashboardSubscribersPage() {
  return (
    <Stack>
      <Title order={2}>Sponsors</Title>
      <MySponsorsList />
      <Title order={3} mt="md">
        Followers
      </Title>
      <FollowersList />
    </Stack>
  );
}

export function DashboardChatPage() {
  const profile = useProfileQuery();
  if (profile.isPending) return <PageLoader />;
  const stream = profile.data?.stream;
  if (!stream) {
    return (
      <Stack>
        <Title order={2}>Chat moderation</Title>
        <Alert color="brand">Create a stream first to manage its chat.</Alert>
      </Stack>
    );
  }
  return (
    <Stack>
      <Title order={2}>Chat moderation</Title>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card padding="md">
            <Title order={4} mb="sm">
              Chat settings
            </Title>
            <ChatSettingsForm stream={stream} />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <ChatBox streamId={stream.id} isChatEnabled={stream.isChatEnabled} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
