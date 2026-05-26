import { AppShell, NavLink, Stack, Text } from '@mantine/core';
import {
  IconBroadcast,
  IconCategory,
  IconCompass,
  IconCreditCard,
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { useMyFollowings } from '@/entities/follow';
import { useProfileQuery } from '@/entities/user';
import { UserAvatar } from '@/shared/ui/avatar/user-avatar';
import { ROUTES } from '@/shared/config/routes';

export function Sidebar() {
  const profile = useProfileQuery();
  const followings = useMyFollowings(!!profile.data);

  return (
    <AppShell.Navbar p="md">
      <Stack gap={4}>
        <NavLink
          component={RouterNavLink}
          to={ROUTES.home}
          end
          label="Home"
          leftSection={<IconCompass size={18} />}
        />
        <NavLink
          component={RouterNavLink}
          to={ROUTES.browse}
          label="Browse"
          leftSection={<IconBroadcast size={18} />}
        />
        <NavLink
          component={RouterNavLink}
          to={ROUTES.browse + '?view=categories'}
          label="Categories"
          leftSection={<IconCategory size={18} />}
        />
        {profile.data ? (
          <>
            <NavLink
              component={RouterNavLink}
              to={ROUTES.dashboard}
              label="Creator dashboard"
              leftSection={<IconLayoutDashboard size={18} />}
            />
            <NavLink
              component={RouterNavLink}
              to={ROUTES.dashboardSponsorship}
              label="Sponsorship"
              leftSection={<IconCreditCard size={18} />}
            />
            <NavLink
              component={RouterNavLink}
              to={ROUTES.dashboardSubscribers}
              label="Subscribers"
              leftSection={<IconUsers size={18} />}
            />
            <NavLink
              component={RouterNavLink}
              to={ROUTES.settings}
              label="Settings"
              leftSection={<IconSettings size={18} />}
            />
          </>
        ) : null}
      </Stack>

      {followings.data && followings.data.length > 0 ? (
        <Stack mt="lg" gap={2}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            Following
          </Text>
          {followings.data.slice(0, 12).map((f) => (
            <NavLink
              key={f.id}
              component={RouterNavLink}
              to={ROUTES.channel(f.following.username)}
              label={f.following.displayName}
              description={f.following.stream?.isLive ? 'LIVE' : 'offline'}
              leftSection={<UserAvatar user={f.following} size={24} />}
            />
          ))}
        </Stack>
      ) : profile.data ? (
        <Stack mt="lg" gap={2}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            Following
          </Text>
          <Text size="xs" c="dimmed">
            Follow channels to see them here.
          </Text>
        </Stack>
      ) : null}
    </AppShell.Navbar>
  );
}
