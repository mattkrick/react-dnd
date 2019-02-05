"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let nextUniqueId = 0;
function getNextUniqueId() {
    return nextUniqueId++;
}
exports.default = getNextUniqueId;
