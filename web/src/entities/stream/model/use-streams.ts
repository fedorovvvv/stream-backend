import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { FiltersInput, StreamModel } from '@/shared/types/api';

interface Q {
  findAllStreams: StreamModel[];
}

export function useAllStreams(filters: FiltersInput = {}) {
  return useQuery({
    queryKey: QK.streams(filters),
    queryFn: async () => {
      const data = await gqlRequest<Q, { filters: FiltersInput }>(ops.QUERY_FIND_ALL_STREAMS, {
        filters,
      });
      return data.findAllStreams;
    },
  });
}

interface QR {
  findRandomStreams: StreamModel[];
}

export function useRandomStreams() {
  return useQuery({
    queryKey: QK.streamsRandom,
    queryFn: async () => {
      const data = await gqlRequest<QR>(ops.QUERY_FIND_RANDOM_STREAMS);
      return data.findRandomStreams;
    },
  });
}
