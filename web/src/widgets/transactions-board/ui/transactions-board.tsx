import { Badge, Card, Stack, Table, Text } from '@mantine/core';
import { useMyTransactions } from '@/entities/transaction';
import { formatDate } from '@/shared/lib/format/date';
import { formatMoney } from '@/shared/lib/format/money';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import { PageLoader } from '@/shared/ui/loader/page-loader';

const STATUS_COLOR: Record<string, string> = {
  SUCCESS: 'green',
  PENDING: 'yellow',
  FAILED: 'red',
  EXPIRES: 'gray',
};

export function TransactionsBoard() {
  const tx = useMyTransactions();
  if (tx.isPending) return <PageLoader />;
  if (!tx.data || tx.data.length === 0) return <EmptyState title="No transactions" />;
  return (
    <Card padding="md">
      <Stack gap="md">
        <Text fw={600}>Transactions</Text>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Stripe Sub</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tx.data.map((t) => (
              <Table.Tr key={t.id}>
                <Table.Td>{formatDate(t.createdAt)}</Table.Td>
                <Table.Td>{formatMoney(t.amount, t.currency)}</Table.Td>
                <Table.Td>
                  <Badge color={STATUS_COLOR[t.status] ?? 'gray'} variant="light">
                    {t.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">
                    {t.stripeSubscriptionId}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Card>
  );
}
