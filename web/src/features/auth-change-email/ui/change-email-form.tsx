import { Button, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';
import type { ChangeEmailInput } from '@/shared/types/api';

const schema = z.object({ email: z.string().email() });
type Values = z.infer<typeof schema>;

export function ChangeEmailForm({ initial }: { initial: string }) {
  const qc = useQueryClient();
  const form = useForm<Values>({ initialValues: { email: initial }, validate: zodResolver(schema) });
  const mut = useMutation({
    mutationFn: (data: ChangeEmailInput) =>
      gqlRequest<{ changeEmail: boolean }, { data: ChangeEmailInput }>(ops.MUT_CHANGE_EMAIL, {
        data,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.profile });
      notify.success('Email updated. Verify the new address from your inbox.');
    },
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <form onSubmit={form.onSubmit((v) => mut.mutate(v))}>
      <Stack>
        <TextInput label="Email" {...form.getInputProps('email')} />
        <Button type="submit" loading={mut.isPending}>
          Update email
        </Button>
      </Stack>
    </form>
  );
}
