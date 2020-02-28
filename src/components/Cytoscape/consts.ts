export const NODE_NORMAL_SIZE = 40;

export enum CYTO_ENUM {
    CYTO_NODE = 'cyto_node',
    NEW_NODE_ITEM = 'new_node_item',
    ADD_NODE_CONNECTING_LINE = 'add-node-connecting-line',
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