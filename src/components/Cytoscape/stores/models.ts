import {NodeDataDefinition, Position} from "cytoscape";
import {notUndefined, uid} from "../../../utils";
import {action, observable} from "mobx";
import _get from 'lodash/get';
import {CyEdgeProps, CyNodeProps} from "../interfaces";
import {CYTO_ENUM} from "../consts";

export class CyNode {
    @observable data: NodeDataDefinition;
    @observable position: Position | undefined;
    @observable selected: boolean | undefined;
    @observable classes: string | undefined;

    constructor(node?: CyNodeProps) {
        if (node) {
            this.data = _get(node, 'data') ?  _get(node, 'data')! : { id: uid() };
            this.position = _get(node, 'position');
            this.selected = _get(node, 'selected');
            this.classes = _get(node, 'classes') ?  _get(node, 'classes')! : CYTO_ENUM.CYTO_NODE;
        } else {
            this.data = {id: uid()};
            this.classes = CYTO_ENUM.CYTO_NODE;
        }
    }
}

export class CyEdge {
    id: string;
    @observable source: string;
    @observable target: string;

    @action
    setSource(source: string) {
        this.source = source;
    }

    @action
    setTarget(target: string) {
        this.target = target;
    }

    constructor(node: CyEdgeProps) {
    }
}