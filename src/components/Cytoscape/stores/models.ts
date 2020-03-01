import {CssStyleDeclaration, EdgeDataDefinition, NodeDataDefinition, Position} from "cytoscape";
import {uid} from "../../../utils";
import {action, observable} from "mobx";
import _get from 'lodash/get';
import {CyEdgeProps, CyNodeProps} from "../interfaces";
import {CYTO_ENUM} from "../consts";
import _merge from 'lodash/merge';

export class CyNode {
    @observable data: NodeDataDefinition;
    @observable position: Position | undefined;
    @observable selected: boolean | undefined;
    @observable classes: string | undefined;
    @observable style: CssStyleDeclaration | undefined;

    constructor(node?: CyNodeProps) {
        if (node) {
            this.data = _get(node, 'data') ?  _get(node, 'data')! : { id: uid() };
            this.position = _get(node, 'position');
            this.selected = _get(node, 'selected');
            this.classes = _get(node, 'classes') ?  _get(node, 'classes')! : CYTO_ENUM.CYTO_NODE;
            this.style = _get(node, 'style');
        } else {
            this.data = {id: uid()};
            this.classes = CYTO_ENUM.CYTO_NODE;
        }
    }

    @action
    updateData(_data: NodeDataDefinition) {
        this.data = _merge({} , {...this.data}, _data);
    }

    @action
    updatePosition(position: Position) {
        this.position = position;
    }
}

export class CyEdge {
    @observable data: EdgeDataDefinition;

    constructor(edge: CyEdgeProps) {
        this.data = edge.data!.id ? edge.data! : Object.assign({}, edge.data, { id: uid() });
    }
}