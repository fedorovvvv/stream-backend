import { Button, PasswordInput, Stack, TextInput, Anchor, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { ROUTES } from '@/shared/config/routes';
import { notify } from '@/shared/lib/notify';
import type { CreateUserInput } from '@/shared/types/api';

const schema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 chars')
    .regex(/^[a-z0-9_]+$/, 'Lowercase, digits and underscore only'),
  email: z.string().email(),
  password: z.string().min(8, 'At least 8 chars'),
});

type Values = z.infer<typeof schema>;

interface MutData {
  createUser: boolean;
}

export function RegisterForm() {
  const form = useForm<Values>({
    initialValues: { username: '', email: '', password: '' },
    validate: zodResolver(schema),
  });

  const mut = useMutation({
    mutationFn: (data: CreateUserInput) =>
      gqlRequest<MutData, { data: CreateUserInput }>(ops.MUT_CREATE_USER, { data }),
    onSuccess: () =>
      notify.success(
        'Account created. Check your email for the verification link.',
        'Almost there',
      ),
    onError: (err: Error) => notify.error(err.message, 'Registration failed'),
  });

  return (
    <form onSubmit={form.onSubmit((v) => mut.mutate(v))}>
      <Stack>
        <TextInput label="Username" placeholder="creator" {...form.getInputProps('username')} />
        <TextInput label="Email" type="email" {...form.getInputProps('email')} />
        <PasswordInput label="Password" {...form.getInputProps('password')} />
        <Button type="submit" loading={mut.isPending}>
          Create account
        </Button>
        <Text c="dimmed" size="sm">
          Already have an account?{' '}
          <Anchor component={Link} to={ROUTES.login}>
            Sign in
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}
