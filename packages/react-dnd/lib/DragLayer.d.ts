/// <reference types="react" />
import React from 'react';
import { DragLayerCollector, DndOptions, DndComponentClass } from './interfaces';
export default function DragLayer<P, S, TargetComponent extends React.Component<P, S> | React.StatelessComponent<P>, CollectedProps>(collect: DragLayerCollector<P, CollectedProps>, options?: DndOptions<P>): <TargetClass extends React.ComponentClass<P>>(DecoratedComponent: TargetClass) => TargetClass & DndComponentClass<P, S, TargetComponent, TargetClass>;
