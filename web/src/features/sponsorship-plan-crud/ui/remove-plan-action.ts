import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';

export function useRemovePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) =>
      gqlRequest<{ removeSponsorshipPlan: boolean }, { planId: string }>(ops.MUT_REMOVE_PLAN, {
        planId,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.myPlans });
      notify.success('Plan removed');
    },
    onError: (err: Error) => notify.error(err.message),
  });
}
