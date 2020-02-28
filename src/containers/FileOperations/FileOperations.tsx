import * as React from 'react';
import './index.scss';
import {baseInjectHook, BaseInjectHookProps} from "../../utils";
import CascadeMenu, {CascadeMenuConfigsProps} from "../../components/CascadeMenu/CascadeMenu";

const FileOperations = baseInjectHook((props: BaseInjectHookProps) => {
    const fileOperationsConfigs: CascadeMenuConfigsProps = {
        mode: 'horizontal',
        items: [{
            key: 'add-node',
            title: props.t!('Graph:Add Node'),
        }],
        leafClassName: 'graph-file-item',
    }

    return (
        <div className='file-operations'>
            <CascadeMenu menu={fileOperationsConfigs} />
        </div>
    );
});

export default FileOperations;