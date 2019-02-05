"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const dnd_core_1 = require("dnd-core");
const checkDecoratorArguments_1 = require("./utils/checkDecoratorArguments");
const invariant = require('invariant');
const hoistStatics = require('hoist-non-react-statics');
const isClassComponent = require('recompose/isClassComponent').default;
/**
 * Create the React Context
 */
_a = React.createContext({ dragDropManager: undefined }), exports.Consumer = _a.Consumer, exports.Provider = _a.Provider;
/**
 * Creates the context object we're providing
 * @param backend
 * @param context
 */
function createChildContext(backend, context, debugMode) {
    return {
        dragDropManager: dnd_core_1.createDragDropManager(backend, context, debugMode),
    };
}
exports.createChildContext = createChildContext;
/**
 * A React component that provides the React-DnD context
 */
exports.DragDropContextProvider = ({ backend, context, debugMode, children }) => {
    const contextValue = createChildContext(backend, context, debugMode);
    return React.createElement(exports.Provider, { value: contextValue }, children);
};
/**
 * Wrap the root component of your application with DragDropContext decorator to set up React DnD.
 * This lets you specify the backend, and sets up the shared DnD state behind the scenes.
 * @param backendFactory The DnD backend factory
 * @param backendContext The backend context
 */
function DragDropContext(backendFactory, backendContext, debugMode) {
    checkDecoratorArguments_1.default('DragDropContext', 'backend', backendFactory);
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
                return (React.createElement(exports.Provider, { value: childContext },
                    React.createElement(Decorated, Object.assign({}, this.props, { ref: isClassComponent(Decorated) ? this.ref : undefined }))));
            }
        }
        DragDropContextContainer.DecoratedComponent = DecoratedComponent;
        DragDropContextContainer.displayName = `DragDropContext(${displayName})`;
        return hoistStatics(DragDropContextContainer, DecoratedComponent);
    };
}
exports.DragDropContext = DragDropContext;
