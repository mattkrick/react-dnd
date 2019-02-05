"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const invariant = require('invariant');
function cloneWithRef(element, newRef) {
    const previousRef = element.ref;
    invariant(typeof previousRef !== 'string', 'Cannot connect React DnD to an element with an existing string ref. ' +
        'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' +
        'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute');
    if (!previousRef) {
        // When there is no ref on the element, use the new ref directly
        return react_1.cloneElement(element, {
            ref: newRef,
        });
    }
    return react_1.cloneElement(element, {
        ref: (node) => {
            newRef(node);
            if (previousRef) {
                previousRef(node);
            }
        },
    });
}
exports.default = cloneWithRef;
