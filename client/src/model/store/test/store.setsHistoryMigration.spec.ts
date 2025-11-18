import { v4 as uuidv4 } from 'uuid';

import { CompletedTrainingExcercise } from '../../types';
import { legacyDateTimeToTimestamptz, Store } from '../store';
import {
  CompletedTraining,
  Set,
  SetsByDate,
} from '../../types';

function makeSet(id: string, time: string): Set {
  return {
    id,
    weight: 50,
    repetitions: 10,
    time,
    done: true,
  };
}

function makeHistory(date: string, exerciseId: string, time: string): SetsByDate {
  return {
    id: exerciseId + '--history',
    date,
    sets: [makeSet('s1', time), makeSet('s2', time)],
  };
}

describe('Store: setsHistory migration', () => {
  let store: Store;
  let date: string;
  let time: string;
  let timestamptz: string;

  beforeEach(() => {
    window.crypto = {
      randomUUID: uuidv4,
    } as any;
    store = new Store();
    (store as any)._persistenceEnabled = false; // disable IDB writes

    date = 'Sat, 15/11/2025';
    time = '20:30';
    timestamptz = '2025-11-15T20:30:00.000+01:00';
  });

  test('legacyDateTimeToTimestamptz', () => {
    expect(legacyDateTimeToTimestamptz(date, time))
      .toBe(timestamptz);
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
    store.trainings = [
      {
        id: 't1',
        name: 'Training 1',
        exercises: [
          {
            id: 'e1',
            name: 'Bench',
            sets: [],
            setsHistory: [makeHistory(date, 'e1', time)],
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
    expect(completed.timestamptz).toBe(timestamptz);
    expect(completed.exercises.length).toBe(1);

    const ce = completed.exercises[0];
    expect(ce.name).toBe('Bench');
    expect(ce.sets.length).toBe(2);

    for (const s of ce.sets) {
      expect(s.timestamptz).toBe(timestamptz);
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
              makeHistory(date, 'e1', time),
              makeHistory(date, 'e1', time),
            ],
          },
        ],
      },
    ];

    store.migrateLegacyCompletedTrainingsForTests();

    expect(store.completedTrainings.length).toBe(1);

    const timestamps = store.completedTrainings
      .map((ct: CompletedTraining) => ct.timestamptz);
    expect(timestamps[0]).toBe(timestamptz);
    expect(timestamps[1]).toBe(undefined);
  });

  test('should merge multiple exercises belonging to the same date', () => {
    store.trainings = [
      {
        id: 't1',
        name: 'Training 1',
        exercises: [
          {
            id: 'e1',
            name: 'Bench',
            sets: [],
            setsHistory: [makeHistory(date, 'e1', time)],
          },
          {
            id: 'e2',
            name: 'Squat',
            sets: [],
            setsHistory: [makeHistory(date, 'e2', time)],
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

  test('should migrate real example', () => {
    store.trainings = [getRealExample() as any];

    store.completedTrainings = [];

    store.migrateLegacyCompletedTrainingsForTests();

    // Training should stay but be cleaned
    const updatedTraining = store.trainings[0];
    expect(updatedTraining.exercises[0].setsHistory.length).toBe(0);

    // One completed training should be created
    expect(store.completedTrainings.length).toBe(1);

    const completed = store.completedTrainings[0];
    expect(completed.name).toBe('Chest+Back');
    expect(completed.timestamptz).toBe(timestamptz);
    expect(completed.exercises.length).toBe(5);

    const ce = completed.exercises[0];
    expect(ce.name).toBe('Barbell Bench Press');
    expect(ce.sets.length).toBe(5);

    const s = ce.sets[0];
    expect(s.timestamptz).toBe(timestamptz);
    expect(s.weight).toBe(70);
    expect(s.repetitions).toBe(8);
  });
});

function getRealExample() {
  return {
    'id': 'dd2d64f7-151a-4cff-8dc2-6be990b6385c',
    'name': 'Chest+Back',
    'exercises': [
      {
        'id': '344e6334-3eb6-4220-907a-f95bb0d280d2',
        'name': 'Barbell Bench Press',
        'sets': [],
        'setsHistory': [
          {
            'id': '0a6032aa-2b31-40c9-b9e8-a4dbe4159f1b',
            'date': 'Sat, 15/11/2025',
            'sets': [
              {
                'id': '843fefa2-2439-4701-87a5-d7ea27292fde',
                'repetitions': 8,
                'weight': 70,
                'time': '20:30',
              },
              {
                'id': '308d8d33-a0ba-4efb-943f-cf618f69abfa',
                'repetitions': 5,
                'weight': 75,
                'time': '20:26',
              },
              {
                'id': 'fafab638-f7d8-42b1-9b49-0fefa8b89571',
                'repetitions': 8,
                'weight': 70,
                'time': '20:21',
              },
              {
                'id': 'ef89bed9-277d-4a15-95d5-d444481b70e3',
                'repetitions': 10,
                'weight': 60,
                'time': '20:19',
              },
              {
                'id': '27ac8c41-d3d6-4cf1-a77e-d24d91724306',
                'repetitions': 10,
                'weight': 50,
                'time': '20:15',
              },
            ],
          },
        ],
        'setsPreview': '',
      },
      {
        'id': '294d3be3-cb87-4f36-b472-14f56a1290c6',
        'name': 'Barbell Row (Lats)',
        'sets': [],
        'setsHistory': [
          {
            'id': 'fb25b903-5a90-41d7-bb90-8f380c0ab9a1',
            'date': 'Sat, 15/11/2025',
            'sets': [
              {
                'id': 'b275e160-7950-4d40-b918-02c5dda6e420',
                'repetitions': 10,
                'weight': 50,
                'time': '20:46',
              },
              {
                'id': '7b570d34-906a-43f0-9ef9-f7789ea1ab58',
                'repetitions': 11,
                'weight': 55,
                'time': '20:42',
              },
              {
                'id': 'af5a9bed-1a1b-444e-b732-af7af9351034',
                'repetitions': 10,
                'weight': 50,
                'time': '20:39',
              },
              {
                'id': 'daaf7a9b-2579-4769-91b6-18153eff0d32',
                'repetitions': 10,
                'weight': 40,
                'time': '20:37',
              },
            ],
          },
        ],
        'setsPreview': '',
      },
      {
        'id': '81a6e35b-8d11-4220-a797-1cb925e03a3e',
        'name': 'Chest Supported Machine Row (Traps)',
        'sets': [],
        'setsHistory': [
          {
            'id': 'a028449c-ef46-45a5-b08d-40fa82879619',
            'date': 'Sat, 15/11/2025',
            'sets': [
              {
                'id': 'ffeca947-a84b-4a08-af66-7d55e834f99d',
                'repetitions': 11,
                'weight': 30,
                'time': '20:57',
              },
              {
                'id': '996932a9-ede5-42f4-938f-1c6edc201f05',
                'repetitions': 10,
                'weight': 35,
                'time': '20:54',
              },
              {
                'id': 'f247d547-c263-4060-ae21-f31c7d23acb4',
                'repetitions': 14,
                'weight': 20,
                'time': '20:50',
              },
            ],
          },
        ],
        'setsPreview': '',
      },
      {
        'id': 'dd29ef5c-f9b7-4e8e-935a-bc453750ccf7',
        'name': 'Incline Machine Chest Press',
        'sets': [],
        'setsHistory': [
          {
            'id': '21564772-2076-4bbb-ab8b-620a356513f4',
            'date': 'Sat, 15/11/2025',
            'sets': [
              {
                'id': '58b6b496-cef6-418f-8432-16e49517c417',
                'repetitions': 10,
                'weight': 25,
                'time': '21:07',
              },
              {
                'id': 'eed884d4-e9cc-4727-a8ed-0bf7781bbc21',
                'repetitions': 10,
                'weight': 30,
                'time': '21:04',
              },
              {
                'id': 'a9258fb9-0b12-441d-b8d0-00f85b385478',
                'repetitions': 10,
                'weight': 20,
                'time': '21:01',
              },
            ],
          },
        ],
        'setsPreview': '',
      },
      {
        'id': 'bf1e09b5-a1f4-46fe-9c7e-83950b154b46',
        'name': 'Standing EZ Barbell Curls',
        'sets': [],
        'setsHistory': [
          {
            'id': '9e8faaab-a642-4aa6-954e-2d084d8b198c',
            'date': 'Sat, 15/11/2025',
            'sets': [
              {
                'id': 'ec373b12-991f-4ea0-9c13-147b948cb684',
                'repetitions': 9,
                'weight': 25,
                'time': '21:39',
              },
              {
                'id': '28c320da-e8a0-4b29-9f71-7eef3c917e15',
                'repetitions': 7,
                'weight': 30,
                'time': '21:17',
              },
              {
                'id': '0901d3ed-e892-41fc-8f5c-6c47fb4ad3db',
                'repetitions': 10,
                'weight': 30,
                'time': '21:14',
              },
            ],
          },
        ],
        'setsPreview': '',
      },
    ],
  };
}
