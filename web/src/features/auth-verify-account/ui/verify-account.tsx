import { useEffect, useRef } from 'react';
import { Alert, Loader, Stack } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { ROUTES } from '@/shared/config/routes';
import { notify } from '@/shared/lib/notify';
import type { VerificationInput } from '@/shared/types/api';

export function VerifyAccount() {
  const [sp] = useSearchParams();
  const token = sp.get('token');
  const navigate = useNavigate();
  const qc = useQueryClient();
  const triggered = useRef(false);

  const mut = useMutation({
    mutationFn: (data: VerificationInput) =>
      gqlRequest<{ verifyAccount: { id: string } }, { data: VerificationInput }>(
        ops.MUT_VERIFY_ACCOUNT,
        { data },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.profile });
      notify.success('Email verified — welcome aboard!');
      navigate(ROUTES.home);
    },
    onError: (err: Error) => notify.error(err.message, 'Verification failed'),
  });

  useEffect(() => {
    if (!token || triggered.current) return;
    triggered.current = true;
    mut.mutate({ token });
  }, [token, mut]);

  if (!token) {
    return <Alert color="red">Missing verification token in URL.</Alert>;
  }
  if (mut.isPending) {
    return (
      <Stack align="center" py="xl">
        <Loader />
      </Stack>
    );
  }
  if (mut.isError) {
    return <Alert color="red">{mut.error.message}</Alert>;
  }
  return null;
}
