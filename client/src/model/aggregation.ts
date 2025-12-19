import { CompletedTraining } from './types';

export interface TrainingAggregate {
  dateISO: string; // YYYY-MM-DD
  totalVolumeKg: number;
  totalReps: number;
  sessionsCount: number;
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
