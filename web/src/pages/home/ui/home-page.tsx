import { Group, SimpleGrid, Stack, Title } from '@mantine/core';
import { useRecommendedChannels } from '@/entities/user';
import { ChannelCard } from '@/entities/user';
import { useRandomStreams } from '@/entities/stream';
import { useRandomCategories, CategoryCard } from '@/entities/category';
import { StreamSection } from '@/widgets/stream-section';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function HomePage() {
  const random = useRandomStreams();
  const channels = useRecommendedChannels();
  const categories = useRandomCategories();

  return (
    <Stack gap="xl">
      <StreamSection title="Recommended streams" streams={random.data} isPending={random.isPending} />

      <Stack>
        <Group justify="space-between">
          <Title order={3}>Featured categories</Title>
        </Group>
        {categories.isPending ? (
          <PageLoader />
        ) : (
          <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="md">
            {(categories.data ?? []).map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </SimpleGrid>
        )}
      </Stack>

      <Stack>
        <Title order={3}>Recommended channels</Title>
        {channels.isPending ? (
          <PageLoader />
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {(channels.data ?? []).map((u) => (
              <ChannelCard key={u.id} user={u} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Stack>
  );
}
