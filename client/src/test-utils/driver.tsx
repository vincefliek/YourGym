import {
  createConsecutiveTemplateTraining,
  createFirstTemplateTraining,
  CreateFirstTemplateTrainingConfig,
} from './createTemplateTraining';
import { renderApp, RenderAppResult } from './renderApp';
import {
  waitForByTestId,
  waitForByText,
  waitForAllByTestId,
} from './waitHelpers';

export interface TestDriver {
  render: {
    app: () => Promise<RenderAppResult>;
  };
  create: {
    firstTemplateTraining: (
      config?: CreateFirstTemplateTrainingConfig,
    ) => Promise<void>;
    consecutiveTemplateTraining: () => Promise<void>;
  };
  waitFor: {
    byTestId: typeof waitForByTestId;
    allByTestId: typeof waitForAllByTestId;
    byText: typeof waitForByText;
  };
}

export const createDriver = (): TestDriver => {
  return {
    render: {
      app: renderApp,
    },
    create: {
      firstTemplateTraining: createFirstTemplateTraining,
      consecutiveTemplateTraining: createConsecutiveTemplateTraining,
    },
    waitFor: {
      byTestId: waitForByTestId,
      allByTestId: waitForAllByTestId,
      byText: waitForByText,
    },
  };
};
