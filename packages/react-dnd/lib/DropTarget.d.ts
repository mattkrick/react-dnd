/// <reference types="react" />
import React from 'react';
import { TargetType } from 'dnd-core';
import { DropTargetSpec, DndOptions, DropTargetCollector, DndComponentClass } from './interfaces';
export default function DropTarget<P, S, TargetComponent extends React.Component<P, S> | React.StatelessComponent<P>, CollectedProps>(type: TargetType | ((props: P) => TargetType), spec: DropTargetSpec<P, S, TargetComponent>, collect: DropTargetCollector<CollectedProps>, options?: DndOptions<P>): <TargetClass extends React.ComponentClass<P>>(DecoratedComponent: TargetClass) => TargetClass & DndComponentClass<P, S, TargetComponent, TargetClass>;
