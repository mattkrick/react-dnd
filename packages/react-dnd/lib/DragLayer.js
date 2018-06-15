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
var hoist_non_react_statics_1 = __importDefault(
	require('hoist-non-react-statics'),
)
var isPlainObject_1 = __importDefault(require('lodash/isPlainObject'))
var invariant_1 = __importDefault(require('invariant'))
var checkDecoratorArguments_1 = __importDefault(
	require('./utils/checkDecoratorArguments'),
)
var shallowEqual = require('shallowequal')
function DragLayer(collect, options) {
	if (options === void 0) {
		options = {}
	}
	checkDecoratorArguments_1.default(
		'DragLayer',
		'collect[, options]',
		collect,
		options,
	) // eslint-disable-line prefer-rest-params
	invariant_1.default(
		typeof collect === 'function',
		'Expected "collect" provided as the first argument to DragLayer to be a function that collects props to inject into the component. ',
		'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html',
		collect,
	)
	invariant_1.default(
		isPlainObject_1.default(options),
		'Expected "options" provided as the second argument to DragLayer to be a plain object when specified. ' +
			'Instead, received %s. Read more: http://react-dnd.github.io/react-dnd/docs-drag-layer.html',
		options,
	)
	return function decorateLayer(DecoratedComponent) {
		var _a = options.arePropsEqual,
			arePropsEqual = _a === void 0 ? shallowEqual : _a
		var displayName =
			DecoratedComponent.displayName || DecoratedComponent.name || 'Component'
		var DragLayerContainer = /** @class */ (function(_super) {
			__extends(DragLayerContainer, _super)
			function DragLayerContainer(props, context) {
				var _this = _super.call(this, props) || this
				_this.isCurrentlyMounted = false
				_this.handleChange = _this.handleChange.bind(_this)
				_this.manager = context.dragDropManager
				invariant_1.default(
					typeof _this.manager === 'object',
					'Could not find the drag and drop manager in the context of %s. ' +
						'Make sure to wrap the top-level component of your app with DragDropContext. ' +
						'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context',
					displayName,
					displayName,
				)
				_this.state = _this.getCurrentState()
				return _this
			}
			Object.defineProperty(
				DragLayerContainer.prototype,
				'DecoratedComponent',
				{
					get: function() {
						return DecoratedComponent
					},
					enumerable: true,
					configurable: true,
				},
			)
			DragLayerContainer.prototype.getDecoratedComponentInstance = function() {
				invariant_1.default(
					this.child,
					'In order to access an instance of the decorated component it can not be a stateless component.',
				)
				return this.child
			}
			DragLayerContainer.prototype.shouldComponentUpdate = function(
				nextProps,
				nextState,
			) {
				return (
					!arePropsEqual(nextProps, this.props) ||
					!shallowEqual(nextState, this.state)
				)
			}
			DragLayerContainer.prototype.componentDidMount = function() {
				this.isCurrentlyMounted = true
				var monitor = this.manager.getMonitor()
				this.unsubscribeFromOffsetChange = monitor.subscribeToOffsetChange(
					this.handleChange,
				)
				this.unsubscribeFromStateChange = monitor.subscribeToStateChange(
					this.handleChange,
				)
				this.handleChange()
			}
			DragLayerContainer.prototype.componentWillUnmount = function() {
				this.isCurrentlyMounted = false
				if (this.unsubscribeFromOffsetChange) {
					this.unsubscribeFromOffsetChange()
					this.unsubscribeFromOffsetChange = undefined
				}
				if (this.unsubscribeFromStateChange) {
					this.unsubscribeFromStateChange()
					this.unsubscribeFromStateChange = undefined
				}
			}
			DragLayerContainer.prototype.render = function() {
				var _this = this
				return react_1.default.createElement(
					DecoratedComponent,
					__assign({}, this.props, this.state, {
						ref: function(child) {
							_this.child = child
						},
					}),
				)
			}
			DragLayerContainer.prototype.handleChange = function() {
				if (!this.isCurrentlyMounted) {
					return
				}
				var nextState = this.getCurrentState()
				if (!shallowEqual(nextState, this.state)) {
					this.setState(nextState)
				}
			}
			DragLayerContainer.prototype.getCurrentState = function() {
				var monitor = this.manager.getMonitor()
				return collect(monitor, this.props)
			}
			DragLayerContainer.displayName = 'DragLayer(' + displayName + ')'
			DragLayerContainer.contextTypes = {
				dragDropManager: prop_types_1.default.object.isRequired,
			}
			return DragLayerContainer
		})(react_1.default.Component)
		return hoist_non_react_statics_1.default(
			DragLayerContainer,
			DecoratedComponent,
		)
	}
}
exports.default = DragLayer
//# sourceMappingURL=DragLayer.js.map
