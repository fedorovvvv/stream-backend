import { useQuery } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import type { NotificationModel } from '@/shared/types/api';

interface QList {
  findNotificationsByUser: NotificationModel[];
}

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: QK.notifications,
    enabled,
    queryFn: async () => {
      const data = await gqlRequest<QList>(ops.QUERY_FIND_NOTIFICATIONS);
      return data.findNotificationsByUser;
    },
  });
}

interface QUnread {
  findNotificationsUnreadCount: number;
}

export function useUnreadNotificationsCount(enabled = true) {
  return useQuery({
    queryKey: QK.notificationsUnreadCount,
    enabled,
    refetchInterval: 60_000,
    queryFn: async () => {
      const data = await gqlRequest<QUnread>(ops.QUERY_FIND_NOTIFICATIONS_UNREAD_COUNT);
      return data.findNotificationsUnreadCount;
    },
  });
}
