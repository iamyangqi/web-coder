import * as React from 'react';
import {baseInjectHook, BaseInjectHookProps} from "../../utils";
import {Themes} from "../../interfaces/app";
import appStore from "../../stores/AppStore";
import Select from 'antd/es/select';
import 'antd/es/select/style';
import i18n from "i18next";

const Option = Select.Option;

/**
 * 切换主题
 * @param {SophonTheme} 需切换的主题
 * @param {(t: SophonTheme) => void} 切换主题后的回调
 */
export function changeTheme(t: Themes) {
    appStore.setTheme(t);
    const body = document.getElementsByTagName('body')[0];
    body.setAttribute('data-theme', t);
}

const ThemeSelect = baseInjectHook((props: BaseInjectHookProps) => {
    const themesTranslation = {
        'dark': props.t!('App:dark THEME'),
        'default': props.t!('App:default THEME'),
    }

    React.useEffect(() => {
        changeTheme(appStore.theme);
    }, []);

    function onThemeChange(t: Themes) {
        changeTheme(t);
    }

    return (
        <Select value={appStore.theme} onChange={onThemeChange}>
            {
                Object.keys(Themes).map((key: Themes) => {
                    return (
                        <Option value={key} key={key}>{themesTranslation[key]}</Option>
                    )
                })
            }
        </Select>
    );
});

export default ThemeSelect;