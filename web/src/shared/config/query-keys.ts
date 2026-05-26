import type { FiltersInput } from '@/shared/types/api';

// Stable, typed cache keys. Keep all keys in one place so invalidation has a single source of truth.
export const QK = {
  profile: ['profile'] as const,

  categories: ['categories'] as const,
  categoriesRandom: ['categories', 'random'] as const,
  categoryBySlug: (slug: string) => ['categories', 'by-slug', slug] as const,

  streams: (filters: FiltersInput) => ['streams', filters] as const,
  streamsRandom: ['streams', 'random'] as const,

  recommendedChannels: ['channels', 'recommended'] as const,
  channelByUsername: (username: string) => ['channels', 'by-username', username] as const,
  followersCountByChannel: (channelId: string) =>
    ['channels', 'followers-count', channelId] as const,
  sponsorsByChannel: (channelId: string) => ['channels', 'sponsors', channelId] as const,

  chatMessages: (streamId: string) => ['chat', 'messages', streamId] as const,

  myFollowers: ['follow', 'my-followers'] as const,
  myFollowings: ['follow', 'my-followings'] as const,
  isFollowing: (channelId: string) => ['follow', 'is-following', channelId] as const,

  myPlans: ['sponsorship', 'my-plans'] as const,
  mySponsors: ['sponsorship', 'my-sponsors'] as const,
  myTransactions: ['sponsorship', 'my-transactions'] as const,

  notifications: ['notifications', 'list'] as const,
  notificationsUnreadCount: ['notifications', 'unread-count'] as const,

  socialLinks: ['profile', 'social-links'] as const,
  sessions: ['auth', 'sessions'] as const,
  currentSession: ['auth', 'current-session'] as const,
  totpSecret: ['auth', 'totp-secret'] as const,
} as const;
