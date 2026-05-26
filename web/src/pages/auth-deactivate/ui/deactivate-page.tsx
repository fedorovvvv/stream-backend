import { Card, Stack, Title } from '@mantine/core';
import { DeactivateForm } from '@/features/auth-deactivate';

export function DeactivatePage() {
  return (
    <Card maw={520} mx="auto" padding="xl" mt="xl">
      <Stack mb="md">
        <Title order={2} c="red">
          Deactivate account
        </Title>
      </Stack>
      <DeactivateForm />
    </Card>
  );
}
