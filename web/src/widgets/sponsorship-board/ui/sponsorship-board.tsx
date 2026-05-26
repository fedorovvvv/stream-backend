import { Card, SimpleGrid, Stack, Title } from '@mantine/core';
import { useMyPlans, PlanCard } from '@/entities/plan';
import { CreatePlanForm, useRemovePlan } from '@/features/sponsorship-plan-crud';
import { EmptyState } from '@/shared/ui/empty-state/empty-state';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function SponsorshipBoard() {
  const plans = useMyPlans();
  const remove = useRemovePlan();

  return (
    <Stack>
      <Card padding="md">
        <Title order={4} mb="sm">
          Create a sponsorship plan
        </Title>
        <CreatePlanForm />
      </Card>

      <Card padding="md">
        <Title order={4} mb="sm">
          Your plans
        </Title>
        {plans.isPending ? (
          <PageLoader />
        ) : !plans.data || plans.data.length === 0 ? (
          <EmptyState title="No plans yet" description="Define a tier sponsors can subscribe to." />
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {plans.data.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                busy={remove.isPending && remove.variables === p.id}
                onRemove={(plan) => remove.mutate(plan.id)}
              />
            ))}
          </SimpleGrid>
        )}
      </Card>
    </Stack>
  );
}
