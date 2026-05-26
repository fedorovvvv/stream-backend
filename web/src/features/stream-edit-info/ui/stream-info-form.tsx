import { Button, Select, Stack, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useAllCategories } from '@/entities/category';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';
import type { ChangeStreamInfoInput, StreamModel } from '@/shared/types/api';

const schema = z.object({
  title: z.string().min(1).max(140),
  categoryId: z.string().min(1, 'Pick a category'),
});

export function StreamInfoForm({ stream }: { stream: StreamModel }) {
  const qc = useQueryClient();
  const categories = useAllCategories();
  const form = useForm<ChangeStreamInfoInput>({
    initialValues: { title: stream.title, categoryId: stream.categoryId },
    validate: zodResolver(schema),
  });
  const mut = useMutation({
    mutationFn: (data: ChangeStreamInfoInput) =>
      gqlRequest<{ changeStreamInfo: boolean }, { data: ChangeStreamInfoInput }>(
        ops.MUT_CHANGE_STREAM_INFO,
        { data },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.profile });
      notify.success('Stream info saved');
    },
    onError: (err: Error) => notify.error(err.message),
  });

  return (
    <form onSubmit={form.onSubmit((v) => mut.mutate(v))}>
      <Stack>
        <TextInput label="Stream title" {...form.getInputProps('title')} />
        <Select
          label="Category"
          searchable
          data={(categories.data ?? []).map((c) => ({ value: c.id, label: c.title }))}
          {...form.getInputProps('categoryId')}
        />
        <Button type="submit" loading={mut.isPending}>
          Save stream info
        </Button>
      </Stack>
    </form>
  );
}
