import {
    Css,
    CssStyleDeclaration,
    EdgeDataDefinition,
    EdgeDefinition,
    ElementGroup,
    NodeDataDefinition,
    NodeDefinition, Position, Scratchpad
} from "cytoscape";
import {CyEdge, CyNode} from "./stores/models";

export interface ElementDefinition {
    group?: ElementGroup;
    data?: NodeDataDefinition | EdgeDataDefinition;
    scratch?: Scratchpad;
    position?: Position;
    renderedPosition?: Position;
    selected?: boolean;
    selectable?: boolean;
    locked?: boolean;
    grabbable?: boolean;
    classes?: string;
    style?: CssStyleDeclaration;
    css?: Css.Node | Css.Edge;
}

export interface CyNodeProps extends ElementDefinition{
    data?: NodeDataDefinition;
}

export interface CyEdgeProps extends ElementDefinition{
    data?: EdgeDataDefinition;
}

export interface CytoFlowJson {
    nodes: CyNode[];
    edges: CyEdge[];
}