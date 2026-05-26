import { Button, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';
import type { ChangeInfoInput, UserModel } from '@/shared/types/api';

const schema = z.object({
  username: z
    .string()
    .min(3)
    .regex(/^[a-z0-9_]+$/, 'Lowercase letters, digits and underscore only'),
  displayName: z.string().min(1),
  bio: z.string().max(280, 'Keep it under 280 chars'),
});

export function ProfileInfoForm({ user }: { user: UserModel }) {
  const qc = useQueryClient();
  const form = useForm<ChangeInfoInput>({
    initialValues: {
      username: user.username,
      displayName: user.displayName,
      bio: user.bio ?? '',
    },
    validate: zodResolver(schema),
  });
  const mut = useMutation({
    mutationFn: (data: ChangeInfoInput) =>
      gqlRequest<{ changeProfileInfo: boolean }, { data: ChangeInfoInput }>(
        ops.MUT_CHANGE_PROFILE_INFO,
        { data },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.profile });
      notify.success('Profile updated');
    },
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <form onSubmit={form.onSubmit((v) => mut.mutate(v))}>
      <Stack>
        <TextInput label="Display name" {...form.getInputProps('displayName')} />
        <TextInput label="Username" {...form.getInputProps('username')} />
        <Textarea label="Bio" minRows={3} {...form.getInputProps('bio')} />
        <Button type="submit" loading={mut.isPending}>
          Save profile
        </Button>
      </Stack>
    </form>
  );
}
