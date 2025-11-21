const sr_completedTrainings = {
  id: '/CompletedTrainingsServerReadSchema',
  type: 'array',
  items: {
    $ref: '/CompletedTrainingServerReadSchema',
  },
};

const sr_completedTraining = {
  id: '/CompletedTrainingServerReadSchema',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    exercises: {
      type: 'array',
      items: {
        $ref: '/CompletedExerciseServerReadSchema',
      },
    },
    created_at: {
      type: 'string',
    },
    updated_at: {
      type: ['string', 'null'],
    },
    user_id: {
      type: 'string',
    },
  },
  required: ['id', 'name', 'exercises', 'created_at', 'user_id'],
};

const sr_completedExercise = {
  id: '/CompletedExerciseServerReadSchema',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    // e.g. "bicepsCurls", "barbellBenchPress"
    // or "custom" until this type is converted to a unique type
    type: {
      type: 'string',
    },
    workout_id: {
      type: 'string',
    },
    reps: {
      type: 'number',
    },
    weight: {
      type: 'number',
    },
    created_at: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    updated_at: {
      type: ['string', 'null'],
    },
    user_id: {
      type: 'string',
    },
  },
  required: ['id', 'type', 'name', 'workout_id', 'reps', 'weight', 'created_at', 'date', 'user_id'],
};

const sw_completedTrainings = {
  id: '/CompletedTrainingsServerWriteSchema',
  type: 'array',
  items: {
    $ref: '/CompletedTrainingServerWriteSchema',
  },
};

const sw_completedTraining = {
  id: '/CompletedTrainingServerWriteSchema',
  type: 'object',
  properties: {
    tempId: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    exercises: {
      type: 'array',
      items: {
        $ref: '/CompletedExerciseServerWriteSchema',
      },
    },
    date: {
      type: 'string',
    },
  },
  required: ['name', 'exercises', 'date'],
};

const sw_completedExercise = {
  id: '/CompletedExerciseServerWriteSchema',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    // e.g. "bicepsCurls", "barbellBenchPress"
    // or "custom" until this type is converted to a unique type
    type: {
      type: 'string',
    },
    reps: {
      type: 'number',
    },
    weight: {
      type: 'number',
    },
    date: {
      type: 'string',
    },
  },
  required: ['type', 'name', 'reps', 'weight', 'date'],
};

export const ServerReadSchemas = {
  completedTrainings: sr_completedTrainings,
  completedTraining: sr_completedTraining,
  completedExercise: sr_completedExercise,
};

export const ServerWriteSchemas = {
  completedTrainings: sw_completedTrainings,
  completedTraining: sw_completedTraining,
  completedExercise: sw_completedExercise,
};
