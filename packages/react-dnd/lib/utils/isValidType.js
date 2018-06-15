'use strict'
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
var isArray_1 = __importDefault(require('lodash/isArray'))
function isValidType(type, allowArray) {
	return (
		typeof type === 'string' ||
		typeof type === 'symbol' ||
		(!!allowArray &&
			isArray_1.default(type) &&
			type.every(function(t) {
				return isValidType(t, false)
			}))
	)
}
exports.default = isValidType
//# sourceMappingURL=isValidType.js.map
