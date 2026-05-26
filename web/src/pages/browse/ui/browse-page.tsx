import { useMemo, useState } from 'react';
import { Group, SegmentedControl, Stack, TextInput, Title, SimpleGrid } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import { useAllStreams } from '@/entities/stream';
import { useAllCategories, CategoryCard } from '@/entities/category';
import { StreamGrid } from '@/entities/stream';
import { useDebouncedValue } from '@/shared/lib/hooks/use-debounced-value';
import { PageLoader } from '@/shared/ui/loader/page-loader';

type View = 'streams' | 'categories';

export function BrowsePage() {
  const [sp, setSp] = useSearchParams();
  const initialView = (sp.get('view') as View) ?? 'streams';
  const [view, setView] = useState<View>(initialView);
  const [search, setSearch] = useState(sp.get('q') ?? '');
  const debounced = useDebouncedValue(search);

  const filters = useMemo(
    () => ({ searchTerm: debounced || null, take: 60 }),
    [debounced],
  );

  const streams = useAllStreams(filters);
  const categories = useAllCategories();

  return (
    <Stack>
      <Group justify="space-between" wrap="wrap">
        <Title order={2}>Browse</Title>
        <Group gap="sm" wrap="wrap">
          <SegmentedControl
            value={view}
            onChange={(v) => {
              setView(v as View);
              setSp({ view: v, ...(search ? { q: search } : {}) });
            }}
            data={[
              { label: 'Streams', value: 'streams' },
              { label: 'Categories', value: 'categories' },
            ]}
          />
          <TextInput
            placeholder="Search…"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </Group>
      </Group>

      {view === 'streams' ? (
        streams.isPending ? (
          <PageLoader />
        ) : (
          <StreamGrid streams={streams.data ?? []} />
        )
      ) : categories.isPending ? (
        <PageLoader />
      ) : (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="md">
          {(categories.data ?? []).map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
