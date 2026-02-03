import React from 'react';

import { AppContext } from '../context';
import { ConnectParams, MapToProps } from './types';

export const connect = <
  ControllerReturnType extends object,
  StateProps extends object,
  OwnProps extends object = {},
>(
  params: ConnectParams<ControllerReturnType>,
  mapToProps: MapToProps<ControllerReturnType, StateProps>,
) => {
  if (typeof params !== 'object') {
    throw new Error('First argument in `connect` function is mandatory');
  }

  if (typeof params.controller !== 'function') {
    throw new Error(
      '`params.controller` property in `connect` function is mandatory',
    );
  }

  if (!Array.isArray(params.controller.storeDataAccessors)) {
    throw new Error(
      `Controller doesn't have mandatory static property 'storeDataAccessors'`,
    );
  }

  type WrappedProps = Omit<StateProps, keyof ReturnType<typeof mapToProps>> &
    OwnProps;

  return (Wrapped: React.ComponentType<StateProps & OwnProps>) => {
    class ConnectedView extends React.Component<WrappedProps> {
      static contextType = AppContext;
      private unsubscribe?: () => void;
      private controller: ControllerReturnType;
      private stateToProps: ReturnType<typeof mapToProps>;

      constructor(
        props: WrappedProps,
        context: React.ContextType<typeof AppContext>,
      ) {
        super(props);
        this.controller = params.controller(context.serviceLocator);
        this.stateToProps = mapToProps(this.controller);

        const store = context.serviceLocator.getStore();

        if (params.controller.storeDataAccessors.length) {
          this.unsubscribe = store.subscribe(
            this._update,
            params.controller.storeDataAccessors,
          );
        }
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }

      _update = () => {
        this.stateToProps = mapToProps(this.controller);
        this.forceUpdate();
      };

      render() {
        return (
          <Wrapped
            {...(this.props as StateProps & OwnProps)}
            {...this.stateToProps}
          />
        );
      }
    }

    return ConnectedView;
  };
};
