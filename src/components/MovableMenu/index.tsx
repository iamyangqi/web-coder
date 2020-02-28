import * as React from 'react';
import {baseInjectHook, BaseInjectHookProps} from "../../utils";
import CascadeMenu, {CascadeMenuConfigsProps} from "../CascadeMenu/CascadeMenu";
import './index.scss';

export interface MovableMenuProps extends BaseInjectHookProps {
    x: number,
    y: number,
    menu: CascadeMenuConfigsProps
    id?: string,
}

const MovableMenu = baseInjectHook((props: MovableMenuProps) => {
    const topOperationsConfigs: CascadeMenuConfigsProps = {
        mode: 'vertical',
        items: [{
            key: 'new',
            title: props.t!('Configs:New'),
        },{
            key: 'open',
            title: props.t!('Configs:Open'),
        }, {
            key: 'save',
            title: props.t!('Configs:Save'),
        }],
    }

    return (
        <div id={props.id ? props.id : 'movableMenu'} className='movable-menu-wrapper' style={{top: props.y, left: props.x}}>
            <CascadeMenu menu={props.menu} />
        </div>
    );
});

export default MovableMenu;
