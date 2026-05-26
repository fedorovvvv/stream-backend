import { Button, PasswordInput, Stack } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { notify } from '@/shared/lib/notify';
import type { ChangePasswordInput } from '@/shared/types/api';

const schema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(8),
});

type Values = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const form = useForm<Values>({
    initialValues: { oldPassword: '', newPassword: '' },
    validate: zodResolver(schema),
  });
  const mut = useMutation({
    mutationFn: (data: ChangePasswordInput) =>
      gqlRequest<{ changePassword: boolean }, { data: ChangePasswordInput }>(
        ops.MUT_CHANGE_PASSWORD,
        { data },
      ),
    onSuccess: () => {
      notify.success('Password updated');
      form.reset();
    },
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <form onSubmit={form.onSubmit((v) => mut.mutate(v))}>
      <Stack>
        <PasswordInput label="Current password" {...form.getInputProps('oldPassword')} />
        <PasswordInput label="New password" {...form.getInputProps('newPassword')} />
        <Button type="submit" loading={mut.isPending}>
          Change password
        </Button>
      </Stack>
    </form>
  );
}
