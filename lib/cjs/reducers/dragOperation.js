"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dragDrop_1 = require("../actions/dragDrop");
const registry_1 = require("../actions/registry");
const without = require('lodash/without');
const initialState = {
    itemType: null,
    item: null,
    sourceId: null,
    targetIds: [],
    dropResult: null,
    didDrop: false,
    isSourcePublic: null,
};
function dragOperation(state = initialState, action) {
    const { payload } = action;
    switch (action.type) {
        case dragDrop_1.BEGIN_DRAG:
            return Object.assign({}, state, { itemType: payload.itemType, item: payload.item, sourceId: payload.sourceId, isSourcePublic: payload.isSourcePublic, dropResult: null, didDrop: false });
        case dragDrop_1.PUBLISH_DRAG_SOURCE:
            return Object.assign({}, state, { isSourcePublic: true });
        case dragDrop_1.HOVER:
            return Object.assign({}, state, { targetIds: payload.targetIds });
        case registry_1.REMOVE_TARGET:
            if (state.targetIds.indexOf(payload.targetId) === -1) {
                return state;
            }
            return Object.assign({}, state, { targetIds: without(state.targetIds, payload.targetId) });
        case dragDrop_1.DROP:
            return Object.assign({}, state, { dropResult: payload.dropResult, didDrop: true, targetIds: [] });
        case dragDrop_1.END_DRAG:
            return Object.assign({}, state, { itemType: null, item: null, sourceId: null, dropResult: null, didDrop: false, isSourcePublic: null, targetIds: [] });
        default:
            return state;
    }
}
exports.default = dragOperation;
