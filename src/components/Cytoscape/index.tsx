import * as React from 'react';
import {BaseInjectHookProps, nextEventLoop} from "../../utils";
import CytoscapeStore from "./stores/stores";
import GraphContextMenu, {GraphContextMenuEnum} from "./components/ContextMenu";
import './index.scss';
import {action, autorun, observable} from "mobx";
import {observer} from "mobx-react";

interface CytoscapeProps extends BaseInjectHookProps{
    containerId: string;
}

class Cytoscape extends React.Component<CytoscapeProps> {
    @observable mainStore: CytoscapeStore;

    @action
    setMainStore(store: CytoscapeStore) {
        this.mainStore = store;
    }

    componentDidMount(): void {
        nextEventLoop(() => {
            this.setMainStore(new CytoscapeStore(this.props.containerId));
            autorun(() => {
                this.mainStore.draw(this.mainStore.datasService.cytoFlow);
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
