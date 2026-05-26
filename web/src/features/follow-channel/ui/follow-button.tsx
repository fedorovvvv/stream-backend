import { Button } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';

interface Props {
  channelId: string;
  isFollowing: boolean;
}

export function FollowButton({ channelId, isFollowing }: Props) {
  const qc = useQueryClient();
  const mut = useMutation<{ ok: boolean }, Error, void>({
    mutationFn: async () => {
      if (isFollowing) {
        const r = await gqlRequest<{ unfollowChannel: boolean }, { channelId: string }>(
          ops.MUT_UNFOLLOW_CHANNEL,
          { channelId },
        );
        return { ok: r.unfollowChannel };
      }
      const r = await gqlRequest<{ followChannel: boolean }, { channelId: string }>(
        ops.MUT_FOLLOW_CHANNEL,
        { channelId },
      );
      return { ok: r.followChannel };
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: QK.myFollowings }),
        qc.invalidateQueries({ queryKey: QK.followersCountByChannel(channelId) }),
        qc.invalidateQueries({ queryKey: QK.isFollowing(channelId) }),
      ]);
    },
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <Button
      variant={isFollowing ? 'default' : 'filled'}
      onClick={() => mut.mutate()}
      loading={mut.isPending}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
