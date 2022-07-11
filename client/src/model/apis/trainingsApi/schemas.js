export const allTrainingsSchema = {
  id: '/AllTrainingsSchema',
  type: 'array',
  items: {
    $ref: '/TrainingSchema',
  },
};

export const trainingSchema = {
  id: '/TrainingSchema',
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
        $ref: '/ExerciseSchema',
      },
    },
  },
  required: ['id', 'name', 'exercises'],
};

export const exerciseSchema = {
  id: '/ExerciseSchema',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    sets: {
      type: 'array',
      items: {
        $ref: '/SetSchema',
      },
    },
    setsHistory: {
      type: 'array',
    },
  },
  required: ['id', 'name', 'sets', 'setsHistory'],
};

export const setSchema = {
  id: '/SetSchema',
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    repetitions: {
      type: 'number',
    },
    weight: {
      type: 'number',
    },
  },
  required: ['id', 'repetitions', 'weight'],
};
