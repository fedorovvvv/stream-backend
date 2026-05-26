import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { ROUTES } from '@/shared/config/routes';
import { notify } from '@/shared/lib/notify';
import type { AuthModel, DeactivateAccountInput } from '@/shared/types/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  pin: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function DeactivateForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const form = useForm<Values>({
    initialValues: { email: '', password: '', pin: '' },
    validate: zodResolver(schema),
  });

  const mut = useMutation({
    mutationFn: (data: DeactivateAccountInput) =>
      gqlRequest<{ deactivateAccount: AuthModel }, { data: DeactivateAccountInput }>(
        ops.MUT_DEACTIVATE_ACCOUNT,
        { data },
      ),
    onSuccess: (res) => {
      notify.info(res.deactivateAccount.message ?? 'Deactivation flow started');
      qc.clear();
      navigate(ROUTES.login);
    },
    onError: (err: Error) => notify.error(err.message),
  });

  return (
    <form
      onSubmit={form.onSubmit((v) =>
        mut.mutate({ email: v.email, password: v.password, pin: v.pin || null }),
      )}
    >
      <Stack>
        <Alert color="red" variant="light">
          This will sign you out and disable login. The record is retained for audit.
        </Alert>
        <TextInput label="Email" {...form.getInputProps('email')} />
        <PasswordInput label="Password" {...form.getInputProps('password')} />
        <TextInput label="TOTP code (if enabled)" {...form.getInputProps('pin')} />
        <Button color="red" type="submit" loading={mut.isPending}>
          Deactivate account
        </Button>
      </Stack>
    </form>
  );
}
