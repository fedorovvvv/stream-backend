import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { TransactionModel } from '@/shared/types/api';

interface Q {
  findMyTransactions: TransactionModel[];
}

export function useMyTransactions(enabled = true) {
  return useQuery({
    queryKey: QK.myTransactions,
    enabled,
    queryFn: async () => {
      const data = await gqlRequest<Q>(ops.QUERY_FIND_MY_TRANSACTIONS);
      return data.findMyTransactions;
    },
  });
}
