import * as React from 'react';
import {baseInjectHook, BaseInjectHookProps} from "../../utils";
import './index.scss';
import CascadeMenu, {CascadeMenuConfigsProps} from "../../components/CascadeMenu/CascadeMenu";

const TopOperations = baseInjectHook((props: BaseInjectHookProps) => {
    const topOperationsConfigs: CascadeMenuConfigsProps = {
        mode: 'horizontal',
        popClassName: 'top-pop-menu',
        items: [{
            key: 'file',
            title: props.t!('Configs:File'),
            children: [{
                key: 'new',
                title: props.t!('Configs:New'),
                children: [{
                    key: 'graph',
                    title: props.t!('Configs:Graph')
                }]
            },{
                key: 'open',
                title: props.t!('Configs:Open'),
            }, {
                key: 'save',
                title: props.t!('Configs:Save'),
            }],
        }],
    }

    return (
        <div className='top-operations'>
            <CascadeMenu menu={topOperationsConfigs} />
        </div>
    );
});

export default TopOperations;