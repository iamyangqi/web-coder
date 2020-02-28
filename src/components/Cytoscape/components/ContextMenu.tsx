import * as React from 'react';
import {baseInjectHook, BaseInjectHookProps, nextEventLoop} from "../../../utils";
import MovableMenu from "../../MovableMenu";
import {CascadeMenuConfigsProps} from "../../CascadeMenu/CascadeMenu";
import CytoscapeStore from "../stores/stores";
import {CyNode} from "../stores/models";

export enum GraphContextMenuEnum {
    CONTAINER_CONTEXT,
    NODE_CONTEXT,
}

interface GraphContextMenuProps extends BaseInjectHookProps {
    mainStore: CytoscapeStore;
}

const GraphContextMenu = baseInjectHook((props: GraphContextMenuProps) => {
    const [menu, setMenu] = React.useState<CascadeMenuConfigsProps>();
    const containerContextMenu: CascadeMenuConfigsProps = {
        mode: 'vertical',
        items: [{
            key: 'add-node',
            title: props.t!('Graph:Add Node'),
            clickCb: addNode,
        }],
    }
    const nodeContextMenu: CascadeMenuConfigsProps = {
        mode: 'vertical',
        items: [{
            key: 'add-connecting-line',
            title: props.t!('Graph:Add Connect Line'),
            clickCb: addConnectLine,
        }],
    }

    function addNode() {
        const {x, y} = props.mainStore.uiService;
        props.mainStore.datasService.addNode(new CyNode({
            position: { x, y }
        }));
        nextEventLoop(() => {
            props.mainStore.uiService.setShowContextMenu(false);
        });
    }

    function addConnectLine() {
        props.mainStore.uiService.setShowContextMenu(false);
        nextEventLoop(() => {
            props.mainStore.elementsService.addLine();
        })
    }

    React.useEffect(() => {
        let menu: CascadeMenuConfigsProps;
        switch (props.mainStore.eventsService.contextMode) {
            case GraphContextMenuEnum.CONTAINER_CONTEXT:
                menu = containerContextMenu; break;
            case GraphContextMenuEnum.NODE_CONTEXT:
                menu = nodeContextMenu; break;
            default:
                menu = containerContextMenu;
        }
        setMenu(menu);
    }, [props.mainStore.eventsService.contextMode]);

    return (
        menu ?
        <MovableMenu
            menu={menu}
            x={props.mainStore.uiService.contextMenuPosition.x + 2}
            y={props.mainStore.uiService.contextMenuPosition.y + 2} /> : null
    );
});

export default GraphContextMenu;
