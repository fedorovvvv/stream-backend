import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { ErrorBoundary } from '@/shared/ui/error-boundary/error-boundary';

export function AppLayout({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <Header opened={opened} onToggle={toggle} />
      <Sidebar />
      <AppShell.Main>
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppShell.Main>
    </AppShell>
  );
}
