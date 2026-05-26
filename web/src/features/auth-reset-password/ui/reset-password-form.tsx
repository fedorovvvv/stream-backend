import { Button, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { notify } from '@/shared/lib/notify';
import type { ResetPasswordInput } from '@/shared/types/api';

const schema = z.object({ email: z.string().email() });
type Values = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const form = useForm<Values>({ initialValues: { email: '' }, validate: zodResolver(schema) });
  const mut = useMutation({
    mutationFn: (data: ResetPasswordInput) =>
      gqlRequest<{ resetPassword: boolean }, { data: ResetPasswordInput }>(
        ops.MUT_RESET_PASSWORD,
        { data },
      ),
    onSuccess: () => notify.success('Check your email for the reset link.'),
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <form onSubmit={form.onSubmit((v) => mut.mutate(v))}>
      <Stack>
        <TextInput label="Email" type="email" {...form.getInputProps('email')} />
        <Button type="submit" loading={mut.isPending}>
          Send reset link
        </Button>
      </Stack>
    </form>
  );
}
