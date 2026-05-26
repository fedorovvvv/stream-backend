import { useState } from 'react';
import { Button, Code, Stack } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { notify } from '@/shared/lib/notify';
import type { GenerateStreamTokenInput, GenerateStreamTokenModel } from '@/shared/types/api';

interface Props {
  channelId: string;
  userId: string;
}

export function GenerateTokenButton({ channelId, userId }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const mut = useMutation({
    mutationFn: (data: GenerateStreamTokenInput) =>
      gqlRequest<
        { generateStreamToken: GenerateStreamTokenModel },
        { data: GenerateStreamTokenInput }
      >(ops.MUT_GENERATE_STREAM_TOKEN, { data }),
    onSuccess: (res) => setToken(res.generateStreamToken.token),
    onError: (err: Error) => notify.error(err.message),
  });
  return (
    <Stack gap="xs">
      <Button
        variant="light"
        loading={mut.isPending}
        onClick={() => mut.mutate({ channelId, userId })}
      >
        Generate LiveKit viewer token
      </Button>
      {token ? <Code block>{token}</Code> : null}
    </Stack>
  );
}
