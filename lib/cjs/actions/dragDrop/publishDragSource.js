"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
function createPublishDragSource(manager) {
    return function publishDragSource() {
        const monitor = manager.getMonitor();
        if (monitor.isDragging()) {
            return { type: types_1.PUBLISH_DRAG_SOURCE };
        }
    };
}
exports.default = createPublishDragSource;
