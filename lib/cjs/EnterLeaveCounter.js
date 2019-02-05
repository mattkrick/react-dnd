"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const union = require('lodash/union');
const without = require('lodash/without');
class EnterLeaveCounter {
    constructor(isNodeInDocument) {
        this.entered = [];
        this.isNodeInDocument = isNodeInDocument;
    }
    enter(enteringNode) {
        const previousLength = this.entered.length;
        const isNodeEntered = (node) => this.isNodeInDocument(node) &&
            (!node.contains || node.contains(enteringNode));
        this.entered = union(this.entered.filter(isNodeEntered), [enteringNode]);
        return previousLength === 0 && this.entered.length > 0;
    }
    leave(leavingNode) {
        const previousLength = this.entered.length;
        this.entered = without(this.entered.filter(this.isNodeInDocument), leavingNode);
        return previousLength > 0 && this.entered.length === 0;
    }
    reset() {
        this.entered = [];
    }
}
exports.default = EnterLeaveCounter;
