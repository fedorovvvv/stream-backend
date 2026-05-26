import { Avatar, type AvatarProps } from '@mantine/core';
import type { UserModel } from '@/shared/types/api';

interface Props extends Omit<AvatarProps, 'src' | 'alt'> {
  user: Pick<UserModel, 'avatar' | 'username' | 'displayName'>;
}

export function UserAvatar({ user, ...rest }: Props) {
  const initials = (user.displayName || user.username || '?').slice(0, 2).toUpperCase();
  return (
    <Avatar
      src={user.avatar ?? undefined}
      alt={user.displayName ?? user.username}
      color="brand"
      radius="xl"
      {...rest}
    >
      {initials}
    </Avatar>
  );
}
