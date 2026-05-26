import { Button, NumberInput, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';
import type { CreatePlanInput } from '@/shared/types/api';

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
});

type Values = z.infer<typeof schema>;

export function CreatePlanForm() {
  const qc = useQueryClient();
  const form = useForm<Values>({
    initialValues: { title: '', description: '', price: 5 },
    validate: zodResolver(schema),
  });
  const mut = useMutation({
    mutationFn: (data: CreatePlanInput) =>
      gqlRequest<{ createSponsorshipPlan: boolean }, { data: CreatePlanInput }>(
        ops.MUT_CREATE_PLAN,
        { data },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.myPlans });
      form.reset();
      notify.success('Plan created');
    },
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <form
      onSubmit={form.onSubmit((v) =>
        mut.mutate({ title: v.title, description: v.description ?? null, price: v.price }),
      )}
    >
      <Stack>
        <TextInput label="Title" {...form.getInputProps('title')} />
        <Textarea label="Description" minRows={2} {...form.getInputProps('description')} />
        <NumberInput
          label="Price (USD/month)"
          min={1}
          decimalScale={2}
          {...form.getInputProps('price')}
        />
        <Button type="submit" loading={mut.isPending}>
          Create plan
        </Button>
      </Stack>
    </form>
  );
}
