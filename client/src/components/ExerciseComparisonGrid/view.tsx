import React from 'react';
import { Table, Badge, Text } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconArrowRight } from '../icons';
import type { ExerciseMetrics } from '../../model/aggregation';

interface ExerciseComparisonGridProps {
  exercises: ExerciseMetrics[];
}

const trendColors = {
  improving: 'green',
  stable: 'gray',
  declining: 'red',
};

const trendIcons = {
  improving: <IconTrendingUp size={14} />,
  stable: <IconArrowRight size={14} />,
  declining: <IconTrendingDown size={14} />,
};

const trendLabels = {
  improving: 'Improving',
  stable: 'Stable',
  declining: 'Declining',
};

export const ExerciseComparisonGrid: React.FC<ExerciseComparisonGridProps> = ({
  exercises,
}) => {
  if (exercises.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        No exercises yet
      </Text>
    );
  }

  // Sort by max weight descending
  const sorted = [...exercises].sort((a, b) => b.maxWeight - a.maxWeight);

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Rank</Table.Th>
            <Table.Th>Exercise</Table.Th>
            <Table.Th align="right">Max Weight</Table.Th>
            <Table.Th align="right">Max Reps</Table.Th>
            <Table.Th align="right">Frequency</Table.Th>
            <Table.Th align="center">Streak</Table.Th>
            <Table.Th align="center">Volume Change</Table.Th>
            <Table.Th align="center">Trend</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sorted.map((exercise, index) => (
            <Table.Tr key={exercise.exerciseName}>
              <Table.Td>
                <Text fw={700} size="sm">
                  #{index + 1}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={600}>
                  {exercise.exerciseName}
                </Text>
              </Table.Td>
              <Table.Td align="right">
                <Text size="sm" fw={600}>
                  {exercise.maxWeight}kg
                </Text>
              </Table.Td>
              <Table.Td align="right">
                <Text size="sm">{exercise.maxReps}</Text>
              </Table.Td>
              <Table.Td align="right">
                <Badge variant="light" size="lg">
                  {exercise.frequency}x
                </Badge>
              </Table.Td>
              <Table.Td align="center">
                {exercise.currentStreak > 0 ? (
                  <Badge color="blue" variant="light">
                    {exercise.currentStreak}w
                  </Badge>
                ) : (
                  <Text size="sm" c="dimmed">
                    —
                  </Text>
                )}
              </Table.Td>
              <Table.Td align="center">
                <Badge
                  color={
                    exercise.volumeImprovement.percent > 0
                      ? 'green'
                      : exercise.volumeImprovement.percent < 0
                        ? 'red'
                        : 'gray'
                  }
                  variant="light"
                >
                  {exercise.volumeImprovement.percent > 0 ? '+' : ''}
                  {exercise.volumeImprovement.percent}%
                </Badge>
              </Table.Td>
              <Table.Td align="center">
                <Badge
                  color={trendColors[exercise.trend]}
                  variant="light"
                  leftSection={trendIcons[exercise.trend]}
                >
                  {trendLabels[exercise.trend]}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};
