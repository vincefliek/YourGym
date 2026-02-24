import { CompletedTraining } from './types';

export interface TrainingAggregate {
  dateISO: string; // YYYY-MM-DD
  totalVolumeKg: number;
  totalReps: number;
  sessionsCount: number;
}

export interface ExerciseMetrics {
  exerciseName: string;
  maxWeight: number;
  maxWeightDate: string; // ISO date (YYYY-MM-DD)
  maxReps: number;
  totalVolume: number; // Sum of weight × reps
  frequency: number; // Times performed in period
  volumeByDate: Array<{
    date: string; // YYYY-MM-DD
    volume: number;
  }>;
  lastPerformed: string; // ISO date
  trend: 'improving' | 'stable' | 'declining';
  // Consistency metrics
  currentStreak: number; // Consecutive weeks performed
  volumeImprovement: { percent: number; vs: string }; // % change vs before period
}

function toDateKey(timestamptz: string): string {
  // Use UTC-normalized YYYY-MM-DD to avoid local TZ shifting the day.
  const d = new Date(timestamptz);
  if (Number.isNaN(d.getTime())) {
    // fallback: try to slice ISO-like string
    return timestamptz.slice(0, 10);
  }
  return d.toISOString().slice(0, 10);
}

export const aggregateByDay = (
  completed: CompletedTraining[],
): TrainingAggregate[] => {
  const map = new Map<string, TrainingAggregate>();

  completed.forEach((ct) => {
    const key = toDateKey(ct.timestamptz);

    if (!map.has(key)) {
      map.set(key, {
        dateISO: key,
        totalVolumeKg: 0,
        totalReps: 0,
        sessionsCount: 0,
      });
    }

    const agg = map.get(key)!;
    agg.sessionsCount += 1;

    ct.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        const weight = typeof s.weight === 'number' ? s.weight : 0;
        const reps = typeof s.repetitions === 'number' ? s.repetitions : 0;
        agg.totalVolumeKg += weight * reps;
        agg.totalReps += reps;
      });
    });
  });

  // return sorted by date ascending
  return Array.from(map.values()).sort((a, b) =>
    a.dateISO < b.dateISO ? -1 : 1,
  );
};

export const lastNDays = (
  aggregates: TrainingAggregate[],
  n = 7,
): TrainingAggregate[] => {
  if (n <= 0) return [];

  // Build map for quick lookup (keys expected as YYYY-MM-DD UTC)
  const aggMap = new Map(aggregates.map((a) => [a.dateISO, a]));

  const MS_DAY = 24 * 60 * 60 * 1000;
  const result: TrainingAggregate[] = [];

  // iterate from (n-1) days ago up to today, using UTC-normalized keys
  for (let i = 0; i < n; i += 1) {
    const offset = n - 1 - i; // days before today
    const d = new Date(Date.now() - offset * MS_DAY);
    const key = d.toISOString().slice(0, 10);
    const v = aggMap.get(key);
    if (v) {
      result.push(v);
    } else {
      result.push({
        dateISO: key,
        totalVolumeKg: 0,
        totalReps: 0,
        sessionsCount: 0,
      });
    }
  }

  return result;
};

function calculateStreak(
  volumeByDate: Array<{ date: string; volume: number }>,
): number {
  if (volumeByDate.length === 0) return 0;

  const sortedDates = volumeByDate
    .map((v) => v.date)
    .sort()
    .reverse(); // Most recent first

  const MS_DAY = 24 * 60 * 60 * 1000;
  let streak = 0;
  let currentDate = new Date(sortedDates[0]);

  for (const dateStr of sortedDates) {
    const checkDate = new Date(dateStr);
    const daysDiff = Math.floor(
      (currentDate.getTime() - checkDate.getTime()) / MS_DAY,
    );

    // If dates are within streak tolerance (up to 7 days apart = within same week or 1 week gap)
    if (daysDiff <= 7) {
      const week = Math.floor(daysDiff / 7);
      if (week === 0 || week === 1) {
        streak = week + 1;
        currentDate = checkDate;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

function calculateVolumeImprovement(
  volumeByDate: Array<{ date: string; volume: number }>,
  days: number,
): { percent: number; vs: string } {
  if (volumeByDate.length < 2) return { percent: 0, vs: 'N/A' };

  const sortedDates = volumeByDate.sort((a, b) => (a.date < b.date ? -1 : 1));
  const midpoint = Math.floor(sortedDates.length / 2);

  const firstHalf = sortedDates.slice(0, midpoint);
  const secondHalf = sortedDates.slice(midpoint);

  const avgFirst =
    firstHalf.reduce((sum, v) => sum + v.volume, 0) / firstHalf.length;
  const avgSecond =
    secondHalf.reduce((sum, v) => sum + v.volume, 0) / secondHalf.length;

  const percent = Math.round(((avgSecond - avgFirst) / avgFirst) * 100);
  const vsLabel = `${days} days ago`;

  return { percent, vs: vsLabel };
}

export const aggregateByExercise = (
  completed: CompletedTraining[],
  days = 30,
): ExerciseMetrics[] => {
  const exerciseMap = new Map<
    string,
    {
      maxWeight: number;
      maxWeightDate: string;
      maxReps: number;
      totalVolume: number;
      frequency: number;
      volumeByDate: Map<string, number>;
      lastPerformed: string;
    }
  >();

  const MS_DAY = 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - days * MS_DAY);

  completed.forEach((ct) => {
    const trainDate = toDateKey(ct.timestamptz);
    const trainDateTime = new Date(ct.timestamptz);

    // Skip if outside the date range
    if (trainDateTime < cutoffDate) {
      return;
    }

    ct.exercises.forEach((ex) => {
      const name = ex.name;

      if (!exerciseMap.has(name)) {
        exerciseMap.set(name, {
          maxWeight: 0,
          maxWeightDate: trainDate,
          maxReps: 0,
          totalVolume: 0,
          frequency: 0,
          volumeByDate: new Map(),
          lastPerformed: trainDate,
        });
      }

      const metrics = exerciseMap.get(name)!;
      metrics.frequency += 1;
      metrics.lastPerformed = trainDate;

      let dayVolume = metrics.volumeByDate.get(trainDate) || 0;

      ex.sets.forEach((set) => {
        const weight = typeof set.weight === 'number' ? set.weight : 0;
        const reps = typeof set.repetitions === 'number' ? set.repetitions : 0;
        const volume = weight * reps;

        metrics.totalVolume += volume;
        dayVolume += volume;

        if (weight > metrics.maxWeight) {
          metrics.maxWeight = weight;
          metrics.maxWeightDate = trainDate;
        }

        if (reps > metrics.maxReps) {
          metrics.maxReps = reps;
        }
      });

      metrics.volumeByDate.set(trainDate, dayVolume);
    });
  });

  // Convert to ExerciseMetrics array with trend calculation
  const result: ExerciseMetrics[] = Array.from(exerciseMap.entries()).map(
    ([name, data]) => {
      // Calculate trend: compare first 10 days vs last 10 days
      const volumeDates = Array.from(data.volumeByDate.entries()).sort(
        (a, b) => (a[0] < b[0] ? -1 : 1),
      );

      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (volumeDates.length >= 2) {
        const splitPoint = Math.ceil(volumeDates.length / 2);
        const firstHalf = volumeDates.slice(0, splitPoint);
        const secondHalf = volumeDates.slice(splitPoint);

        const avgFirst =
          firstHalf.reduce((sum, [, vol]) => sum + vol, 0) / firstHalf.length;
        const avgSecond =
          secondHalf.reduce((sum, [, vol]) => sum + vol, 0) / secondHalf.length;

        const change = ((avgSecond - avgFirst) / avgFirst) * 100;
        if (change > 5) {
          trend = 'improving';
        } else if (change < -5) {
          trend = 'declining';
        }
      }

      const volumeDatesArray = Array.from(data.volumeByDate.entries())
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([date, volume]) => ({
          date,
          volume: Math.round(volume),
        }));

      return {
        exerciseName: name,
        maxWeight: data.maxWeight,
        maxWeightDate: data.maxWeightDate,
        maxReps: data.maxReps,
        totalVolume: Math.round(data.totalVolume),
        frequency: data.frequency,
        volumeByDate: volumeDatesArray,
        lastPerformed: data.lastPerformed,
        trend,
        currentStreak: calculateStreak(volumeDatesArray),
        volumeImprovement: calculateVolumeImprovement(volumeDatesArray, days),
      };
    },
  );

  // Sort by frequency (descending) so most-done exercises appear first
  return result.sort((a, b) => b.frequency - a.frequency);
};
