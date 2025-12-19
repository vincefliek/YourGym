import { CompletedTraining } from './types';

export interface TrainingAggregate {
  dateISO: string; // YYYY-MM-DD
  totalVolumeKg: number;
  totalReps: number;
  sessionsCount: number;
}

function toDateKey(timestamptz: string): string {
  // convert to local date key YYYY-MM-DD
  const d = new Date(timestamptz);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const aggregateByDay = (completed: CompletedTraining[]): TrainingAggregate[] => {
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
  return Array.from(map.values()).sort((a, b) => (a.dateISO < b.dateISO ? -1 : 1));
};

export const lastNDays = (aggregates: TrainingAggregate[], n = 7): TrainingAggregate[] => {
  if (n <= 0) return [];

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (n - 1));

  const startKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
  const endKey = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

  // Build map for quick lookup
  const aggMap = new Map(aggregates.map(a => [a.dateISO, a]));

  const result: TrainingAggregate[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
    const v = aggMap.get(key);
    if (v) {
      result.push(v);
    } else {
      result.push({ dateISO: key, totalVolumeKg: 0, totalReps: 0, sessionsCount: 0 });
    }
    cur.setDate(cur.getDate() + 1);
  }

  return result;
};
