import { Stack, Title, Text, Group, Image, SimpleGrid } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { useCategoryBySlug } from '@/entities/category';
import { StreamCard } from '@/entities/stream';
import { PageLoader } from '@/shared/ui/loader/page-loader';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = useCategoryBySlug(slug);

  if (cat.isPending) return <PageLoader />;
  if (!cat.data) return <EmptyState title="Category not found" />;

  return (
    <Stack>
      <Group align="flex-start">
        <Image src={cat.data.thumbnailUrl} w={160} h={220} radius="md" />
        <Stack gap={4}>
          <Title order={2}>{cat.data.title}</Title>
          {cat.data.description ? <Text c="dimmed">{cat.data.description}</Text> : null}
        </Stack>
      </Group>

      {!cat.data.streams || cat.data.streams.length === 0 ? (
        <EmptyState title="No streams in this category right now" />
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
          {cat.data.streams.map((s) => (
            <StreamCard key={s.id} stream={s} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
