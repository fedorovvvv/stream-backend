import { Card, Image, Stack, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { CategoryModel } from '@/shared/types/api';
import { ROUTES } from '@/shared/config/routes';

export function CategoryCard({ category }: { category: CategoryModel }) {
  return (
    <Card
      component={Link}
      to={ROUTES.category(category.slug)}
      padding={0}
      style={{ overflow: 'hidden' }}
    >
      <Image
        src={category.thumbnailUrl}
        h={220}
        fallbackSrc="https://placehold.co/300x440/0b0b10/8b5cf6?text=Category"
        alt={category.title}
        style={{ objectFit: 'cover' }}
      />
      <Stack gap={2} p="sm">
        <Text fw={600}>{category.title}</Text>
        {category.description ? (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {category.description}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
