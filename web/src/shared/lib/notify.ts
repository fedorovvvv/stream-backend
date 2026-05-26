import { notifications } from '@mantine/notifications';

export const notify = {
  success: (message: string, title = 'Success') =>
    notifications.show({ color: 'green', title, message }),
  error: (message: string, title = 'Error') =>
    notifications.show({ color: 'red', title, message }),
  info: (message: string, title?: string) =>
    notifications.show({ color: 'blue', title, message }),
};
