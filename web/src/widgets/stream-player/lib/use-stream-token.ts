import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { gqlRequest, ops } from '@/shared/api';
import type { GenerateStreamTokenInput, GenerateStreamTokenModel } from '@/shared/types/api';

/**
 * Issues a LiveKit viewer token via backend. Token is fetched once per (channelId, userId) pair.
 * `userId` may be the viewer's user ID for authed sessions, or any string for anonymous viewers —
 * the backend signs the token, so the value is only used as a track identity.
 */
export function useStreamToken(channelId: string | undefined, viewerId: string | undefined) {
  const [token, setToken] = useState<string | null>(null);
  const fetchedFor = useRef<string | null>(null);

  const mut = useMutation({
    mutationFn: (data: GenerateStreamTokenInput) =>
      gqlRequest<
        { generateStreamToken: GenerateStreamTokenModel },
        { data: GenerateStreamTokenInput }
      >(ops.MUT_GENERATE_STREAM_TOKEN, { data }),
    onSuccess: (res) => setToken(res.generateStreamToken.token),
  });

  useEffect(() => {
    if (!channelId || !viewerId) return;
    const key = `${channelId}|${viewerId}`;
    if (fetchedFor.current === key) return;
    fetchedFor.current = key;
    mut.mutate({ channelId, userId: viewerId });
    // mut is stable across renders for the same channel/viewer pair; intentionally not in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, viewerId]);

  return { token, isPending: mut.isPending, error: mut.error };
}
