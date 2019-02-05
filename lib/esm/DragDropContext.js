import * as React from 'react';
import { createDragDropManager, } from 'dnd-core';
import checkDecoratorArguments from './utils/checkDecoratorArguments';
const invariant = require('invariant');
const hoistStatics = require('hoist-non-react-statics');
const isClassComponent = require('recompose/isClassComponent').default;
/**
 * Create the React Context
 */
export const { Consumer, Provider } = React.createContext({ dragDropManager: undefined });
/**
 * Creates the context object we're providing
 * @param backend
 * @param context
 */
export function createChildContext(backend, context, debugMode) {
    return {
        dragDropManager: createDragDropManager(backend, context, debugMode),
    };
}
/**
 * A React component that provides the React-DnD context
 */
export const DragDropContextProvider = ({ backend, context, debugMode, children }) => {
    const contextValue = createChildContext(backend, context, debugMode);
    return React.createElement(Provider, { value: contextValue }, children);
};
/**
 * Wrap the root component of your application with DragDropContext decorator to set up React DnD.
 * This lets you specify the backend, and sets up the shared DnD state behind the scenes.
 * @param backendFactory The DnD backend factory
 * @param backendContext The backend context
 */
export function DragDropContext(backendFactory, backendContext, debugMode) {
    checkDecoratorArguments('DragDropContext', 'backend', backendFactory);
    const childContext = createChildContext(backendFactory, backendContext, debugMode);
    return function decorateContext(DecoratedComponent) {
        const Decorated = DecoratedComponent;
        const displayName = Decorated.displayName || Decorated.name || 'Component';
        class DragDropContextContainer extends React.Component {
            constructor() {
                super(...arguments);
                this.ref = React.createRef();
                this.getManager = () => childContext.dragDropManager;
            }
            getDecoratedComponentInstance() {
                invariant(this.ref.current, 'In order to access an instance of the decorated component it can not be a stateless component.');
                return this.ref.current;
            }
            render() {
                return (React.createElement(Provider, { value: childContext },
                    React.createElement(Decorated, Object.assign({}, this.props, { ref: isClassComponent(Decorated) ? this.ref : undefined }))));
            }
        }
        DragDropContextContainer.DecoratedComponent = DecoratedComponent;
        DragDropContextContainer.displayName = `DragDropContext(${displayName})`;
        return hoistStatics(DragDropContextContainer, DecoratedComponent);
    };
}
