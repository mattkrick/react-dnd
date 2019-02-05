"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dragOffset_1 = require("./dragOffset");
const dragOperation_1 = require("./dragOperation");
const refCount_1 = require("./refCount");
const dirtyHandlerIds_1 = require("./dirtyHandlerIds");
const stateId_1 = require("./stateId");
const get = require('lodash/get');
function reduce(state = {}, action) {
    return {
        dirtyHandlerIds: dirtyHandlerIds_1.default(state.dirtyHandlerIds, {
            type: action.type,
            payload: Object.assign({}, action.payload, { prevTargetIds: get(state, 'dragOperation.targetIds', []) }),
        }),
        dragOffset: dragOffset_1.default(state.dragOffset, action),
        refCount: refCount_1.default(state.refCount, action),
        dragOperation: dragOperation_1.default(state.dragOperation, action),
        stateId: stateId_1.default(state.stateId),
    };
}
exports.default = reduce;
