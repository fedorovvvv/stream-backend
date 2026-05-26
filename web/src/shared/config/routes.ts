export const ROUTES = {
  home: '/',
  browse: '/browse',
  category: (slug: string) => `/categories/${slug}`,
  categoryPattern: '/categories/:slug',
  channel: (username: string) => `/channel/${username}`,
  channelPattern: '/channel/:username',
  stream: (username: string) => `/stream/${username}`,
  streamPattern: '/stream/:username',

  login: '/login',
  register: '/register',
  resetPassword: '/reset-password',
  newPassword: '/new-password',
  verifyAccount: '/verify',
  deactivate: '/deactivate',

  dashboard: '/dashboard',
  dashboardStream: '/dashboard/stream',
  dashboardChat: '/dashboard/chat',
  dashboardSponsorship: '/dashboard/sponsorship',
  dashboardSubscribers: '/dashboard/subscribers',

  settings: '/settings',
  settingsProfile: '/settings/profile',
  settingsAccount: '/settings/account',
  settingsSecurity: '/settings/security',
  settingsNotifications: '/settings/notifications',
  settingsSessions: '/settings/sessions',
  settingsSocialLinks: '/settings/social-links',
  settingsTransactions: '/settings/transactions',

  notifications: '/notifications',
} as const;
