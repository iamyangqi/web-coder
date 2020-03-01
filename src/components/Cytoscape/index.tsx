import * as React from 'react';
import {BaseInjectHookProps, nextEventLoop} from "../../utils";
import CytoscapeStore from "./stores/stores";
import GraphContextMenu, {GraphContextMenuEnum} from "./components/ContextMenu";
import './index.scss';
import {action, autorun, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {CytoFlowJson} from "./interfaces";
import {cytoCommonStyle} from "./consts";
import {CyNode} from "./stores/models";
import cytoscape from "cytoscape";

interface CytoscapeProps extends BaseInjectHookProps{
    containerId: string;
}

class Cytoscape extends React.Component<CytoscapeProps> {
    @observable mainStore: CytoscapeStore;

    @action
    setMainStore(store: CytoscapeStore) {
        this.mainStore = store;
    }

    draw(flow: CytoFlowJson) {
        if(this.mainStore.cy) {
            this.mainStore.cy.destroy();
            this.mainStore.cy = null;
        }
        this.mainStore.cy = cytoscape({
            container: this.mainStore.container,
            layout: {name: 'preset'},
            style: cytoCommonStyle,
            elements: [],
            wheelSensitivity: .5,
            minZoom: .3,
            maxZoom: 2,
        });
        this.mainStore.cy.batch(() => {
            this.mainStore.cy!.add(flow.nodes);
            this.mainStore.cy!.add(flow.edges);
        })
        console.log(this.mainStore.cy.json());
        this.mainStore.registerEvents();
    }

    componentDidMount(): void {
        nextEventLoop(() => {
            this.setMainStore(new CytoscapeStore(this.props.containerId));
            autorun(() => {
                this.draw(toJS(this.mainStore.datasService.cytoFlow));
            })
        });
    }

    render() {
        return (
            <>
                <div id={this.props.containerId} />
                {
                    this.mainStore && (
                        <>
                            { this.mainStore.uiService.showContextMenu &&
                            <GraphContextMenu mainStore={this.mainStore}/>}
                        </>
                    )
                }
            </>
        );
    }
}

export default observer(Cytoscape);
