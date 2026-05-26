import { Button, PasswordInput, Stack, TextInput, Anchor, Group } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { ROUTES } from '@/shared/config/routes';
import { notify } from '@/shared/lib/notify';
import type { AuthModel, LoginInput } from '@/shared/types/api';

const schema = z.object({
  login: z.string().min(2, 'Username or email required'),
  password: z.string().min(6, 'Password must be at least 6 chars'),
  pin: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface MutData {
  loginUser: AuthModel;
}

export function LoginForm() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const form = useForm<FormValues>({
    initialValues: { login: '', password: '', pin: '' },
    validate: zodResolver(schema),
  });

  const mut = useMutation({
    mutationFn: (data: LoginInput) =>
      gqlRequest<MutData, { data: LoginInput }>(ops.MUT_LOGIN_USER, { data }),
    onSuccess: async (res) => {
      if (res.loginUser.user) {
        await qc.invalidateQueries({ queryKey: QK.profile });
        notify.success(`Welcome, ${res.loginUser.user.displayName}`);
        navigate(ROUTES.home);
      } else if (res.loginUser.message) {
        notify.info(res.loginUser.message);
      }
    },
    onError: (err: Error) => notify.error(err.message, 'Login failed'),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        mut.mutate({ login: values.login, password: values.password, pin: values.pin || null }),
      )}
    >
      <Stack>
        <TextInput
          label="Username or email"
          placeholder="creator"
          {...form.getInputProps('login')}
        />
        <PasswordInput label="Password" {...form.getInputProps('password')} />
        <TextInput
          label="TOTP code (if enabled)"
          placeholder="6-digit code"
          {...form.getInputProps('pin')}
        />
        <Button type="submit" loading={mut.isPending}>
          Sign in
        </Button>
        <Group justify="space-between">
          <Anchor component={Link} to={ROUTES.resetPassword} size="sm">
            Forgot password?
          </Anchor>
          <Anchor component={Link} to={ROUTES.register} size="sm">
            Create account
          </Anchor>
        </Group>
      </Stack>
    </form>
  );
}
