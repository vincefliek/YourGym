import React from 'react';

import { ServiceLocatorContext } from './context';

export const connect = (params, mapToProps) => {
  if (typeof params !== 'object') {
    throw new Error('First argument in `connect` function is mandatory');
  }

  if (typeof params.controller !== 'function') {
    throw new Error('`controller` property in 1st argument in `connect` function is mandatory');
  }

  return Wrapped => {
    class ConnectedView extends React.Component {
      static contextType = ServiceLocatorContext;

      constructor(props, context) {
        super(props);

        const store = context.serviceLocator.getStore();

        this.unsubscribe = store.subscribe(this.update);
      }

      componentWillUnmount = () => {
        this.unsubscribe();
      }

      update = () => {
        this.forceUpdate();
      }

      render() {
        let stateToProps;

        if (typeof mapToProps === 'function') {
          const bindedController = params.controller(this.context.serviceLocator, this.props);
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
  }
}
