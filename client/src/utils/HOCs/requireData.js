import React from 'react';

export const requireData = (getInfo) => {
  if (typeof getInfo !== 'function') {
    throw new Error(
      '`getInfo` argument in `requireData` function is mandatory',
    );
  }

  const info = getInfo({});
  const infoExists = Boolean(
    info.hasOwnProperty('isData') && info.hasOwnProperty('onNoData'),
  );

  if (!infoExists) {
    throw new Error(
      'return value of `getInfo()` in `requireData` lacks data!',
    );
  }

  return Wrapped => {
    class ConnectedView extends React.Component {
      componentDidMount() {
        this.check();
      }

      componentDidUpdate() {
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

        return (
          <Wrapped
            {...this.props}
          />
        );
      }
    }

    return ConnectedView;
  };
};
