import React, { useState, useMemo } from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import { aggregateByExercise } from '../../model/aggregation';
import type { ExerciseMetrics } from '../../model/aggregation';
import type { CompletedTraining } from '../../model/types';
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
  ExerciseComparisonGrid,
} from '../../components';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconArrowRight,
} from '../../components/icons';

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

const PureDashboard: React.FC<{
  aggregates: any[];
  completedTrainings: CompletedTraining[];
}> = ({ aggregates, completedTrainings }) => {
  const [timeRange, setTimeRange] = useState<number>(30);

  // Memoize exercise metrics calculation to avoid recalculating on every render
  const exerciseMetrics = useMemo(
    () => aggregateByExercise(completedTrainings, timeRange),
    [completedTrainings, timeRange],
  );

  const topExercises = exerciseMetrics.slice(0, 5);

  return (
    <Layout bottomBar={<Navbar />} dataTestId="dashboard-screen">
      <Stack style={{ padding: 12 }} gap="lg">
        <Title order={2}>Progress dashboard</Title>

        {/* Time Range Selector */}
        <Card withBorder shadow="sm" radius="md" style={{ marginBottom: 8 }}>
          <Group>
            <Text fw={500} size="sm">
              Time Range:
            </Text>
            <Group gap="xs">
              {[7, 14, 30, 60, 90].map((days) => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 4,
                    border:
                      timeRange === days
                        ? '2px solid #228be6'
                        : '1px solid #dee2e6',
                    backgroundColor: timeRange === days ? '#e7f5ff' : '#fff',
                    color: timeRange === days ? '#228be6' : '#495057',
                    fontWeight: timeRange === days ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {days}d
                </button>
              ))}
            </Group>
          </Group>
        </Card>

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
              <Title order={3}>Personal Records (last {timeRange} days)</Title>
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

            {/* Phase 3: Strength Curve Visualization */}
            <div>
              <Title order={3}>
                Strength Curve (Estimated 4RM Progression)
              </Title>
              <Stack gap="md" style={{ marginTop: 12 }}>
                {topExercises.slice(0, 3).map((exercise: ExerciseMetrics) => {
                  const hasData =
                    exercise.maxWeightProgression &&
                    exercise.maxWeightProgression.length > 0;
                  return (
                    <Card
                      key={`strength-${exercise.exerciseName}`}
                      withBorder
                      shadow="sm"
                      radius="md"
                    >
                      <Stack gap="md">
                        <Text fw={700} size="md">
                          {exercise.exerciseName}
                        </Text>
                        {hasData ? (
                          <div style={{ height: 200 }}>
                            <TrainingProgressChart
                              data={exercise.maxWeightProgression.map(
                                (item) => ({
                                  dateISO: item.date,
                                  totalVolumeKg: item.weight,
                                  totalReps: 0,
                                  sessionsCount: 0,
                                }),
                              )}
                              variant="detailed"
                              height={200}
                            />
                          </div>
                        ) : (
                          <Text size="sm" c="dimmed">
                            Not enough data for strength curve
                          </Text>
                        )}
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">
                            Data points:{' '}
                            {exercise.maxWeightProgression?.length || 0}
                          </Text>
                          <Text size="xs" c="dimmed">
                            Estimated 4RM: {exercise.maxWeight.toFixed(1)}kg
                          </Text>
                        </Group>
                      </Stack>
                    </Card>
                  );
                })}
              </Stack>
            </div>

            {/* Phase 3: Weight Progression Prediction */}
            <div>
              <Title order={3}>4RM Forecast (30-day prediction)</Title>
              <Stack gap="md" style={{ marginTop: 12 }}>
                {topExercises.slice(0, 3).map((exercise: ExerciseMetrics) => {
                  const hasData =
                    exercise.weightPrediction &&
                    exercise.weightPrediction.weights.length > 0;
                  const combinedData = hasData
                    ? [
                        ...exercise.maxWeightProgression,
                        ...exercise.weightPrediction.weights,
                      ]
                    : [];

                  return (
                    <Card
                      key={`prediction-${exercise.exerciseName}`}
                      withBorder
                      shadow="sm"
                      radius="md"
                    >
                      <Stack gap="md">
                        <Group justify="space-between">
                          <Text fw={700} size="md">
                            {exercise.exerciseName}
                          </Text>
                          {hasData &&
                            exercise.weightPrediction.weights.length > 0 && (
                              <Badge color="blue" variant="light">
                                Forecast:{' '}
                                {exercise.weightPrediction.weights[
                                  exercise.weightPrediction.weights.length - 1
                                ]?.weight.toFixed(1)}
                                kg
                              </Badge>
                            )}
                        </Group>
                        {hasData && combinedData.length > 0 ? (
                          <div style={{ height: 200 }}>
                            <TrainingProgressChart
                              data={combinedData
                                .map((item) => ({
                                  dateISO: item.date,
                                  totalVolumeKg: item.weight,
                                  totalReps: 0,
                                  sessionsCount: 0,
                                }))
                                .slice(-10)}
                              variant="detailed"
                              height={200}
                            />
                          </div>
                        ) : (
                          <Text size="sm" c="dimmed">
                            Not enough data for prediction
                          </Text>
                        )}
                        <Text size="xs" c="dimmed">
                          Linear regression prediction on estimated 4RM (Epley
                          formula)
                        </Text>
                      </Stack>
                    </Card>
                  );
                })}
              </Stack>
            </div>
          </Stack>
        )}

        {exerciseMetrics.length > 0 && (
          <Stack gap="lg">
            <div>
              <Title order={3}>Exercise Strength Ranking</Title>
              <Card
                withBorder
                shadow="sm"
                radius="md"
                style={{ marginTop: 12 }}
              >
                <ExerciseComparisonGrid exercises={exerciseMetrics} />
              </Card>
            </div>

            <div>
              <Title order={3}>Consistency & Improvement</Title>
              <SimpleGrid
                cols={{ base: 1, sm: 2 }}
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
                    <Stack gap="sm">
                      <Text fw={700} size="md">
                        {exercise.exerciseName}
                      </Text>
                      <Group justify="space-between">
                        <Group>
                          <Text size="sm">Weekly Streak:</Text>
                          <Badge
                            color={exercise.currentStreak > 0 ? 'blue' : 'gray'}
                          >
                            {exercise.currentStreak > 0
                              ? `${exercise.currentStreak}w`
                              : 'None'}
                          </Badge>
                        </Group>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Last attempt:</Text>
                        <Text size="sm" fw={600}>
                          {exercise.lastPerformed}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Volume trend:</Text>
                        <Badge
                          color={
                            exercise.volumeImprovement.percent > 0
                              ? 'green'
                              : exercise.volumeImprovement.percent < 0
                                ? 'red'
                                : 'gray'
                          }
                        >
                          {exercise.volumeImprovement.percent > 0 ? '+' : ''}
                          {exercise.volumeImprovement.percent}% vs{' '}
                          {exercise.volumeImprovement.vs}
                        </Badge>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            </div>
          </Stack>
        )}
      </Stack>
    </Layout>
  );
};

export const Dashboard = connect({ controller }, (ctrl) => ({
  aggregates: ctrl.getAggregates(),
  completedTrainings: ctrl.getCompletedTrainings(),
}))(PureDashboard);
