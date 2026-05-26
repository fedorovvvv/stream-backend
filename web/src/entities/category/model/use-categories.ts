import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { CategoryModel } from '@/shared/types/api';

interface QAll {
  findAllCategories: CategoryModel[];
}

export function useAllCategories() {
  return useQuery({
    queryKey: QK.categories,
    queryFn: async () => {
      const data = await gqlRequest<QAll>(ops.QUERY_FIND_ALL_CATEGORIES);
      return data.findAllCategories;
    },
    staleTime: 5 * 60_000,
  });
}

interface QRandom {
  findRandomCategories: CategoryModel[];
}

export function useRandomCategories() {
  return useQuery({
    queryKey: QK.categoriesRandom,
    queryFn: async () => {
      const data = await gqlRequest<QRandom>(ops.QUERY_FIND_RANDOM_CATEGORIES);
      return data.findRandomCategories;
    },
  });
}

interface QSlug {
  findCategoryBySlug: CategoryModel;
}

export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: QK.categoryBySlug(slug ?? ''),
    enabled: !!slug,
    queryFn: async () => {
      const data = await gqlRequest<QSlug, { slug: string }>(ops.QUERY_FIND_CATEGORY_BY_SLUG, {
        slug: slug!,
      });
      return data.findCategoryBySlug;
    },
  });
}
