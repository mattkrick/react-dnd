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
var __importStar =
	(this && this.__importStar) ||
	function(mod) {
		if (mod && mod.__esModule) return mod
		var result = {}
		if (mod != null)
			for (var k in mod)
				if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k]
		result['default'] = mod
		return result
	}
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
var React = __importStar(require('react'))
var prop_types_1 = __importDefault(require('prop-types'))
var isPlainObject_1 = __importDefault(require('lodash/isPlainObject'))
var invariant_1 = __importDefault(require('invariant'))
var hoist_non_react_statics_1 = __importDefault(
	require('hoist-non-react-statics'),
)
var shallowEqual = require('shallowequal')
var _a = require('disposables'),
	Disposable = _a.Disposable,
	CompositeDisposable = _a.CompositeDisposable,
	SerialDisposable = _a.SerialDisposable
var isClassComponent = function(Comp) {
	return (
		!!Comp && !!Comp.prototype && typeof Comp.prototype.render === 'function'
	)
}
function decorateHandler(_a) {
	var DecoratedComponent = _a.DecoratedComponent,
		createHandler = _a.createHandler,
		createMonitor = _a.createMonitor,
		createConnector = _a.createConnector,
		registerHandler = _a.registerHandler,
		containerDisplayName = _a.containerDisplayName,
		getType = _a.getType,
		collect = _a.collect,
		options = _a.options
	var _b = options.arePropsEqual,
		arePropsEqual = _b === void 0 ? shallowEqual : _b
	var displayName =
		DecoratedComponent.displayName || DecoratedComponent.name || 'Component'
	var DragDropContainer = /** @class */ (function(_super) {
		__extends(DragDropContainer, _super)
		function DragDropContainer(props, context) {
			var _this = _super.call(this, props, context) || this
			_this.isCurrentlyMounted = false
			_this.handleChange = _this.handleChange.bind(_this)
			_this.handleChildRef = _this.handleChildRef.bind(_this)
			invariant_1.default(
				typeof _this.context.dragDropManager === 'object',
				'Could not find the drag and drop manager in the context of %s. ' +
					'Make sure to wrap the top-level component of your app with DragDropContext. ' +
					'Read more: http://react-dnd.github.io/react-dnd/docs-troubleshooting.html#could-not-find-the-drag-and-drop-manager-in-the-context',
				displayName,
				displayName,
			)
			_this.manager = _this.context.dragDropManager
			_this.handlerMonitor = createMonitor(_this.manager)
			_this.handlerConnector = createConnector(_this.manager.getBackend())
			_this.handler = createHandler(_this.handlerMonitor)
			_this.disposable = new SerialDisposable()
			_this.receiveProps(props)
			_this.state = _this.getCurrentState()
			_this.dispose()
			return _this
		}
		DragDropContainer.prototype.getHandlerId = function() {
			return this.handlerId
		}
		DragDropContainer.prototype.getDecoratedComponentInstance = function() {
			return this.decoratedComponentInstance
		}
		DragDropContainer.prototype.shouldComponentUpdate = function(
			nextProps,
			nextState,
		) {
			return (
				!arePropsEqual(nextProps, this.props) ||
				!shallowEqual(nextState, this.state)
			)
		}
		DragDropContainer.prototype.componentDidMount = function() {
			this.isCurrentlyMounted = true
			this.disposable = new SerialDisposable()
			this.currentType = undefined
			this.receiveProps(this.props)
			this.handleChange()
		}
		DragDropContainer.prototype.componentWillReceiveProps = function(
			nextProps,
		) {
			if (!arePropsEqual(nextProps, this.props)) {
				this.receiveProps(nextProps)
				this.handleChange()
			}
		}
		DragDropContainer.prototype.componentWillUnmount = function() {
			this.dispose()
			this.isCurrentlyMounted = false
		}
		DragDropContainer.prototype.receiveProps = function(props) {
			this.handler.receiveProps(props)
			this.receiveType(getType(props))
		}
		DragDropContainer.prototype.receiveType = function(type) {
			if (type === this.currentType) {
				return
			}
			this.currentType = type
			var _a = registerHandler(type, this.handler, this.manager),
				handlerId = _a.handlerId,
				unregister = _a.unregister
			this.handlerId = handlerId
			this.handlerMonitor.receiveHandlerId(handlerId)
			this.handlerConnector.receiveHandlerId(handlerId)
			var globalMonitor = this.manager.getMonitor()
			var unsubscribe = globalMonitor.subscribeToStateChange(
				this.handleChange,
				{ handlerIds: [handlerId] },
			)
			this.disposable.setDisposable(
				new CompositeDisposable(
					new Disposable(unsubscribe),
					new Disposable(unregister),
				),
			)
		}
		DragDropContainer.prototype.handleChange = function() {
			if (!this.isCurrentlyMounted) {
				return
			}
			var nextState = this.getCurrentState()
			if (!shallowEqual(nextState, this.state)) {
				this.setState(nextState)
			}
		}
		DragDropContainer.prototype.dispose = function() {
			this.disposable.dispose()
			this.handlerConnector.receiveHandlerId(null)
		}
		DragDropContainer.prototype.handleChildRef = function(component) {
			this.decoratedComponentInstance = component
			this.handler.receiveComponent(component)
		}
		DragDropContainer.prototype.getCurrentState = function() {
			var nextState = collect(this.handlerConnector.hooks, this.handlerMonitor)
			if (process.env.NODE_ENV !== 'production') {
				invariant_1.default(
					isPlainObject_1.default(nextState),
					'Expected `collect` specified as the second argument to ' +
						'%s for %s to return a plain object of props to inject. ' +
						'Instead, received %s.',
					containerDisplayName,
					displayName,
					nextState,
				)
			}
			return nextState
		}
		DragDropContainer.prototype.render = function() {
			return React.createElement(
				DecoratedComponent,
				__assign({}, this.props, this.state, {
					ref: isClassComponent(DecoratedComponent)
						? this.handleChildRef
						: null,
				}),
			)
		}
		DragDropContainer.DecoratedComponent = DecoratedComponent
		DragDropContainer.displayName =
			containerDisplayName + '(' + displayName + ')'
		DragDropContainer.contextTypes = {
			dragDropManager: prop_types_1.default.object.isRequired,
		}
		return DragDropContainer
	})(React.Component)
	return hoist_non_react_statics_1.default(
		DragDropContainer,
		DecoratedComponent,
	)
}
exports.default = decorateHandler
//# sourceMappingURL=decorateHandler.js.map
