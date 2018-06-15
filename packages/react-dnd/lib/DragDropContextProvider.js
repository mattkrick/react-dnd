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
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
var react_1 = require('react')
var prop_types_1 = __importDefault(require('prop-types'))
var DragDropContext_1 = require('./DragDropContext')
var DragDropContextProviderImpl = /** @class */ (function(_super) {
	__extends(DragDropContextProviderImpl, _super)
	function DragDropContextProviderImpl(props, context) {
		var _this = _super.call(this, props, context) || this
		_this.backend = props.backend
		_this.childContext = DragDropContext_1.createChildContext(
			_this.backend,
			_this.props.context,
		)
		return _this
	}
	DragDropContextProviderImpl.prototype.componentWillReceiveProps = function(
		nextProps,
	) {
		if (
			nextProps.backend !== this.props.backend ||
			nextProps.context !== this.props.context
		) {
			throw new Error(
				'DragDropContextProvider backend and context props must not change.',
			)
		}
	}
	DragDropContextProviderImpl.prototype.getChildContext = function() {
		return this.childContext
	}
	DragDropContextProviderImpl.prototype.render = function() {
		return react_1.Children.only(this.props.children)
	}
	DragDropContextProviderImpl.propTypes = {
		backend: prop_types_1.default.oneOfType([
			prop_types_1.default.func,
			prop_types_1.default.object,
		]).isRequired,
		children: prop_types_1.default.element.isRequired,
		context: prop_types_1.default.object,
	}
	DragDropContextProviderImpl.defaultProps = {
		context: undefined,
	}
	DragDropContextProviderImpl.childContextTypes =
		DragDropContext_1.CHILD_CONTEXT_TYPES
	DragDropContextProviderImpl.displayName = 'DragDropContextProvider'
	return DragDropContextProviderImpl
})(react_1.Component)
exports.default = DragDropContextProviderImpl
//# sourceMappingURL=DragDropContextProvider.js.map
