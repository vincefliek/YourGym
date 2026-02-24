import React from 'react';

import { connect } from '../../utils';
import { controller } from './controller';
import { Layout, Navbar, TrainingProgressChart } from '../../components';
import { ExerciseMetrics } from '../../model/aggregation';

const PureDashboard: React.FC<any> = ({ aggregates, exerciseMetrics }) => {
  // Get top 5 exercises by frequency for display
  const topExercises = exerciseMetrics.slice(0, 5);

  return (
    <Layout bottomBar={<Navbar />} dataTestId="dashboard-screen">
      <div style={{ padding: 12 }}>
        <h2>Progress dashboard</h2>
        <section style={{ marginTop: 12 }}>
          <h3>Volume trend (last 30 days)</h3>
          <div style={{ height: 240 }}>
            <TrainingProgressChart
              data={aggregates.slice(-30)}
              variant="detailed"
              height={240}
            />
          </div>
        </section>
        <section style={{ marginTop: 12 }}>
          <h3>Sessions (last 30 days)</h3>
          <div style={{ height: 160 }}>
            <TrainingProgressChart
              data={aggregates.slice(-30)}
              variant="bar"
              height={160}
            />
          </div>
        </section>

        {exerciseMetrics.length > 0 && (
          <>
            <section style={{ marginTop: 24 }}>
              <h3>Personal Records (last 30 days)</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 12,
                  marginTop: 12,
                }}
              >
                {exerciseMetrics.map((exercise: ExerciseMetrics) => (
                  <div
                    key={exercise.exerciseName}
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      padding: 12,
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                      {exercise.exerciseName}
                    </div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>
                      <strong>Max Weight:</strong> {exercise.maxWeight}kg
                    </div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>
                      <strong>Max Reps:</strong> {exercise.maxReps}
                    </div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>
                      <strong>Times:</strong> {exercise.frequency}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#666',
                        marginTop: 8,
                      }}
                    >
                      PR: {exercise.maxWeightDate}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: 8,
                        fontSize: 12,
                      }}
                    >
                      <span
                        style={{
                          marginRight: 6,
                          fontSize: 16,
                        }}
                      >
                        {exercise.trend === 'improving'
                          ? '📈'
                          : exercise.trend === 'declining'
                            ? '📉'
                            : '➡️'}
                      </span>
                      <span>
                        {exercise.trend === 'improving'
                          ? 'Improving'
                          : exercise.trend === 'declining'
                            ? 'Declining'
                            : 'Stable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ marginTop: 24 }}>
              <h3>
                Exercise Volume Trends (top {Math.min(3, topExercises.length)})
              </h3>
              <div style={{ marginTop: 12 }}>
                {topExercises.slice(0, 3).map((exercise: ExerciseMetrics) => (
                  <div
                    key={exercise.exerciseName}
                    style={{
                      marginBottom: 24,
                      border: '1px solid #e0e0e0',
                      borderRadius: 8,
                      padding: 12,
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                      {exercise.exerciseName}
                    </div>
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
                    <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                      Total volume: {exercise.totalVolume}kg
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export const Dashboard = connect({ controller }, (ctrl) => ({
  aggregates: ctrl.getAggregates(),
  exerciseMetrics: ctrl.getExerciseMetrics(),
}))(PureDashboard);
