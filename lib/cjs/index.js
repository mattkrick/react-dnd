"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HTML5Backend_1 = require("./HTML5Backend");
const getEmptyImage_1 = require("./getEmptyImage");
exports.getEmptyImage = getEmptyImage_1.default;
const NativeTypes = require("./NativeTypes");
exports.NativeTypes = NativeTypes;
function createHTML5Backend(manager) {
    return new HTML5Backend_1.default(manager);
}
exports.default = createHTML5Backend;
