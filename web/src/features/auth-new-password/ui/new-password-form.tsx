import { Button, PasswordInput, Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { ROUTES } from '@/shared/config/routes';
import { notify } from '@/shared/lib/notify';
import type { NewPasswordInput } from '@/shared/types/api';

const schema = z
  .object({
    password: z.string().min(8),
    passwordRepeat: z.string().min(8),
  })
  .refine((d) => d.password === d.passwordRepeat, {
    message: 'Passwords do not match',
    path: ['passwordRepeat'],
  });

type Values = z.infer<typeof schema>;

export function NewPasswordForm() {
  const [sp] = useSearchParams();
  const token = sp.get('token') ?? '';
  const navigate = useNavigate();

  const form = useForm<Values>({
    initialValues: { password: '', passwordRepeat: '' },
    validate: zodResolver(schema),
  });

  const mut = useMutation({
    mutationFn: (data: NewPasswordInput) =>
      gqlRequest<{ newPassword: boolean }, { data: NewPasswordInput }>(ops.MUT_NEW_PASSWORD, {
        data,
      }),
    onSuccess: () => {
      notify.success('Password updated — you can sign in now');
      navigate(ROUTES.login);
    },
    onError: (err: Error) => notify.error(err.message),
  });

  return (
    <form
      onSubmit={form.onSubmit((v) =>
        mut.mutate({ password: v.password, passwordRepeat: v.passwordRepeat, token }),
      )}
    >
      <Stack>
        <PasswordInput label="New password" {...form.getInputProps('password')} />
        <PasswordInput label="Repeat password" {...form.getInputProps('passwordRepeat')} />
        <Button type="submit" loading={mut.isPending} disabled={!token}>
          Set new password
        </Button>
      </Stack>
    </form>
  );
}
