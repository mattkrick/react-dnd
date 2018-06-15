'use strict'
var __extends =
	(this && this.__extends) ||
	(function() {
		var extendStatics =
			Object.setPrototypeOf ||
			({ __proto__: [] } instanceof Array &&
				function(d, b) {
					d.__proto__ = b
				}) ||
			function(d, b) {
				for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
			}
		return function(d, b) {
			extendStatics(d, b)
			function __() {
				this.constructor = d
			}
			d.prototype =
				b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
		}
	})()
var __assign =
	(this && this.__assign) ||
	Object.assign ||
	function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i]
			for (var p in s)
				if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
		}
		return t
	}
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
var react_1 = __importDefault(require('react'))
var prop_types_1 = __importDefault(require('prop-types'))
var dnd_core_1 = require('dnd-core')
var invariant_1 = __importDefault(require('invariant'))
var hoist_non_react_statics_1 = __importDefault(
	require('hoist-non-react-statics'),
)
var checkDecoratorArguments_1 = __importDefault(
	require('./utils/checkDecoratorArguments'),
)
exports.CHILD_CONTEXT_TYPES = {
	dragDropManager: prop_types_1.default.object.isRequired,
}
function createChildContext(backend, context) {
	return {
		dragDropManager: dnd_core_1.createDragDropManager(backend, context),
	}
}
exports.createChildContext = createChildContext
function DragDropContext(backendFactory, context) {
	checkDecoratorArguments_1.default(
		'DragDropContext',
		'backend',
		backendFactory,
	) // eslint-disable-line prefer-rest-params
	var childContext = createChildContext(backendFactory, context)
	return function decorateContext(DecoratedComponent) {
		var displayName =
			DecoratedComponent.displayName || DecoratedComponent.name || 'Component'
		var DragDropContextContainer = /** @class */ (function(_super) {
			__extends(DragDropContextContainer, _super)
			function DragDropContextContainer() {
				return (_super !== null && _super.apply(this, arguments)) || this
			}
			DragDropContextContainer.prototype.getDecoratedComponentInstance = function() {
				invariant_1.default(
					this.child,
					'In order to access an instance of the decorated component it can not be a stateless component.',
				)
				return this.child
			}
			DragDropContextContainer.prototype.getManager = function() {
				return childContext.dragDropManager
			}
			DragDropContextContainer.prototype.getChildContext = function() {
				return childContext
			}
			DragDropContextContainer.prototype.render = function() {
				var _this = this
				return react_1.default.createElement(
					DecoratedComponent,
					__assign({}, this.props, {
						ref: function(child) {
							return (_this.child = child)
						},
					}),
				)
			}
			DragDropContextContainer.DecoratedComponent = DecoratedComponent
			DragDropContextContainer.displayName =
				'DragDropContext(' + displayName + ')'
			DragDropContextContainer.childContextTypes = exports.CHILD_CONTEXT_TYPES
			return DragDropContextContainer
		})(react_1.default.Component)
		return hoist_non_react_statics_1.default(
			DragDropContextContainer,
			DecoratedComponent,
		)
	}
}
exports.default = DragDropContext
//# sourceMappingURL=DragDropContext.js.map
