import { v4 as uuidv4 } from 'uuid';

import { CompletedTrainingExcercise } from '../../types';
import { Store } from '../store';
import {
  CompletedTraining,
  Set,
  SetsByDate,
} from '../../types';

function makeSet(id: string): Set {
  return {
    id,
    weight: 50,
    repetitions: 10,
    done: true,
  };
}

function makeHistory(date: string, exerciseId: string): SetsByDate {
  return {
    id: exerciseId + '--history',
    date,
    sets: [makeSet('s1'), makeSet('s2')],
  };
}

describe('Store: setsHistory migration', () => {
  let store: Store;

  beforeEach(() => {
    window.crypto = {
      randomUUID: uuidv4,
    } as any;
    store = new Store();
    (store as any)._persistenceEnabled = false; // disable IDB writes
  });

  test('should do nothing when no legacy setsHistory exists', () => {
    store.trainings = [
      {
        id: 't1',
        name: 'Training 1',
        exercises: [
          { id: 'e1', name: 'ex1', sets: [], setsHistory: [] },
        ],
      },
    ];

    store.migrateLegacyCompletedTrainingsForTests();

    expect(store.trainings[0].exercises[0].setsHistory).toEqual([]);
    expect(store.completedTrainings.length).toBe(0);
  });

  test('should migrate one training with one exercise and one history entry', () => {
    const date = '2025-01-01T10:00:00+02:00';

    store.trainings = [
      {
        id: 't1',
        name: 'Training 1',
        exercises: [
          {
            id: 'e1',
            name: 'Bench',
            sets: [],
            setsHistory: [makeHistory(date, 'e1')],
          },
        ],
      },
    ];

    store.completedTrainings = [];

    store.migrateLegacyCompletedTrainingsForTests();

    // Training should stay but be cleaned
    const updatedTraining = store.trainings[0];
    expect(updatedTraining.exercises[0].setsHistory.length).toBe(0);

    // One completed training should be created
    expect(store.completedTrainings.length).toBe(1);

    const completed = store.completedTrainings[0];
    expect(completed.name).toBe('Training 1');
    expect(completed.timestamptz).toBe(date);
    expect(completed.exercises.length).toBe(1);

    const ce = completed.exercises[0];
    expect(ce.name).toBe('Bench');
    expect(ce.sets.length).toBe(2);

    for (const s of ce.sets) {
      expect(s.timestamptz).toBe(date);
      expect(s.weight).toBe(50);
      expect(s.repetitions).toBe(10);
    }
  });

  test('should group setsHistory by date into multiple completed trainings', () => {
    store.trainings = [
      {
        id: 't1',
        name: 'Training 1',
        exercises: [
          {
            id: 'e1',
            name: 'Bench',
            sets: [],
            setsHistory: [
              makeHistory('2025-01-01T10:00:00+02:00', 'e1'),
              makeHistory('2025-01-02T10:00:00+02:00', 'e1'),
            ],
          },
        ],
      },
    ];

    store.migrateLegacyCompletedTrainingsForTests();

    // Should create 2 sessions
    expect(store.completedTrainings.length).toBe(2);

    const timestamps = store.completedTrainings.map((ct: CompletedTraining) => ct.timestamptz);
    expect(timestamps).toContain('2025-01-01T10:00:00+02:00');
    expect(timestamps).toContain('2025-01-02T10:00:00+02:00');
  });

  test('should merge multiple exercises belonging to the same date', () => {
    const date = '2025-01-01T09:00:00+02:00';

    store.trainings = [
      {
        id: 't1',
        name: 'Training 1',
        exercises: [
          {
            id: 'e1',
            name: 'Bench',
            sets: [],
            setsHistory: [makeHistory(date, 'e1')],
          },
          {
            id: 'e2',
            name: 'Squat',
            sets: [],
            setsHistory: [makeHistory(date, 'e2')],
          },
        ],
      },
    ];

    store.migrateLegacyCompletedTrainingsForTests();

    expect(store.completedTrainings.length).toBe(1);

    const completed = store.completedTrainings[0];
    expect(completed.exercises.length).toBe(2);

    const exNames = completed.exercises.map((e: CompletedTrainingExcercise) => e.name);
    expect(exNames).toContain('Bench');
    expect(exNames).toContain('Squat');
  });
});
