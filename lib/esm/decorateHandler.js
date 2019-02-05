import * as React from 'react';
import { Consumer } from './DragDropContext';
import { Disposable, CompositeDisposable, SerialDisposable, } from './utils/disposables';
const isClassComponent = require('recompose/isClassComponent').default;
const isPlainObject = require('lodash/isPlainObject');
const invariant = require('invariant');
const hoistStatics = require('hoist-non-react-statics');
const shallowEqual = require('shallowequal');
export default function decorateHandler({ DecoratedComponent, createHandler, createMonitor, createConnector, registerHandler, containerDisplayName, getType, collect, options, }) {
    const { arePropsEqual = shallowEqual } = options;
    const Decorated = DecoratedComponent;
    const displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';
    class DragDropContainer extends React.Component {
        constructor(props) {
            super(props);
            this.handleChange = () => {
                const nextState = this.getCurrentState();
                if (!shallowEqual(nextState, this.state)) {
                    this.setState(nextState);
                }
            };
            this.disposable = new SerialDisposable();
            this.receiveProps(props);
            this.dispose();
        }
        getHandlerId() {
            return this.handlerId;
        }
        getDecoratedComponentInstance() {
            if (!this.handler) {
                return null;
            }
            return this.handler.ref.current;
        }
        shouldComponentUpdate(nextProps, nextState) {
            return (!arePropsEqual(nextProps, this.props) ||
                !shallowEqual(nextState, this.state));
        }
        componentDidMount() {
            this.disposable = new SerialDisposable();
            this.currentType = undefined;
            this.receiveProps(this.props);
            this.handleChange();
        }
        componentDidUpdate(prevProps) {
            if (!arePropsEqual(this.props, prevProps)) {
                this.receiveProps(this.props);
                this.handleChange();
            }
        }
        componentWillUnmount() {
            this.dispose();
        }
        receiveProps(props) {
            if (!this.handler) {
                return;
            }
            this.handler.receiveProps(props);
            this.receiveType(getType(props));
        }
        receiveType(type) {
            if (!this.handlerMonitor || !this.manager || !this.handlerConnector) {
                return;
            }
            if (type === this.currentType) {
                return;
            }
            this.currentType = type;
            const { handlerId, unregister } = registerHandler(type, this.handler, this.manager);
            this.handlerId = handlerId;
            this.handlerMonitor.receiveHandlerId(handlerId);
            this.handlerConnector.receiveHandlerId(handlerId);
            const globalMonitor = this.manager.getMonitor();
            const unsubscribe = globalMonitor.subscribeToStateChange(this.handleChange, { handlerIds: [handlerId] });
            this.disposable.setDisposable(new CompositeDisposable(new Disposable(unsubscribe), new Disposable(unregister)));
        }
        dispose() {
            this.disposable.dispose();
            if (this.handlerConnector) {
                this.handlerConnector.receiveHandlerId(null);
            }
        }
        getCurrentState() {
            if (!this.handlerConnector) {
                return {};
            }
            const nextState = collect(this.handlerConnector.hooks, this.handlerMonitor);
            if (process.env.NODE_ENV !== 'production') {
                invariant(isPlainObject(nextState), 'Expected `collect` specified as the second argument to ' +
                    '%s for %s to return a plain object of props to inject. ' +
                    'Instead, received %s.', containerDisplayName, displayName, nextState);
            }
            return nextState;
        }
        render() {
            return (React.createElement(Consumer, null, ({ dragDropManager }) => {
                if (dragDropManager === undefined) {
                    return null;
                }
                this.receiveDragDropManager(dragDropManager);
                return (React.createElement(Decorated, Object.assign({}, this.props, this.getCurrentState(), { ref: this.handler && isClassComponent(Decorated)
                        ? this.handler.ref
                        : undefined })));
            }));
        }
        receiveDragDropManager(dragDropManager) {
            if (this.manager !== undefined) {
                return;
            }
            this.manager = dragDropManager;
            invariant(typeof dragDropManager === 'object', 'Could not find the drag and drop manager in the context of %s. ' +
                'Make sure to wrap the top-level component of your app with DragDropContext. ' +
                'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context', displayName, displayName);
            this.handlerMonitor = createMonitor(dragDropManager);
            this.handlerConnector = createConnector(dragDropManager.getBackend());
            this.handler = createHandler(this.handlerMonitor);
        }
    }
    DragDropContainer.DecoratedComponent = DecoratedComponent;
    DragDropContainer.displayName = `${containerDisplayName}(${displayName})`;
    return hoistStatics(DragDropContainer, DecoratedComponent);
}
