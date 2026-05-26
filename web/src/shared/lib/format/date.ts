import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatRelative(input: string | Date | number): string {
  return dayjs(input).fromNow();
}

export function formatDate(input: string | Date | number, fmt = 'DD MMM YYYY, HH:mm'): string {
  return dayjs(input).format(fmt);
}
