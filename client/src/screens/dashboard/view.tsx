import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import {
  Layout,
  Navbar,
  TrainingProgressChart,
  SimpleGrid,
  Card,
  Group,
  Stack,
  Badge,
  Text,
  Title,
} from '../../components';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconArrowRight,
} from '../../components/icons';
import type { ExerciseMetrics } from '../../model/aggregation';

const trendIcons = {
  improving: <IconTrendingUp size={16} />,
  stable: <IconArrowRight size={16} />,
  declining: <IconTrendingDown size={16} />,
};

const trendColors = {
  improving: 'green',
  stable: 'gray',
  declining: 'red',
};

const PureDashboard: React.FC<any> = ({ aggregates, exerciseMetrics }) => {
  const topExercises = exerciseMetrics.slice(0, 5);

  return (
    <Layout bottomBar={<Navbar />} dataTestId="dashboard-screen">
      <Stack style={{ padding: 12 }} gap="lg">
        <Title order={2}>Progress dashboard</Title>

        <Stack gap="md">
          <div>
            <Title order={3}>Volume trend (last 30 days)</Title>
            <div style={{ height: 240, marginTop: 12 }}>
              <TrainingProgressChart
                data={aggregates.slice(-30)}
                variant="detailed"
                height={240}
              />
            </div>
          </div>

          <div>
            <Title order={3}>Sessions (last 30 days)</Title>
            <div style={{ height: 160, marginTop: 12 }}>
              <TrainingProgressChart
                data={aggregates.slice(-30)}
                variant="bar"
                height={160}
              />
            </div>
          </div>
        </Stack>

        {exerciseMetrics.length > 0 && (
          <Stack gap="lg">
            <div>
              <Title order={3}>Personal Records (last 30 days)</Title>
              <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3 }}
                spacing="md"
                style={{ marginTop: 12 }}
              >
                {exerciseMetrics.map((exercise: ExerciseMetrics) => (
                  <Card
                    key={exercise.exerciseName}
                    withBorder
                    shadow="sm"
                    radius="md"
                  >
                    <Stack gap="xs">
                      <Text fw={700} size="md">
                        {exercise.exerciseName}
                      </Text>
                      <Stack gap={4}>
                        <Group justify="space-between">
                          <Text size="sm">Max Weight:</Text>
                          <Text size="sm" fw={600}>
                            {exercise.maxWeight}kg
                          </Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Max Reps:</Text>
                          <Text size="sm" fw={600}>
                            {exercise.maxReps}
                          </Text>
                        </Group>
                        <Group justify="space-between">
                          <Text size="sm">Times:</Text>
                          <Text size="sm" fw={600}>
                            {exercise.frequency}
                          </Text>
                        </Group>
                      </Stack>
                      <Text size="xs" c="dimmed">
                        PR: {exercise.maxWeightDate}
                      </Text>
                      <Group>
                        <Badge
                          color={trendColors[exercise.trend]}
                          variant="light"
                          leftSection={trendIcons[exercise.trend]}
                        >
                          {exercise.trend === 'improving'
                            ? 'Improving'
                            : exercise.trend === 'declining'
                              ? 'Declining'
                              : 'Stable'}
                        </Badge>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </div>

            <div>
              <Title order={3}>
                Exercise Volume Trends (top {Math.min(3, topExercises.length)})
              </Title>
              <Stack gap="md" style={{ marginTop: 12 }}>
                {topExercises.slice(0, 3).map((exercise: ExerciseMetrics) => (
                  <Card
                    key={exercise.exerciseName}
                    withBorder
                    shadow="sm"
                    radius="md"
                  >
                    <Stack gap="md">
                      <Text fw={700} size="md">
                        {exercise.exerciseName}
                      </Text>
                      <div style={{ height: 160 }}>
                        <TrainingProgressChart
                          data={exercise.volumeByDate.map((item) => ({
                            dateISO: item.date,
                            totalVolumeKg: item.volume,
                            totalReps: 0,
                            sessionsCount: 0,
                          }))}
                          variant="sparkline"
                          height={160}
                        />
                      </div>
                      <Text size="xs" c="dimmed">
                        Total volume: {exercise.totalVolume}kg
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </div>
          </Stack>
        )}
      </Stack>
    </Layout>
  );
};

export const Dashboard = connect({ controller }, (ctrl) => ({
  aggregates: ctrl.getAggregates(),
  exerciseMetrics: ctrl.getExerciseMetrics(),
}))(PureDashboard);
