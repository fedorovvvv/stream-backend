import { Button, type ButtonProps } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { gqlRequest, ops } from '@/shared/api';
import { ROUTES } from '@/shared/config/routes';
import { notify } from '@/shared/lib/notify';

interface Props extends ButtonProps {
  label?: string;
}

export function LogoutButton({ label = 'Sign out', ...rest }: Props) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const mut = useMutation({
    mutationFn: () => gqlRequest<{ logoutUser: boolean }>(ops.MUT_LOGOUT_USER),
    onSuccess: async () => {
      qc.clear();
      notify.info('Signed out');
      navigate(ROUTES.login);
    },
    onError: (err: Error) => notify.error(err.message, 'Sign out failed'),
  });
  return (
    <Button variant="light" color="red" loading={mut.isPending} onClick={() => mut.mutate()} {...rest}>
      {label}
    </Button>
  );
}
