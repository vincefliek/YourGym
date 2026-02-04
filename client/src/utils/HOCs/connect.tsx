import React, { useContext, useEffect, useMemo, useState } from 'react';

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
    const ConnectedView: React.FC<WrappedProps> = (props) => {
      const context = useContext(AppContext);
      const controller = useMemo(
        () => params.controller(context.serviceLocator),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
      );
      const [stateToProps, setStateToProps] = useState(() =>
        mapToProps(controller),
      );

      useEffect(() => {
        const store = context.serviceLocator.getStore();

        if (params.controller.storeDataAccessors.length) {
          const _update = () => {
            setStateToProps(mapToProps(controller));
          };
          const unsubscribe = store.subscribe(
            _update,
            params.controller.storeDataAccessors,
          );
          return () => {
            unsubscribe();
          };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        <Wrapped {...(props as StateProps & OwnProps)} {...stateToProps} />
      );
    };

    return ConnectedView;
  };
};
