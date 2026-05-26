import { SimpleGrid } from '@mantine/core';
import type { StreamModel } from '@/shared/types/api';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import { StreamCard } from './stream-card';

export function StreamGrid({ streams }: { streams: StreamModel[] }) {
  if (streams.length === 0) {
    return <EmptyState title="No streams found" description="Try adjusting filters or come back later." />;
  }
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md" verticalSpacing="md">
      {streams.map((s) => (
        <StreamCard key={s.id} stream={s} />
      ))}
    </SimpleGrid>
  );
}
