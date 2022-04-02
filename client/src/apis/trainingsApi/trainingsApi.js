import { Validator } from 'jsonschema';

const validator = new Validator();

export const createTrainingsApi = (store) => {
  const getData = () => store.getStoreData(['trainings', 'newTraining']);

  return {
    createNew: () => {
      const data = {
        name: 'New Training',
        exercises: [],
      };

      const validationResult = validator.validate(data, newTrainingSchema);
      if (!validationResult.valid) {
        console.warn('Validation failed!', validationResult.errors);
        return;
      }

      store.newTraining = data;
    },
    updateNew: (input) => {
      const data = {
        ...getData().newTraining,
        ...input,
      };

      const validationResult = validator.validate(data, newTrainingSchema);
      if (!validationResult.valid) {
        console.warn('Validation failed!', validationResult.errors);
        return;
      }

      store.newTraining = data;
    },
    saveNew: () => {},
  };
};

const newTrainingSchema = {
  id: '/newTraining',
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    exercises: {
      type: 'array',
      items: {
        type: 'object',
        // properties: {
        //   id: {
        //     type: 'string',
        //   },
        // },
        // required: ['id'],
      },
    },
  },
  required: ['name', 'exercises'],
};
