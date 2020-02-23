import * as React from 'react';
import {baseInjectHook, BaseInjectHookProps} from "../../utils";
import {Locales, Themes} from "../../interfaces/app";
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
export function changeLocale(l: Locales) {
    console.log(l);
    appStore.setLocale(l);
    i18n.changeLanguage(l);
}

const LocaleSelect = baseInjectHook((props: BaseInjectHookProps) => {
    const themesTranslation = {
        'zh': props.t!('Chinese'),
        'en': props.t!('English'),
    }

    React.useEffect(() => {
        console.log(appStore.locale);
        changeLocale(appStore.locale);
    }, []);

    function onLocaleChange(l: Locales) {
        changeLocale(l);
    }

    return (
        <Select value={appStore.locale} onChange={onLocaleChange}>
            {
                Object.keys(Locales).map((key: Locales) => {
                    return (
                        <Option value={key} key={key}>{i18n.t('Teest')}</Option>
                    )
                })
            }
        </Select>
    );
});

export default LocaleSelect;