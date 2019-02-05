"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const reducers_1 = require("./reducers");
const dragDrop_1 = require("./actions/dragDrop");
const DragDropMonitorImpl_1 = require("./DragDropMonitorImpl");
const HandlerRegistryImpl_1 = require("./HandlerRegistryImpl");
function makeStoreInstance(debugMode) {
    // TODO: if we ever make a react-native version of this,
    // we'll need to consider how to pull off dev-tooling
    const reduxDevTools = typeof window !== 'undefined' &&
        window.__REDUX_DEVTOOLS_EXTENSION__;
    return redux_1.createStore(reducers_1.default, debugMode &&
        reduxDevTools &&
        reduxDevTools({
            name: 'dnd-core',
            instanceId: 'dnd-core',
        }));
}
class DragDropManagerImpl {
    constructor(createBackend, context = {}, debugMode = false) {
        this.context = context;
        this.isSetUp = false;
        this.handleRefCountChange = () => {
            const shouldSetUp = this.store.getState().refCount > 0;
            if (shouldSetUp && !this.isSetUp) {
                this.backend.setup();
                this.isSetUp = true;
            }
            else if (!shouldSetUp && this.isSetUp) {
                this.backend.teardown();
                this.isSetUp = false;
            }
        };
        const store = makeStoreInstance(debugMode);
        this.store = store;
        this.monitor = new DragDropMonitorImpl_1.default(store, new HandlerRegistryImpl_1.default(store));
        this.backend = createBackend(this);
        store.subscribe(this.handleRefCountChange);
    }
    getContext() {
        return this.context;
    }
    getMonitor() {
        return this.monitor;
    }
    getBackend() {
        return this.backend;
    }
    getRegistry() {
        return this.monitor.registry;
    }
    getActions() {
        const manager = this;
        const { dispatch } = this.store;
        function bindActionCreator(actionCreator) {
            return (...args) => {
                const action = actionCreator.apply(manager, args);
                if (typeof action !== 'undefined') {
                    dispatch(action);
                }
            };
        }
        const actions = dragDrop_1.default(this);
        return Object.keys(actions).reduce((boundActions, key) => {
            const action = actions[key];
            boundActions[key] = bindActionCreator(action);
            return boundActions;
        }, {});
    }
    dispatch(action) {
        this.store.dispatch(action);
    }
}
exports.default = DragDropManagerImpl;
