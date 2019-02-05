"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkDecoratorArguments_1 = require("./utils/checkDecoratorArguments");
const decorateHandler_1 = require("./decorateHandler");
const registerSource_1 = require("./registerSource");
const createSourceFactory_1 = require("./createSourceFactory");
const createSourceMonitor_1 = require("./createSourceMonitor");
const createSourceConnector_1 = require("./createSourceConnector");
const isValidType_1 = require("./utils/isValidType");
const invariant = require('invariant');
const isPlainObject = require('lodash/isPlainObject');
/**
 * Decorates a component as a dragsource
 * @param type The dragsource type
 * @param spec The drag source specification
 * @param collect The props collector function
 * @param options DnD options
 */
function DragSource(type, spec, collect, options = {}) {
    checkDecoratorArguments_1.default('DragSource', 'type, spec, collect[, options]', type, spec, collect, options);
    let getType = type;
    if (typeof type !== 'function') {
        invariant(isValidType_1.default(type), 'Expected "type" provided as the first argument to DragSource to be ' +
            'a string, or a function that returns a string given the current props. ' +
            'Instead, received %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', type);
        getType = () => type;
    }
    invariant(isPlainObject(spec), 'Expected "spec" provided as the second argument to DragSource to be ' +
        'a plain object. Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', spec);
    const createSource = createSourceFactory_1.default(spec);
    invariant(typeof collect === 'function', 'Expected "collect" provided as the third argument to DragSource to be ' +
        'a function that returns a plain object of props to inject. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', collect);
    invariant(isPlainObject(options), 'Expected "options" provided as the fourth argument to DragSource to be ' +
        'a plain object when specified. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drag-source.html', collect);
    return function decorateSource(DecoratedComponent) {
        return decorateHandler_1.default({
            containerDisplayName: 'DragSource',
            createHandler: createSource,
            registerHandler: registerSource_1.default,
            createMonitor: createSourceMonitor_1.default,
            createConnector: createSourceConnector_1.default,
            DecoratedComponent,
            getType,
            collect,
            options,
        });
    };
}
exports.default = DragSource;
