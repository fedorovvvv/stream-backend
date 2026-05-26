import { ActionIcon, Card, Group, Stack } from '@mantine/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import type { SocialLinkModel } from '@/shared/types/api';

interface Props {
  link: SocialLinkModel;
  onRemove: (id: string) => void;
  removing?: boolean;
}

export function SortableSocialLinkRow({ link, onRemove, removing }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} padding="sm">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" miw={0}>
          <ActionIcon
            variant="subtle"
            color="gray"
            {...attributes}
            {...listeners}
            style={{ cursor: 'grab' }}
            aria-label="Drag to reorder"
          >
            <IconGripVertical size={16} />
          </ActionIcon>
          <Stack gap={0} miw={0}>
            <strong>{link.title}</strong>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.url}
            </a>
          </Stack>
        </Group>
        <ActionIcon
          color="red"
          variant="light"
          loading={removing}
          onClick={() => onRemove(link.id)}
          aria-label="Remove link"
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
