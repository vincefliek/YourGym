import React from 'react';

import { store } from './store';

export const connect = (params, mapToProps) => {
    if (typeof params !== 'object') {
        throw new Error('First argument in `connect` function is mandatory');
    }

    if (typeof params.controller !== 'function') {
        throw new Error('`controller` property in 1st argument in `connect` function is mandatory');
    }

    return Wrapped => {
        class ConnectedView extends React.Component {
            constructor(props) {
                super(props);
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
                    const bindedController = params.controller(store.getStoreData, this.props);
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
