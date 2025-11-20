export const completedTrainingsServerSchema = {
  id: '/CompletedTrainingsServerSchema',
  type: 'array',
  items: {
    $ref: '/CompletedTrainingServerSchema',
  },
};

export const completedTrainingServerSchema = {
  id: '/CompletedTrainingServerSchema',
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
        $ref: '/CompletedExerciseServerSchema',
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

export const completedExerciseServerSchema = {
  id: '/CompletedExerciseServerSchema',
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
