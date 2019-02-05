"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidType(type, allowArray) {
    return (typeof type === 'string' ||
        typeof type === 'symbol' ||
        (!!allowArray &&
            Array.isArray(type) &&
            type.every(t => isValidType(t, false))));
}
exports.default = isValidType;
