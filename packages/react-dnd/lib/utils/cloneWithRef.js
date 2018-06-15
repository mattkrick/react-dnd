'use strict'
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
var invariant_1 = __importDefault(require('invariant'))
var react_1 = require('react')
function cloneWithRef(element, newRef) {
	var previousRef = element.ref
	invariant_1.default(
		typeof previousRef !== 'string',
		'Cannot connect React DnD to an element with an existing string ref. ' +
			'Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. ' +
			'Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute',
	)
	if (!previousRef) {
		// When there is no ref on the element, use the new ref directly
		return react_1.cloneElement(element, {
			ref: newRef,
		})
	}
	return react_1.cloneElement(element, {
		ref: function(node) {
			newRef(node)
			if (previousRef) {
				previousRef(node)
			}
		},
	})
}
exports.default = cloneWithRef
//# sourceMappingURL=cloneWithRef.js.map
