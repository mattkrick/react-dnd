"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const invariant = require('invariant');
const isPlainObject = require('lodash/isPlainObject');
const ALLOWED_SPEC_METHODS = ['canDrop', 'hover', 'drop'];
function createTargetFactory(spec) {
    Object.keys(spec).forEach(key => {
        invariant(ALLOWED_SPEC_METHODS.indexOf(key) > -1, 'Expected the drop target specification to only have ' +
            'some of the following keys: %s. ' +
            'Instead received a specification with an unexpected "%s" key. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', ALLOWED_SPEC_METHODS.join(', '), key);
        invariant(typeof spec[key] === 'function', 'Expected %s in the drop target specification to be a function. ' +
            'Instead received a specification with %s: %s. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', key, key, spec[key]);
    });
    class TargetImpl {
        constructor(monitor) {
            this.monitor = monitor;
            this.props = null;
            this.ref = react_1.createRef();
        }
        receiveProps(props) {
            this.props = props;
        }
        receiveMonitor(monitor) {
            this.monitor = monitor;
        }
        canDrop() {
            if (!spec.canDrop) {
                return true;
            }
            return spec.canDrop(this.props, this.monitor);
        }
        hover() {
            if (!spec.hover) {
                return;
            }
            spec.hover(this.props, this.monitor, this.ref.current);
        }
        drop() {
            if (!spec.drop) {
                return undefined;
            }
            const dropResult = spec.drop(this.props, this.monitor, this.ref.current);
            if (process.env.NODE_ENV !== 'production') {
                invariant(typeof dropResult === 'undefined' || isPlainObject(dropResult), 'drop() must either return undefined, or an object that represents the drop result. ' +
                    'Instead received %s. ' +
                    'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html', dropResult);
            }
            return dropResult;
        }
    }
    return function createTarget(monitor) {
        return new TargetImpl(monitor);
    };
}
exports.default = createTargetFactory;
