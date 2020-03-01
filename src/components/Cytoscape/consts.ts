export const NODE_NORMAL_SIZE = 40;

export enum CYTO_ENUM {
    CYTO_NODE = 'cyto_node',
    CONNECTING_TARGET_NODE = 'connecting_target_node',
    NODES_CONNECTING_LINE = 'nodes_connecting_line',
}

export const cytoCommonStyle = [{
    selector: `.${CYTO_ENUM.CYTO_NODE}`,
    style: {
        color: 'data(color)',
        shape: 'data(shape)',
        backgroundColor: 'data(backgroundColor)',
        width: NODE_NORMAL_SIZE,
        height: NODE_NORMAL_SIZE,
    }
}];