import { Button, Group, Stack, TextInput, Text } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useSocialLinks } from '@/entities/social-link';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import type { SocialLinkInput, SocialLinkModel, SocialLinkOrderInput } from '@/shared/types/api';
import { SortableSocialLinkRow } from './sortable-social-link-row';

const schema = z.object({ title: z.string().min(1), url: z.string().url() });

export function SocialLinkManager() {
  const qc = useQueryClient();
  const { data, isPending } = useSocialLinks();

  // Local ordering for optimistic DnD — server is updated on drop.
  const [items, setItems] = useState<SocialLinkModel[]>([]);
  useEffect(() => {
    if (data) setItems([...data].sort((a, b) => a.position - b.position));
  }, [data]);

  const form = useForm<SocialLinkInput>({
    initialValues: { title: '', url: '' },
    validate: zodResolver(schema),
  });

  const create = useMutation({
    mutationFn: (input: SocialLinkInput) =>
      gqlRequest<{ createSocialLink: boolean }, { data: SocialLinkInput }>(
        ops.MUT_CREATE_SOCIAL_LINK,
        { data: input },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.socialLinks });
      form.reset();
      notify.success('Link added');
    },
    onError: (err: Error) => notify.error(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      gqlRequest<{ removeSocialLink: boolean }, { id: string }>(ops.MUT_REMOVE_SOCIAL_LINK, { id }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.socialLinks });
    },
    onError: (err: Error) => notify.error(err.message),
  });

  const reorder = useMutation({
    mutationFn: (list: SocialLinkOrderInput[]) =>
      gqlRequest<{ reorderSocialLink: boolean }, { list: SocialLinkOrderInput[] }>(
        ops.MUT_REORDER_SOCIAL_LINKS,
        { list },
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.socialLinks });
    },
    onError: (err: Error) => notify.error(err.message),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    reorder.mutate(next.map((it, idx) => ({ id: it.id, position: idx })));
  };

  return (
    <Stack>
      <form onSubmit={form.onSubmit((v) => create.mutate(v))}>
        <Group align="flex-end">
          <TextInput label="Title" placeholder="Twitter" {...form.getInputProps('title')} />
          <TextInput
            label="URL"
            placeholder="https://twitter.com/me"
            flex={1}
            {...form.getInputProps('url')}
          />
          <Button type="submit" loading={create.isPending}>
            Add
          </Button>
        </Group>
      </form>

      {!isPending && items.length === 0 ? (
        <EmptyState title="No social links yet" />
      ) : (
        <Stack>
          <Text size="xs" c="dimmed">
            Drag with the handle to reorder. Order is saved automatically.
          </Text>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <Stack>
                {items.map((link) => (
                  <SortableSocialLinkRow
                    key={link.id}
                    link={link}
                    onRemove={(id) => remove.mutate(id)}
                    removing={remove.isPending && remove.variables === link.id}
                  />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </Stack>
      )}
    </Stack>
  );
}
