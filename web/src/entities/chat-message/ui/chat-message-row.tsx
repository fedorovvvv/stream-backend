import { Group, Text } from '@mantine/core';
import type { ChatMessageModel } from '@/shared/types/api';
import { UserAvatar } from '@/shared/ui/avatar/user-avatar';

export function ChatMessageRow({ message }: { message: ChatMessageModel }) {
  return (
    <Group gap="xs" align="flex-start" wrap="nowrap">
      <UserAvatar user={message.user} size={24} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <Group gap={6} wrap="nowrap">
          <Text size="sm" fw={600} c="brand.6">
            {message.user.displayName}
          </Text>
        </Group>
        <Text size="sm" style={{ wordBreak: 'break-word' }}>
          {message.text}
        </Text>
      </div>
    </Group>
  );
}
