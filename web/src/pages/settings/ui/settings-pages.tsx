import { Stack, Tabs, Title } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileSettings } from '@/widgets/profile-settings';
import { SessionsBoard } from '@/widgets/sessions-board';
import { TransactionsBoard } from '@/widgets/transactions-board';
import { FollowingsList } from '@/widgets/follow-list';
import { DeactivateForm } from '@/features/auth-deactivate';
import { ROUTES } from '@/shared/config/routes';

export function SettingsLayoutPage() {
  const navigate = useNavigate();
  const loc = useLocation();
  const tab =
    loc.pathname === ROUTES.settingsSessions
      ? 'sessions'
      : loc.pathname === ROUTES.settingsTransactions
        ? 'transactions'
        : loc.pathname === '/settings/followings'
          ? 'followings'
          : loc.pathname === ROUTES.deactivate
            ? 'deactivate'
            : 'profile';

  return (
    <Stack>
      <Title order={2}>Settings</Title>
      <Tabs
        value={tab}
        onChange={(v) => {
          if (v === 'sessions') navigate(ROUTES.settingsSessions);
          else if (v === 'transactions') navigate(ROUTES.settingsTransactions);
          else if (v === 'followings') navigate('/settings/followings');
          else if (v === 'deactivate') navigate(ROUTES.deactivate);
          else navigate(ROUTES.settings);
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="profile">Profile</Tabs.Tab>
          <Tabs.Tab value="sessions">Sessions</Tabs.Tab>
          <Tabs.Tab value="transactions">Billing</Tabs.Tab>
          <Tabs.Tab value="followings">Following</Tabs.Tab>
          <Tabs.Tab value="deactivate" color="red">
            Danger zone
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="profile" pt="md">
          <ProfileSettings />
        </Tabs.Panel>
        <Tabs.Panel value="sessions" pt="md">
          <SessionsBoard />
        </Tabs.Panel>
        <Tabs.Panel value="transactions" pt="md">
          <TransactionsBoard />
        </Tabs.Panel>
        <Tabs.Panel value="followings" pt="md">
          <FollowingsList />
        </Tabs.Panel>
        <Tabs.Panel value="deactivate" pt="md">
          <DeactivateForm />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
