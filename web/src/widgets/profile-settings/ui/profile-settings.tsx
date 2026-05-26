import { Tabs, Stack } from '@mantine/core';
import { ChangeEmailForm } from '@/features/auth-change-email';
import { ChangePasswordForm } from '@/features/auth-change-password';
import { TotpPanel } from '@/features/auth-totp';
import { ProfileInfoForm } from '@/features/profile-edit-info';
import { SocialLinkManager } from '@/features/social-link-crud';
import { NotificationSettingsForm } from '@/features/notification-settings';
import { useProfileQuery } from '@/entities/user';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function ProfileSettings() {
  const profile = useProfileQuery();
  if (profile.isPending) return <PageLoader />;
  if (!profile.data) return null;
  const user = profile.data;

  return (
    <Tabs defaultValue="profile">
      <Tabs.List>
        <Tabs.Tab value="profile">Profile</Tabs.Tab>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
        <Tabs.Tab value="links">Social links</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="profile" pt="md">
        <ProfileInfoForm user={user} />
      </Tabs.Panel>
      <Tabs.Panel value="account" pt="md">
        <Stack>
          <ChangeEmailForm initial={user.email} />
          <ChangePasswordForm />
        </Stack>
      </Tabs.Panel>
      <Tabs.Panel value="security" pt="md">
        <TotpPanel user={user} />
      </Tabs.Panel>
      <Tabs.Panel value="links" pt="md">
        <SocialLinkManager />
      </Tabs.Panel>
      <Tabs.Panel value="notifications" pt="md">
        <NotificationSettingsForm settings={user.notificationSettings ?? null} />
      </Tabs.Panel>
    </Tabs>
  );
}
