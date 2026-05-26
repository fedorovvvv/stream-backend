import {
  Room,
  RoomEvent,
  Track,
  type RemoteTrack,
  type RemoteTrackPublication,
  type RemoteParticipant,
} from 'livekit-client';
import { Alert, Badge, Group, Stack, Text } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useProfileQuery } from '@/entities/user';
import { useStreamToken } from '../lib/use-stream-token';
import { PageLoader } from '@/shared/ui/loader/page-loader';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';

interface Props {
  channelId: string;
  serverUrl: string | null;
  isLive: boolean;
}

type ConnState = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

// Stable random ID per browser tab so the token cache key stays stable for anon viewers.
let CACHED_ANON_ID: string | null = null;
function getStableAnonId(): string {
  if (CACHED_ANON_ID === null) {
    CACHED_ANON_ID = `anon-${Math.random().toString(36).slice(2, 10)}`;
  }
  return CACHED_ANON_ID;
}

export function StreamPlayer({ channelId, serverUrl, isLive }: Props) {
  const profile = useProfileQuery();
  const viewerId = profile.data?.id ?? getStableAnonId();
  const { token, isPending, error: tokenError } = useStreamToken(
    isLive ? channelId : undefined,
    viewerId,
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<ConnState>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !serverUrl || !isLive) return;
    let cancelled = false;
    const room = new Room({ adaptiveStream: true, dynacast: true });

    const attach = (track: RemoteTrack) => {
      if (track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
      } else if (track.kind === Track.Kind.Audio && audioRef.current) {
        track.attach(audioRef.current);
      }
    };
    const onTrack = (
      track: RemoteTrack,
      _pub: RemoteTrackPublication,
      _p: RemoteParticipant,
    ) => attach(track);
    const onUnsub = (track: RemoteTrack) => track.detach();
    const onDisconnect = () => setState('disconnected');

    room.on(RoomEvent.TrackSubscribed, onTrack);
    room.on(RoomEvent.TrackUnsubscribed, onUnsub);
    room.on(RoomEvent.Disconnected, onDisconnect);

    setState('connecting');
    room
      .connect(serverUrl, token)
      .then(() => {
        if (cancelled) return;
        setState('connected');
        // Late-join: re-attach tracks that arrived before our listener subscribed.
        room.remoteParticipants.forEach((p) => {
          p.trackPublications.forEach((pub) => {
            if (pub.track) attach(pub.track);
          });
        });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState('error');
        setError(e instanceof Error ? e.message : 'Failed to join LiveKit room');
      });

    return () => {
      cancelled = true;
      room.off(RoomEvent.TrackSubscribed, onTrack);
      room.off(RoomEvent.TrackUnsubscribed, onUnsub);
      room.off(RoomEvent.Disconnected, onDisconnect);
      void room.disconnect();
    };
  }, [token, serverUrl, isLive]);

  if (!isLive) {
    return (
      <EmptyState
        title="Stream is offline"
        description="The creator isn't live right now. Come back later."
      />
    );
  }
  if (!serverUrl) {
    return (
      <Alert color="yellow">
        This stream has no LiveKit server URL yet — the creator hasn't created an ingress.
      </Alert>
    );
  }
  if (tokenError) {
    return <Alert color="red">Failed to issue viewer token: {tokenError.message}</Alert>;
  }
  if (isPending || !token || state === 'connecting') {
    return <PageLoader />;
  }
  if (state === 'error') {
    return <Alert color="red">Player error: {error ?? 'unknown'}</Alert>;
  }

  return (
    <Stack gap="xs" h="100%" style={{ position: 'relative' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        controls
        muted
        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
      />
      <audio ref={audioRef} autoPlay style={{ display: 'none' }} />
      <Group gap="xs" style={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
        <Badge color="red" size="sm">
          LIVE
        </Badge>
        {state === 'disconnected' ? (
          <Badge color="gray" variant="filled" size="sm">
            disconnected
          </Badge>
        ) : null}
      </Group>
      <Text size="xs" c="dimmed" style={{ position: 'absolute', bottom: 8, right: 8 }}>
        Unmute via the player controls if audio is silent.
      </Text>
    </Stack>
  );
}
