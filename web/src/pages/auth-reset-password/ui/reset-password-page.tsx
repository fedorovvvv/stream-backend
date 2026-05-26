import { Card, Stack, Title, Text } from '@mantine/core';
import { ResetPasswordForm } from '@/features/auth-reset-password';

export function ResetPasswordPage() {
  return (
    <Card maw={420} mx="auto" padding="xl" mt="xl">
      <Stack mb="md" gap={4}>
        <Title order={2}>Reset password</Title>
        <Text c="dimmed" size="sm">
          We'll email you a recovery link.
        </Text>
      </Stack>
      <ResetPasswordForm />
    </Card>
  );
}
