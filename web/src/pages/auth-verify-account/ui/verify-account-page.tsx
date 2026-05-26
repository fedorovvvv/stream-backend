import { Card, Stack, Title } from '@mantine/core';
import { VerifyAccount } from '@/features/auth-verify-account';

export function VerifyAccountPage() {
  return (
    <Card maw={420} mx="auto" padding="xl" mt="xl">
      <Stack>
        <Title order={2}>Verifying your account…</Title>
        <VerifyAccount />
      </Stack>
    </Card>
  );
}
