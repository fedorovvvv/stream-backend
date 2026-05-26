import { Center, Stack, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { env } from '@/shared/config/env';
import { ROUTES } from '@/shared/config/routes';
import { ErrorBoundary } from '@/shared/ui/error-boundary/error-boundary';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Center mih="100vh" px="md" py="xl">
      <Stack w="100%" maw={460} align="center">
        <Link to={ROUTES.home} style={{ textDecoration: 'none' }}>
          <Title order={1} c="brand.5">
            {env.VITE_APP_NAME}
          </Title>
        </Link>
        <ErrorBoundary>{children}</ErrorBoundary>
      </Stack>
    </Center>
  );
}
