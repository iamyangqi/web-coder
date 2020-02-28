import * as React from 'react';
import {baseInjectHook, BaseInjectHookProps} from "../../utils";
import Menu, {MenuMode} from "antd/es/menu";
import 'antd/es/menu/style';

export interface CascadeMenuConfigsProps {
    mode: MenuMode;
    items: CascadeMenuItemConfigsProps[];
    className?: string,
    leafClassName?: string,
    popClassName?: string,
}

export interface CascadeMenuItemConfigsProps {
    key: string;
    title: string;
    children?: CascadeMenuItemConfigsProps[];
    icon?: React.ReactNode;
    clickCb?: (key: string) => any;
}

export interface CascadeMenuProps extends BaseInjectHookProps{
    menu: CascadeMenuConfigsProps;
}

const CascadeMenu = baseInjectHook((props: CascadeMenuProps) => {

    function renderMenuItem(item: CascadeMenuItemConfigsProps) {
        return item.children ? (
            <Menu.SubMenu key={item.key} title={<>{item.icon} {props.t!(item.title)}</>}
                          onTitleClick={() => item.clickCb && item.clickCb(item.key)}
                          popupClassName={props.menu.popClassName}
            >
                {
                    item.children.map((child: CascadeMenuItemConfigsProps) => {
                        return (
                            renderMenuItem(child)
                        )
                    })
                }
            </Menu.SubMenu>
        ) : (
            <Menu.Item key={item.key} onClick={() => item.clickCb && item.clickCb(item.key)} className={props.menu.leafClassName}>
                {item.icon} {props.t!(item.title)}
            </Menu.Item>
        )
    }

    function renderMenu() {
        return (
            <Menu mode={props.menu.mode} className={props.menu.className}>
                {
                    props.menu.items && props.menu.items.map((item: CascadeMenuItemConfigsProps) => {
                        return renderMenuItem(item);
                    })
                }
            </Menu>
        );
    }

    return renderMenu();
});

export default CascadeMenu;
