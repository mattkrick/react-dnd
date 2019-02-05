"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DragDropManagerImpl_1 = require("./DragDropManagerImpl");
function createDragDropManager(backend, context, debugMode) {
    return new DragDropManagerImpl_1.default(backend, context, debugMode);
}
exports.createDragDropManager = createDragDropManager;
