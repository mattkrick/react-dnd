'use strict'
var __importDefault =
	(this && this.__importDefault) ||
	function(mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
var invariant_1 = __importDefault(require('invariant'))
var isPlainObject_1 = __importDefault(require('lodash/isPlainObject'))
var checkDecoratorArguments_1 = __importDefault(
	require('./utils/checkDecoratorArguments'),
)
var decorateHandler_1 = __importDefault(require('./decorateHandler'))
var registerTarget_1 = __importDefault(require('./registerTarget'))
var createTargetFactory_1 = __importDefault(require('./createTargetFactory'))
var createTargetMonitor_1 = __importDefault(require('./createTargetMonitor'))
var createTargetConnector_1 = __importDefault(
	require('./createTargetConnector'),
)
var isValidType_1 = __importDefault(require('./utils/isValidType'))
function DropTarget(type, spec, collect, options) {
	if (options === void 0) {
		options = {}
	}
	checkDecoratorArguments_1.default(
		'DropTarget',
		'type, spec, collect[, options]',
		type,
		spec,
		collect,
		options,
	)
	var getType = type
	if (typeof type !== 'function') {
		invariant_1.default(
			isValidType_1.default(type, true),
			'Expected "type" provided as the first argument to DropTarget to be ' +
				'a string, an array of strings, or a function that returns either given ' +
				'the current props. Instead, received %s. ' +
				'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html',
			type,
		)
		getType = function() {
			return type
		}
	}
	invariant_1.default(
		isPlainObject_1.default(spec),
		'Expected "spec" provided as the second argument to DropTarget to be ' +
			'a plain object. Instead, received %s. ' +
			'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html',
		spec,
	)
	var createTarget = createTargetFactory_1.default(spec)
	invariant_1.default(
		typeof collect === 'function',
		'Expected "collect" provided as the third argument to DropTarget to be ' +
			'a function that returns a plain object of props to inject. ' +
			'Instead, received %s. ' +
			'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html',
		collect,
	)
	invariant_1.default(
		isPlainObject_1.default(options),
		'Expected "options" provided as the fourth argument to DropTarget to be ' +
			'a plain object when specified. ' +
			'Instead, received %s. ' +
			'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target.html',
		collect,
	)
	return function decorateTarget(DecoratedComponent) {
		return decorateHandler_1.default({
			containerDisplayName: 'DropTarget',
			createHandler: createTarget,
			registerHandler: registerTarget_1.default,
			createMonitor: createTargetMonitor_1.default,
			createConnector: createTargetConnector_1.default,
			DecoratedComponent: DecoratedComponent,
			getType: getType,
			collect: collect,
			options: options,
		})
	}
}
exports.default = DropTarget
//# sourceMappingURL=DropTarget.js.map
