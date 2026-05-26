import { Alert, Card, Code, Group, Stack, Title } from '@mantine/core';
import { useProfileQuery } from '@/entities/user';
import { CreateIngressButtons } from '@/features/stream-create-ingress';
import { ChatSettingsForm } from '@/features/change-chat-settings';
import { StreamInfoForm } from '@/features/stream-edit-info';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function StreamSettings() {
  const profile = useProfileQuery();
  if (profile.isPending) return <PageLoader />;
  const stream = profile.data?.stream ?? null;

  if (!stream) {
    return <Alert color="brand">Sign in as a creator to manage your stream.</Alert>;
  }

  return (
    <Stack>
      <Card padding="md">
        <Title order={4} mb="sm">
          Ingress credentials
        </Title>
        {stream.ingressId ? (
          <Stack gap={4}>
            <Group gap="xs">
              <strong>Server:</strong>
              <Code>{stream.serverUrl}</Code>
            </Group>
            <Group gap="xs">
              <strong>Stream key:</strong>
              <Code>{stream.streamKey}</Code>
            </Group>
          </Stack>
        ) : (
          <Alert color="gray" variant="light">
            No ingress yet — create one to start streaming.
          </Alert>
        )}
        <CreateIngressButtons />
      </Card>

      <Card padding="md">
        <Title order={4} mb="sm">
          Stream info
        </Title>
        <StreamInfoForm stream={stream} />
      </Card>

      <Card padding="md">
        <Title order={4} mb="sm">
          Chat
        </Title>
        <ChatSettingsForm stream={stream} />
      </Card>
    </Stack>
  );
}
