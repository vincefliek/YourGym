import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { TrainingAggregate } from '../../model/aggregation';

type Variant = 'sparkline' | 'detailed' | 'bar';

export interface TrainingProgressChartProps {
  data: TrainingAggregate[];
  variant?: Variant;
  height?: number | string;
}

export const TrainingProgressChart: React.FC<TrainingProgressChartProps> = ({
  data,
  variant = 'detailed',
  height = 140,
}) => {
  const source = data;

  const formatted = source.map((d) => ({
    date: d.dateISO.slice(5), // MM-DD for compact x axis
    volume: Math.round(d.totalVolumeKg),
    sessions: d.sessionsCount,
  }));

  if (variant === 'sparkline') {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{
            // bugfix: eliminate wrong console warning
            width: 10,
            height: 10,
          }}
        >
          <LineChart data={formatted}>
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer
          width="100%"
          height="100%"
          initialDimension={{
            // bugfix: eliminate wrong console warning
            width: 10,
            height: 10,
          }}
        >
          <BarChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="volume" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{
          // bugfix: eliminate wrong console warning
          width: 10,
          height: 10,
        }}
      >
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#8884d8"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="sessions"
            stroke="#82ca9d"
            strokeWidth={1}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
