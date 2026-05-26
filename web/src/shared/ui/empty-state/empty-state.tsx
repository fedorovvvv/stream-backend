import { Stack, Text, ThemeIcon } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: Props) {
  return (
    <Stack align="center" gap="sm" py="xl">
      <ThemeIcon size={64} radius="xl" variant="light">
        {icon ?? <IconInbox size={32} />}
      </ThemeIcon>
      <Text fw={600} size="lg">
        {title}
      </Text>
      {description ? (
        <Text c="dimmed" size="sm" ta="center" maw={420}>
          {description}
        </Text>
      ) : null}
      {action}
    </Stack>
  );
}
