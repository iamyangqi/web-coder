import {action, observable, autorun, toJS, computed} from "mobx";
import {CascadeMenuConfigsProps} from "../../CascadeMenu/CascadeMenu";
import cytoscape, {EventObject, NodeSingular} from "cytoscape";
import {nextEventLoop, uid} from "../../../utils";
import {CYTO_ENUM, cytoCommonStyle} from "../consts";
import {GraphContextMenuEnum} from "../components/ContextMenu";
import {CyEdge, CyNode} from "./models";
import {CytoFlowJson, DataServiceBatchFn} from "../interfaces";
import {Position} from "cytoscape";

class CommonStore {
    @observable cyto: CytoscapeStore;

    get container(): HTMLElement {
        return this.cyto.container;
    }

    get uiService(): UiService {
        return this.cyto.uiService;
    }

    get eventsService(): EventsService {
        return this.cyto.eventsService;
    }

    get drawService(): DrawService {
        return this.cyto.drawService;
    }

    get datasService(): DatasService {
        return this.cyto.datasService;
    }

    constructor(cyto: CytoscapeStore) {
        this.cyto = cyto;
    }
}

// 与UI有关的服务
class UiService extends CommonStore {
    @observable showContextMenu: boolean = false;
    @observable mousePosition: Position = {x: 0, y: 0};
    @observable contextMenuPosition: Position;
    @observable containerUiInfo: DOMRect;

    @action
    setShowContextMenu(state: boolean) {
        this.contextMenuPosition = {
            x: this.mousePosition.x + this.containerUiInfo.x,
            y: this.mousePosition.y + this.containerUiInfo.y,
        };
        nextEventLoop(() => {
            this.showContextMenu = state;
        });
    }

    @action
    setMousePosition(position: Position) {
        this.mousePosition = position
    }

    @action
    getContainerUiInfo() {
        this.containerUiInfo = this.container.getBoundingClientRect();
    }

    constructor(props: CytoscapeStore) {
        super(props);
        this.getContainerUiInfo();
    }
}

// 与事件有关的服务
class EventsService extends CommonStore {
    @observable contextMode: GraphContextMenuEnum;
    @observable currentNode: NodeSingular;
    @observable connectingLine: boolean;

    @action
    setContextMode(mode: GraphContextMenuEnum) {
        this.contextMode = mode;
    }

    @action
    setCurrentNode(node: NodeSingular) {
        this.currentNode = node;
    }

    @action
    setConnectingLine(state: boolean) {
        this.connectingLine = state;
    }

    handleContainerRightClick(ev: EventObject) {
        if (ev.target === this.cyto.cy) {  // 右键点击画布
            this.setContextMode(GraphContextMenuEnum.CONTAINER_CONTEXT);
            this.uiService.setShowContextMenu(true);
        }
    }

    handleNodeRightClick(ev: EventObject) {
        this.setContextMode(GraphContextMenuEnum.NODE_CONTEXT);
        this.setCurrentNode(ev.target);
        this.uiService.setShowContextMenu(true);
    }

    handleContainerLeftClick(ev: EventObject) {
        this.uiService.setShowContextMenu(false);
    }

    handleMouseover(ev: EventObject) {
        this.uiService.setMousePosition(ev.renderedPosition);
        if(this.connectingLine) {
            this.drawService.drawConnectingLine();
        }
    }

    constructor(props: CytoscapeStore) {
        super(props);
        this.handleContainerRightClick = this.handleContainerRightClick.bind(this);
        this.handleContainerLeftClick = this.handleContainerLeftClick.bind(this);
        this.handleNodeRightClick = this.handleNodeRightClick.bind(this);
        this.handleMouseover = this.handleMouseover.bind(this);
    }
}

class DrawService extends CommonStore {

    drawConnectingLine() {
        // const existConnectingLine = this.datasService.cytoFlow.edges.find((edge: CyEdge) => {
        //     return edge.data.id ===  CYTO_ENUM.NODES_CONNECTING_LINE;
        // });
        // if (existConnectingLine) {
        //     const connectTargetNode = this.datasService.cytoFlow.nodes.find((node: CyNode) => {
        //         return node.data.id ===  CYTO_ENUM.CONNECTING_TARGET_NODE;
        //     });
        //     connectTargetNode!.updatePosition(this.uiService.mousePosition);
        // } else {
        //     this.datasService.batch([
        //         {
        //             action: 'addNode',
        //             params: new CyNode({
        //                 data: {id: CYTO_ENUM.CONNECTING_TARGET_NODE},
        //                 position: this.uiService.mousePosition
        //             })
        //         }, {
        //             action: 'addEdge',
        //             params: new CyEdge({
        //                 data: {
        //                     id: CYTO_ENUM.NODES_CONNECTING_LINE,
        //                     source: this.eventsService.currentNode.data('id'),
        //                     target: CYTO_ENUM.CONNECTING_TARGET_NODE,
        //                 }
        //             })
        //         }
        //     ]);
        // }
        // this.datasService.batch([
        //     {
        //         action: 'removeNode',
        //         params: CYTO_ENUM.CONNECTING_TARGET_NODE,
        //     }, {
        //         action: 'removeEdge',
        //         params: CYTO_ENUM.NODES_CONNECTING_LINE,
        //     }
        // ]);

        // this.datasService.removeNode(CYTO_ENUM.CONNECTING_TARGET_NODE);
        // this.datasService.removeEdge(CYTO_ENUM.NODES_CONNECTING_LINE);
        // this.datasService.addNode(new CyNode({
        //     data: {id: CYTO_ENUM.CONNECTING_TARGET_NODE},
        //     position: this.uiService.mousePosition
        // }));
        // this.datasService.addEdge(new CyEdge({
        //     data: {
        //         id: CYTO_ENUM.NODES_CONNECTING_LINE,
        //         source: this.eventsService.currentNode.data('id'),
        //         target: CYTO_ENUM.CONNECTING_TARGET_NODE,
        //     }
        // }));
    }

    constructor(props: CytoscapeStore) {
        super(props);
        this.drawConnectingLine = this.drawConnectingLine.bind(this);
    }
}

class DatasService extends CommonStore {
    @observable cytoFlow: CytoFlowJson = {
        nodes: [],
        edges: [],
    };

    @action setCytoFlow(flow: CytoFlowJson) {
        this.cytoFlow = flow;
    }

    @action addNode(Node: CyNode) {
        const nodes = [...this.cytoFlow.nodes];
        nodes.push(Node);
        this.cytoFlow.nodes = nodes;
        console.log(this.cytoFlow.nodes);
    }

    @action removeNode(id: string) {
        const nodes = [...this.cytoFlow.nodes.filter((node: CyNode) => node.data.id !== id)];
        console.log(nodes);
        this.cytoFlow.nodes = nodes;
    }

    @action addEdge(Edge : CyEdge) {
        this.cytoFlow.edges.push(Edge);
    }

    @action removeEdge(id: string) {
        const edges = [...this.cytoFlow.edges.filter((node: CyEdge) => node.data.id !== id)];
        this.cytoFlow.edges = edges;
    }

    @action batch(fns: DataServiceBatchFn[]) {
        fns.forEach((fn: DataServiceBatchFn) => {
            (this as any)[fn.action](fn.params);
        })
    }

    constructor(props: CytoscapeStore) {
        super(props);
    }
}

class CytoscapeStore {
    cy: cytoscape.Core | null;
    @observable containerId: string;
    @observable container: HTMLElement;
    @observable uiService: UiService;
    @observable elementsService: DrawService;
    @observable eventsService: EventsService;
    @observable datasService: DatasService;
    @observable drawService: DrawService;

    constructor(containerId: string) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId)!;
        this.cy = cytoscape({
            container: this.container,
            layout: {name: 'preset'},
            style: cytoCommonStyle,
            elements: [new CyNode()],
            wheelSensitivity: .5,
            minZoom: .3,
            maxZoom: 2,
        });
        this.uiService = new UiService(this);
        this.elementsService = new DrawService(this);
        this.eventsService = new EventsService(this);
        this.datasService = new DatasService(this);
        this.drawService = new DrawService(this);
    }
    
    registerEvents() {
        const cy = this.cy!;
        cy.on('cxttap', this.eventsService.handleContainerRightClick);
        cy.on('cxttap', `.${CYTO_ENUM.CYTO_NODE}`, this.eventsService.handleNodeRightClick);
        cy.on('tap', this.eventsService.handleContainerLeftClick);
        cy.on('mousemove', this.eventsService.handleMouseover)
    }
}

export default CytoscapeStore;