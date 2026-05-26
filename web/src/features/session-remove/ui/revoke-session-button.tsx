import { Button, type ButtonProps } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';

interface Props extends ButtonProps {
  sessionId: string;
}

export function RevokeSessionButton({ sessionId, ...rest }: Props) {
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: () =>
      gqlRequest<{ removeSession: boolean }, { id: string }>(ops.MUT_REMOVE_SESSION, {
        id: sessionId,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.sessions });
      notify.info('Session revoked');
    },
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <Button
      color="red"
      variant="light"
      loading={mut.isPending}
      onClick={() => mut.mutate()}
      {...rest}
    >
      Revoke
    </Button>
  );
}
