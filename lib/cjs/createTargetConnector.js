"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrapConnectorHooks_1 = require("./wrapConnectorHooks");
const shallowEqual = require('shallowequal');
function createTargetConnector(backend) {
    let currentHandlerId;
    let currentDropTargetNode;
    let currentDropTargetOptions;
    let disconnectCurrentDropTarget;
    function reconnectDropTarget() {
        if (disconnectCurrentDropTarget) {
            disconnectCurrentDropTarget();
            disconnectCurrentDropTarget = undefined;
        }
        if (currentHandlerId && currentDropTargetNode) {
            disconnectCurrentDropTarget = backend.connectDropTarget(currentHandlerId, currentDropTargetNode, currentDropTargetOptions);
        }
    }
    function receiveHandlerId(handlerId) {
        if (handlerId === currentHandlerId) {
            return;
        }
        currentHandlerId = handlerId;
        reconnectDropTarget();
    }
    const hooks = wrapConnectorHooks_1.default({
        dropTarget: function connectDropTarget(node, options) {
            if (node === currentDropTargetNode &&
                shallowEqual(options, currentDropTargetOptions)) {
                return;
            }
            currentDropTargetNode = node;
            currentDropTargetOptions = options;
            reconnectDropTarget();
        },
    });
    return {
        receiveHandlerId,
        hooks,
    };
}
exports.default = createTargetConnector;
