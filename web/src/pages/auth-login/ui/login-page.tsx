import { Card, Stack, Title, Text } from '@mantine/core';
import { LoginForm } from '@/features/auth-login';

export function LoginPage() {
  return (
    <Card maw={420} mx="auto" padding="xl" mt="xl">
      <Stack mb="md" gap={4}>
        <Title order={2}>Sign in</Title>
        <Text c="dimmed" size="sm">
          Welcome back. Sign in to continue streaming.
        </Text>
      </Stack>
      <LoginForm />
    </Card>
  );
}
