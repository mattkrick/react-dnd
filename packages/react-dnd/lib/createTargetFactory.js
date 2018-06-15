'use strict'
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
var invariant_1 = __importDefault(require('invariant'))
var isPlainObject_1 = __importDefault(require('lodash/isPlainObject'))
var ALLOWED_SPEC_METHODS = ['canDrop', 'hover', 'drop']
function createTargetFactory(spec) {
	Object.keys(spec).forEach(function(key) {
		invariant_1.default(
			ALLOWED_SPEC_METHODS.indexOf(key) > -1,
			'Expected the drop target specification to only have ' +
				'some of the following keys: %s. ' +
				'Instead received a specification with an unexpected "%s" key. ' +
				'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html',
			ALLOWED_SPEC_METHODS.join(', '),
			key,
		)
		invariant_1.default(
			typeof spec[key] === 'function',
			'Expected %s in the drop target specification to be a function. ' +
				'Instead received a specification with %s: %s. ' +
				'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html',
			key,
			key,
			spec[key],
		)
	})
	var TargetImpl = /** @class */ (function() {
		function TargetImpl(monitor) {
			this.monitor = monitor
			this.props = null
			this.component = null
		}
		TargetImpl.prototype.receiveProps = function(props) {
			this.props = props
		}
		TargetImpl.prototype.receiveMonitor = function(monitor) {
			this.monitor = monitor
		}
		TargetImpl.prototype.receiveComponent = function(component) {
			this.component = component
		}
		TargetImpl.prototype.canDrop = function() {
			if (!spec.canDrop) {
				return true
			}
			return spec.canDrop(this.props, this.monitor)
		}
		TargetImpl.prototype.hover = function() {
			if (!spec.hover) {
				return
			}
			spec.hover(this.props, this.monitor, this.component)
		}
		TargetImpl.prototype.drop = function() {
			if (!spec.drop) {
				return undefined
			}
			var dropResult = spec.drop(this.props, this.monitor, this.component)
			if (process.env.NODE_ENV !== 'production') {
				invariant_1.default(
					typeof dropResult === 'undefined' ||
						isPlainObject_1.default(dropResult),
					'drop() must either return undefined, or an object that represents the drop result. ' +
						'Instead received %s. ' +
						'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html',
					dropResult,
				)
			}
			return dropResult
		}
		return TargetImpl
	})()
	return function createTarget(monitor) {
		return new TargetImpl(monitor)
	}
}
exports.default = createTargetFactory
//# sourceMappingURL=createTargetFactory.js.map
