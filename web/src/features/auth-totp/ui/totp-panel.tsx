import { Alert, Button, Code, Group, Image, Stack, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { gqlRequest, ops } from '@/shared/api';
import { QK } from '@/shared/config/query-keys';
import { notify } from '@/shared/lib/notify';
import type { EnableTotpInput, TotpModel, UserModel } from '@/shared/types/api';

const schema = z.object({ pin: z.string().length(6, 'Must be 6 digits') });
type Values = z.infer<typeof schema>;

export function TotpPanel({ user }: { user: UserModel }) {
  const qc = useQueryClient();

  const totp = useQuery({
    queryKey: QK.totpSecret,
    enabled: !user.isTotpEnabled,
    queryFn: async () => {
      const data = await gqlRequest<{ generateTotpSecret: TotpModel }>(
        ops.QUERY_GENERATE_TOTP_SECRET,
      );
      return data.generateTotpSecret;
    },
  });

  const enable = useMutation({
    mutationFn: (data: EnableTotpInput) =>
      gqlRequest<{ enableTotp: boolean }, { data: EnableTotpInput }>(ops.MUT_ENABLE_TOTP, { data }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.profile });
      notify.success('Two-factor authentication enabled');
    },
    onError: (err: Error) => notify.error(err.message),
  });

  const disable = useMutation({
    mutationFn: () => gqlRequest<{ disableTotp: boolean }>(ops.MUT_DISABLE_TOTP),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: QK.profile });
      notify.success('Two-factor authentication disabled');
    },
    onError: (err: Error) => notify.error(err.message),
  });

  const form = useForm<Values>({ initialValues: { pin: '' }, validate: zodResolver(schema) });

  if (user.isTotpEnabled) {
    return (
      <Stack>
        <Alert color="green">Two-factor is enabled on this account.</Alert>
        <Button color="red" variant="light" loading={disable.isPending} onClick={() => disable.mutate()}>
          Disable two-factor
        </Button>
      </Stack>
    );
  }

  return (
    <Stack>
      <Text size="sm" c="dimmed">
        Scan the QR with Google Authenticator / 1Password, then enter the 6-digit code below.
      </Text>
      {totp.data ? (
        <Group align="flex-start">
          <Image src={totp.data.qrcodeUrl} w={180} h={180} fit="contain" />
          <Stack>
            <Text size="sm">Manual secret:</Text>
            <Code>{totp.data.secret}</Code>
          </Stack>
        </Group>
      ) : null}
      <form
        onSubmit={form.onSubmit((v) =>
          totp.data ? enable.mutate({ secret: totp.data.secret, pin: v.pin }) : undefined,
        )}
      >
        <Stack>
          <TextInput label="6-digit code" maxLength={6} {...form.getInputProps('pin')} />
          <Button type="submit" loading={enable.isPending} disabled={!totp.data}>
            Enable two-factor
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
