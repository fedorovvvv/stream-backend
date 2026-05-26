import { ActionIcon, AppShell, Burger, Group, Indicator, TextInput, Title } from '@mantine/core';
import { IconBell, IconSearch } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useProfileQuery } from '@/entities/user';
import { useUnreadNotificationsCount } from '@/entities/notification';
import { LogoutButton } from '@/features/auth-logout';
import { ROUTES } from '@/shared/config/routes';
import { env } from '@/shared/config/env';
import { UserAvatar } from '@/shared/ui/avatar/user-avatar';
import { Button } from '@mantine/core';

interface Props {
  opened: boolean;
  onToggle: () => void;
}

export function Header({ opened, onToggle }: Props) {
  const profile = useProfileQuery();
  const navigate = useNavigate();
  const isAuthed = !!profile.data;
  const unread = useUnreadNotificationsCount(isAuthed);

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between" gap="md">
        <Group gap="sm">
          <Burger opened={opened} onClick={onToggle} hiddenFrom="sm" size="sm" />
          <Link to={ROUTES.home} style={{ textDecoration: 'none' }}>
            <Title order={3} c="brand.5">
              {env.VITE_APP_NAME}
            </Title>
          </Link>
        </Group>

        <TextInput
          placeholder="Search streams, channels, categories"
          leftSection={<IconSearch size={16} />}
          flex={1}
          maw={520}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = (e.target as HTMLInputElement).value.trim();
              navigate(`${ROUTES.browse}?q=${encodeURIComponent(value)}`);
            }
          }}
        />

        <Group gap="xs">
          {isAuthed ? (
            <>
              <Indicator
                disabled={!unread.data}
                size={16}
                label={unread.data && unread.data > 99 ? '99+' : unread.data}
                offset={4}
                color="red"
              >
                <ActionIcon component={Link} to={ROUTES.notifications} variant="subtle" size="lg" aria-label="Notifications">
                  <IconBell size={20} />
                </ActionIcon>
              </Indicator>
              <ActionIcon
                component={Link}
                to={ROUTES.settings}
                variant="subtle"
                size="lg"
                aria-label="Settings"
              >
                <UserAvatar user={profile.data!} size={28} />
              </ActionIcon>
              <LogoutButton size="xs" />
            </>
          ) : (
            <>
              <Button component={Link} to={ROUTES.login} variant="subtle">
                Sign in
              </Button>
              <Button component={Link} to={ROUTES.register}>
                Sign up
              </Button>
            </>
          )}
        </Group>
      </Group>
    </AppShell.Header>
  );
}
