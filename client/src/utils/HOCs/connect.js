import React from 'react';

import { AppContext } from '../context';

export const connect = (params, mapToProps) => {
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

  return Wrapped => {
    class ConnectedView extends React.Component {
      static contextType = AppContext;

      constructor(props, context) {
        super(props);

        const store = context.serviceLocator.getStore();

        if (params.controller.storeDataAccessors.length) {
          this.unsubscribe = store.subscribe(
            this._update,
            params.controller.storeDataAccessors,
          );
        }
      }

      componentWillUnmount = () => {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      };

      _update = () => {
        this.forceUpdate();
      };

      render() {
        let stateToProps;

        if (typeof mapToProps === 'function') {
          const bindedController = params.controller(
            this.context.serviceLocator,
            this.props,
          );
          stateToProps = mapToProps(bindedController);
        }

        return (
          <Wrapped
            {...this.props}
            {...stateToProps}
          />
        );
      }
    }

    return ConnectedView;
  };
};
