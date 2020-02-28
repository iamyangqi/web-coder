import {action, observable, autorun, toJS, computed} from "mobx";
import {CascadeMenuConfigsProps} from "../../CascadeMenu/CascadeMenu";
import cytoscape, {EventObject, NodeSingular} from "cytoscape";
import {nextEventLoop, uid} from "../../../utils";
import {CYTO_ENUM, cytoCommonStyle} from "../consts";
import {GraphContextMenuEnum} from "../components/ContextMenu";
import {CyEdge, CyNode} from "./models";
import {CytoFlowJson} from "../interfaces";
import {Position} from "cytoscape";

class CommonStore {
    @observable cyto: CytoscapeStore;

    get cy():cytoscape.Core {
        return this.cyto.cy;
    }

    get container(): HTMLElement {
        return this.cyto.container;
    }

    get uiService(): UiService {
        return this.cyto.uiService;
    }

    get eventsService(): EventsService {
        return this.cyto.eventsService;
    }

    constructor(cyto: CytoscapeStore) {
        this.cyto = cyto;
    }
}

// 与UI有关的服务
class UiService extends CommonStore {
    @observable showContextMenu: boolean = false;
    @observable contextMenu: CascadeMenuConfigsProps;
    @observable contextMenuPosition: Position = {x: 0, y: 0};
    @observable containerUiInfo: DOMRect;

    @computed
    get x() {
        return this.contextMenuPosition.x - this.containerUiInfo.x;
    }

    @computed
    get y() {
        return this.contextMenuPosition.y - this.containerUiInfo.y;
    }

    @action
    setShowContextMenu(state: boolean, position?: Position) {
        if (position) {
            this.contextMenuPosition = position;
        }
        nextEventLoop(() => {
            this.showContextMenu = state;
        });
    }

    @action
    setContextMenu(menu: CascadeMenuConfigsProps) {
        this.contextMenu = menu;
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

    @action
    setContextMode(mode: GraphContextMenuEnum) {
        this.contextMode = mode;
    }

    @action
    setCurrentNode(node: NodeSingular) {
        this.currentNode = node;
    }

    handleContainerRightClick(ev: EventObject) {
        if (ev.target === this.cy) {  // 右键点击画布
            this.setContextMode(GraphContextMenuEnum.CONTAINER_CONTEXT);
            this.uiService.setShowContextMenu(true, {
                x: ev.originalEvent.clientX,
                y: ev.originalEvent.clientY,
            });
        }
    }

    handleNodeRightClick(ev: EventObject) {
        this.setContextMode(GraphContextMenuEnum.NODE_CONTEXT);
        this.setCurrentNode(ev.target);
        this.uiService.setShowContextMenu(true, {
            x: ev.originalEvent.clientX,
            y: ev.originalEvent.clientY,
        });
    }

    handleContainerLeftClick(ev: EventObject) {
        this.uiService.setShowContextMenu(false);
    }

    registerEvents() {
        this.cy.on('cxttap', this.handleContainerRightClick);
        this.cy.on('cxttap', `.${CYTO_ENUM.CYTO_NODE}`, this.handleNodeRightClick);
        this.cy.on('tap', this.handleContainerLeftClick);
    }

    constructor(props: CytoscapeStore) {
        super(props);
        this.handleContainerRightClick = this.handleContainerRightClick.bind(this);
        this.handleContainerLeftClick = this.handleContainerLeftClick.bind(this);
        this.handleNodeRightClick = this.handleNodeRightClick.bind(this);
        this.registerEvents();
    }
}

// 与节点、边等元素有关的服务
class ElementsService extends CommonStore {
    // 添加节点，如果contextMenu存在则在鼠标位置处添加，否则会居中添加
    addNode() {
        const id = uid();
        const position = this.uiService.showContextMenu ? {
            x: this.uiService.contextMenuPosition.x - this.uiService.containerUiInfo.x,
            y: this.uiService.uiService.contextMenuPosition.y - this.uiService.uiService.containerUiInfo.y,
        } : undefined;
        const node = {
            data: {
                id,
                backgroundColor: 'red'
            },
            labels: ['person'],
            position,
            classes: CYTO_ENUM.CYTO_NODE
        }
        this.cy.add(node);
        !position && this.cy.center(this.cy.$(`#${id}`));
    }

    addLine() {
        const position = {
            x: this.uiService.contextMenuPosition.x - this.uiService.containerUiInfo.x + 10,
            y: this.uiService.uiService.contextMenuPosition.y - this.uiService.uiService.containerUiInfo.y + 10,
        };
        const newNode = {
            data: {
                id: CYTO_ENUM.NEW_NODE_ITEM,
            },
            style: {
                width: 10,
                height: 10
            },
            position
        };
        const newEdge = {
            data: {
                id: CYTO_ENUM.ADD_NODE_CONNECTING_LINE,
                source: this.eventsService.currentNode.data('id'),
                target: CYTO_ENUM.NEW_NODE_ITEM,
            }
        };
        this.cy.batch(() => {
            this.cy.add(newNode);
            this.cy.add(newEdge);
        });
    }
}

class DatasService {
    @observable cytoFlow: CytoFlowJson = {
        nodes: [],
        edges: [],
    };

    @action setCytoFlow(flow: CytoFlowJson) {
        this.cytoFlow = flow;
    }

    @action addNode(Node: CyNode) {
        this.cytoFlow.nodes.push(Node);
    }
}

class CytoscapeStore {
    @observable cy: cytoscape.Core;
    @observable containerId: string;
    @observable container: HTMLElement;
    @observable uiService: UiService;
    @observable elementsService: ElementsService;
    @observable eventsService: EventsService;
    @observable datasService: DatasService;

    constructor(containerId: string) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId)!;
        this.cy = cytoscape({container: this.container, layout: {name: 'preset'}, style: cytoCommonStyle});
        this.uiService = new UiService(this);
        this.elementsService = new ElementsService(this);
        this.eventsService = new EventsService(this);
        this.datasService = new DatasService();
    }

    draw(flow: CytoFlowJson) {
        console.log(toJS(flow.nodes))
        this.cy.batch(() => {
            this.cy.add(toJS(flow.nodes));
        });
    }
}

export default CytoscapeStore;