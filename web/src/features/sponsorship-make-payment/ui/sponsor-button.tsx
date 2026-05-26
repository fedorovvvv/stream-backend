import { Button, type ButtonProps } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { notify } from '@/shared/lib/notify';
import type { MakePaymentModel } from '@/shared/types/api';

interface Props extends ButtonProps {
  planId: string;
}

export function SponsorButton({ planId, ...rest }: Props) {
  const mut = useMutation({
    mutationFn: () =>
      gqlRequest<{ makePayment: MakePaymentModel }, { planId: string }>(ops.MUT_MAKE_PAYMENT, {
        planId,
      }),
    onSuccess: (res) => {
      window.location.href = res.makePayment.url;
    },
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <Button loading={mut.isPending} onClick={() => mut.mutate()} {...rest}>
      Sponsor — checkout
    </Button>
  );
}
