import { Card, Stack, Title, Text } from '@mantine/core';
import { RegisterForm } from '@/features/auth-register';

export function RegisterPage() {
  return (
    <Card maw={420} mx="auto" padding="xl" mt="xl">
      <Stack mb="md" gap={4}>
        <Title order={2}>Create account</Title>
        <Text c="dimmed" size="sm">
          Set up your channel in seconds.
        </Text>
      </Stack>
      <RegisterForm />
    </Card>
  );
}
