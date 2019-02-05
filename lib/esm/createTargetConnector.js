import wrapConnectorHooks from './wrapConnectorHooks';
const shallowEqual = require('shallowequal');
export default function createTargetConnector(backend) {
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
    const hooks = wrapConnectorHooks({
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
