import { Card, Group, Stack, Text, Button } from '@mantine/core';
import type { PlanModel } from '@/shared/types/api';
import { formatMoney } from '@/shared/lib/format/money';

interface Props {
  plan: PlanModel;
  onSponsor?: (plan: PlanModel) => void;
  onRemove?: (plan: PlanModel) => void;
  busy?: boolean;
}

export function PlanCard({ plan, onSponsor, onRemove, busy }: Props) {
  return (
    <Card padding="md">
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={600}>{plan.title}</Text>
          <Text fw={700} c="brand.6">
            {formatMoney(plan.price)}
          </Text>
        </Group>
        {plan.description ? (
          <Text size="sm" c="dimmed" lineClamp={3}>
            {plan.description}
          </Text>
        ) : null}
        <Group justify="flex-end" mt="sm">
          {onSponsor ? (
            <Button onClick={() => onSponsor(plan)} loading={busy}>
              Sponsor
            </Button>
          ) : null}
          {onRemove ? (
            <Button color="red" variant="light" onClick={() => onRemove(plan)} loading={busy}>
              Remove
            </Button>
          ) : null}
        </Group>
      </Stack>
    </Card>
  );
}
