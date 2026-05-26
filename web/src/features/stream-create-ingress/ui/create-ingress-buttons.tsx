import { Alert, Button, Group } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';

// LiveKit ingress types: 0 = RTMP, 1 = WHIP (livekit-server-sdk IngressInput enum).
const TYPES = [
  { label: 'RTMP', value: 0 },
  { label: 'WHIP', value: 1 },
] as const;

export function CreateIngressButtons() {
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: (ingressType: number) =>
      gqlRequest<{ createIngress: boolean }, { ingressType: number }>(ops.MUT_CREATE_INGRESS, {
        ingressType,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.profile });
      notify.success('Ingress created — refresh credentials in stream settings.');
    },
    onError: (err: Error) => notify.error(err.message),
  });

  return (
    <Alert variant="light" title="Create LiveKit ingress" color="brand">
      <Group mt="xs">
        {TYPES.map((t) => (
          <Button
            key={t.value}
            variant="light"
            loading={mut.isPending && mut.variables === t.value}
            onClick={() => mut.mutate(t.value)}
          >
            New {t.label} ingress
          </Button>
        ))}
      </Group>
    </Alert>
  );
}
