/// <reference types="react" />
import React from 'react';
import { SourceType } from 'dnd-core';
import { DragSourceSpec, DragSourceCollector, DndOptions, DndComponentClass } from './interfaces';
/**
 * Decorates a component as a dragsource
 * @param type The dragsource type
 * @param spec The drag source specification
 * @param collect The props collector function
 * @param options DnD optinos
 */
export default function DragSource<P, S, TargetComponent extends React.Component<P, S> | React.StatelessComponent<P>, CollectedProps, DragObject>(type: SourceType | ((props: P) => SourceType), spec: DragSourceSpec<P, S, TargetComponent, DragObject>, collect: DragSourceCollector<CollectedProps>, options?: DndOptions<P>): <TargetClass extends React.ComponentClass<P>>(DecoratedComponent: TargetClass) => TargetClass & DndComponentClass<P, S, TargetComponent, TargetClass>;
