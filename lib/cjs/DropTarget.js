"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkDecoratorArguments_1 = require("./utils/checkDecoratorArguments");
const decorateHandler_1 = require("./decorateHandler");
const registerTarget_1 = require("./registerTarget");
const createTargetFactory_1 = require("./createTargetFactory");
const createTargetMonitor_1 = require("./createTargetMonitor");
const createTargetConnector_1 = require("./createTargetConnector");
const isValidType_1 = require("./utils/isValidType");
const invariant = require('invariant');
const isPlainObject = require('lodash/isPlainObject');
function DropTarget(type, spec, collect, options = {}) {
    checkDecoratorArguments_1.default('DropTarget', 'type, spec, collect[, options]', type, spec, collect, options);
    let getType = type;
    if (typeof type !== 'function') {
        invariant(isValidType_1.default(type, true), 'Expected "type" provided as the first argument to DropTarget to be ' +
            'a string, an array of strings, or a function that returns either given ' +
            'the current props. Instead, received %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', type);
        getType = () => type;
    }
    invariant(isPlainObject(spec), 'Expected "spec" provided as the second argument to DropTarget to be ' +
        'a plain object. Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', spec);
    const createTarget = createTargetFactory_1.default(spec);
    invariant(typeof collect === 'function', 'Expected "collect" provided as the third argument to DropTarget to be ' +
        'a function that returns a plain object of props to inject. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', collect);
    invariant(isPlainObject(options), 'Expected "options" provided as the fourth argument to DropTarget to be ' +
        'a plain object when specified. ' +
        'Instead, received %s. ' +
        'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', collect);
    return function decorateTarget(DecoratedComponent) {
        return decorateHandler_1.default({
            containerDisplayName: 'DropTarget',
            createHandler: createTarget,
            registerHandler: registerTarget_1.default,
            createMonitor: createTargetMonitor_1.default,
            createConnector: createTargetConnector_1.default,
            DecoratedComponent,
            getType,
            collect,
            options,
        });
    };
}
exports.default = DropTarget;
