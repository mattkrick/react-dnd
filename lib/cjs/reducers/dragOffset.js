"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dragDrop_1 = require("../actions/dragDrop");
const equality_1 = require("../utils/equality");
const initialState = {
    initialSourceClientOffset: null,
    initialClientOffset: null,
    clientOffset: null,
};
function dragOffset(state = initialState, action) {
    const { payload } = action;
    switch (action.type) {
        case dragDrop_1.INIT_COORDS:
        case dragDrop_1.BEGIN_DRAG:
            return {
                initialSourceClientOffset: payload.sourceClientOffset,
                initialClientOffset: payload.clientOffset,
                clientOffset: payload.clientOffset,
            };
        case dragDrop_1.HOVER:
            if (equality_1.areCoordsEqual(state.clientOffset, payload.clientOffset)) {
                return state;
            }
            return Object.assign({}, state, { clientOffset: payload.clientOffset });
        case dragDrop_1.END_DRAG:
        case dragDrop_1.DROP:
            return initialState;
        default:
            return state;
    }
}
exports.default = dragOffset;
