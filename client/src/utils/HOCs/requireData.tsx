import React, { ComponentType } from 'react';
import { RequireDataConfig } from './types';

// type RequiredDataHOC = <P extends object>(config: (props: P) => RequireDataConfig) =>
//   (Component: ComponentType<P>) => ComponentType<P>;

export const requireData = <P extends object>(
  getInfo: (props: P) => RequireDataConfig,
) => {
  if (typeof getInfo !== 'function') {
    throw new Error(
      '`getInfo` argument in `requireData` function is mandatory',
    );
  }

  const info = getInfo({} as any);
  const infoExists = Boolean(
    Object.prototype.hasOwnProperty.call(info, 'isData') &&
    Object.prototype.hasOwnProperty.call(info, 'onNoData'),
  );

  if (!infoExists) {
    throw new Error('return value of `getInfo()` in `requireData` lacks data!');
  }

  return <T extends object>(Wrapped: ComponentType<P & T>) => {
    class ConnectedView extends React.Component<P> {
      componentDidMount() {
        this.check();
      }

      check() {
        const { isData, onNoData } = getInfo(this.props);

        if (!isData) {
          onNoData();
        }
      }

      render() {
        const { isData } = getInfo(this.props);

        if (!isData) {
          return null;
        }

        return React.createElement(Wrapped, this.props as T & P);
      }
    }

    return ConnectedView;
  };
};
