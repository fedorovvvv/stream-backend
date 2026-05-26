import { Title, Group, Stack, Button } from '@mantine/core';
import { StreamGrid } from '@/entities/stream';
import { PageLoader } from '@/shared/ui/loader/page-loader';
import type { StreamModel } from '@/shared/types/api';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  streams: StreamModel[] | undefined;
  isPending: boolean;
  action?: ReactNode;
  onRefresh?: () => void;
}

export function StreamSection({ title, streams, isPending, action, onRefresh }: Props) {
  return (
    <Stack>
      <Group justify="space-between">
        <Title order={3}>{title}</Title>
        <Group gap="xs">
          {onRefresh ? (
            <Button variant="subtle" size="xs" onClick={onRefresh}>
              Refresh
            </Button>
          ) : null}
          {action}
        </Group>
      </Group>
      {isPending ? <PageLoader /> : <StreamGrid streams={streams ?? []} />}
    </Stack>
  );
}
