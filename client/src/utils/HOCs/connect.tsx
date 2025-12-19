import React from 'react';

import { AppContext } from '../context';
import { ConnectParams, MapToProps } from './types';

export const connect = <T extends object, P extends object>(
  params: ConnectParams<T>,
  mapToProps: MapToProps<T, P>,
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

  type WrappedProps = Omit<P, keyof ReturnType<typeof mapToProps>>;

  return (Wrapped: React.ComponentType<P>) => {
    class ConnectedView extends React.Component<WrappedProps> {
      static contextType = AppContext;
      private unsubscribe?: () => void;
      private controller: T;
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
        return <Wrapped {...(this.props as P)} {...this.stateToProps} />;
      }
    }

    return ConnectedView;
  };
};
