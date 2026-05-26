import { Button, Stack, Title, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/config/routes';

export function NotFoundPage() {
  return (
    <Stack align="center" py="xl">
      <Title order={1}>404</Title>
      <Text c="dimmed">The page you were looking for doesn't exist.</Text>
      <Button component={Link} to={ROUTES.home}>
        Back home
      </Button>
    </Stack>
  );
}
