import { Card, Stack, Title } from '@mantine/core';
import { NewPasswordForm } from '@/features/auth-new-password';

export function NewPasswordPage() {
  return (
    <Card maw={420} mx="auto" padding="xl" mt="xl">
      <Stack mb="md">
        <Title order={2}>Set new password</Title>
      </Stack>
      <NewPasswordForm />
    </Card>
  );
}
