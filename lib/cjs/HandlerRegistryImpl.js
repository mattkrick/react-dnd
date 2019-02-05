"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("./actions/registry");
const getNextUniqueId_1 = require("./utils/getNextUniqueId");
const interfaces_1 = require("./interfaces");
const contracts_1 = require("./contracts");
const invariant = require('invariant');
const asap = require('asap');
function getNextHandlerId(role) {
    const id = getNextUniqueId_1.default().toString();
    switch (role) {
        case interfaces_1.HandlerRole.SOURCE:
            return `S${id}`;
        case interfaces_1.HandlerRole.TARGET:
            return `T${id}`;
        default:
            throw new Error(`Unknown Handler Role: ${role}`);
    }
}
function parseRoleFromHandlerId(handlerId) {
    switch (handlerId[0]) {
        case 'S':
            return interfaces_1.HandlerRole.SOURCE;
        case 'T':
            return interfaces_1.HandlerRole.TARGET;
        default:
            invariant(false, `Cannot parse handler ID: ${handlerId}`);
    }
}
function mapContainsValue(map, searchValue) {
    const entries = map.entries();
    let isDone = false;
    do {
        const { done, value: [, value], } = entries.next();
        if (value === searchValue) {
            return true;
        }
        isDone = done;
    } while (!isDone);
    return false;
}
class HandlerRegistryImpl {
    constructor(store) {
        this.store = store;
        this.types = new Map();
        this.dragSources = new Map();
        this.dropTargets = new Map();
        this.pinnedSourceId = null;
        this.pinnedSource = null;
    }
    addSource(type, source) {
        contracts_1.validateType(type);
        contracts_1.validateSourceContract(source);
        const sourceId = this.addHandler(interfaces_1.HandlerRole.SOURCE, type, source);
        this.store.dispatch(registry_1.addSource(sourceId));
        return sourceId;
    }
    addTarget(type, target) {
        contracts_1.validateType(type, true);
        contracts_1.validateTargetContract(target);
        const targetId = this.addHandler(interfaces_1.HandlerRole.TARGET, type, target);
        this.store.dispatch(registry_1.addTarget(targetId));
        return targetId;
    }
    containsHandler(handler) {
        return (mapContainsValue(this.dragSources, handler) ||
            mapContainsValue(this.dropTargets, handler));
    }
    getSource(sourceId, includePinned = false) {
        invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
        const isPinned = includePinned && sourceId === this.pinnedSourceId;
        const source = isPinned ? this.pinnedSource : this.dragSources.get(sourceId);
        return source;
    }
    getTarget(targetId) {
        invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
        return this.dropTargets.get(targetId);
    }
    getSourceType(sourceId) {
        invariant(this.isSourceId(sourceId), 'Expected a valid source ID.');
        return this.types.get(sourceId);
    }
    getTargetType(targetId) {
        invariant(this.isTargetId(targetId), 'Expected a valid target ID.');
        return this.types.get(targetId);
    }
    isSourceId(handlerId) {
        const role = parseRoleFromHandlerId(handlerId);
        return role === interfaces_1.HandlerRole.SOURCE;
    }
    isTargetId(handlerId) {
        const role = parseRoleFromHandlerId(handlerId);
        return role === interfaces_1.HandlerRole.TARGET;
    }
    removeSource(sourceId) {
        invariant(this.getSource(sourceId), 'Expected an existing source.');
        this.store.dispatch(registry_1.removeSource(sourceId));
        asap(() => {
            this.dragSources.delete(sourceId);
            this.types.delete(sourceId);
        });
    }
    removeTarget(targetId) {
        invariant(this.getTarget(targetId), 'Expected an existing target.');
        this.store.dispatch(registry_1.removeTarget(targetId));
        this.dropTargets.delete(targetId);
        this.types.delete(targetId);
    }
    pinSource(sourceId) {
        const source = this.getSource(sourceId);
        invariant(source, 'Expected an existing source.');
        this.pinnedSourceId = sourceId;
        this.pinnedSource = source;
    }
    unpinSource() {
        invariant(this.pinnedSource, 'No source is pinned at the time.');
        this.pinnedSourceId = null;
        this.pinnedSource = null;
    }
    addHandler(role, type, handler) {
        const id = getNextHandlerId(role);
        this.types.set(id, type);
        if (role === interfaces_1.HandlerRole.SOURCE) {
            this.dragSources.set(id, handler);
        }
        else if (role === interfaces_1.HandlerRole.TARGET) {
            this.dropTargets.set(id, handler);
        }
        return id;
    }
}
exports.default = HandlerRegistryImpl;
