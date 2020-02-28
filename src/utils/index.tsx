import { createBrowserHistory } from 'history';
import i18n, {TFunction} from 'i18next';
import * as React from 'react';
import {observer as hookObserver} from 'mobx-react-lite';
// @ts-ignore
import {__RouterContext, RouteComponentProps} from 'react-router-dom';
import {Locales, Themes} from "../interfaces/app";
import appStore from "../stores/AppStore";
import {initReactI18next} from "react-i18next";
import _unique from 'lodash/uniq';
import { v1 as uuidv1} from 'uuid';

export interface I18nNamespaceConfig {
    ns: string;
    lng: string;
    content: any;
}

export type NonRequired<T> = {
    [K in keyof T]?: T[K];
};

export const History = createBrowserHistory();

// 注意这个方法和getI18nScannerOptions的区别
// 这个方法是用来初始化全局i18n对象，告诉他该去哪些地方找翻译文件的，
// 而getI18nScannerOptions则是在开发时需要用到编译时自动探测翻译信息的插件，才会使用到
export function initI18nNext(i18nNsConfigs: I18nNamespaceConfig[]) {
    const nss = _unique(i18nNsConfigs.map(config => config.ns));

    const i18nConfig: any = {
        resources: {},
        fallbackLng: 'zh',
        // have a common namespace used around the full app
        ns: nss,
        defaultNS: 'App', // 由于所有项目会合成一个，最好不指定defaultNS
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react!!
        },
        react: {
            wait: true,
        },
    };
    i18n.use(initReactI18next)
        .init(i18nConfig);

    for (const config of i18nNsConfigs) {
        i18n.addResourceBundle(config.lng, config.ns, config.content);
    }
}

export interface BaseInjectHookProps<T = any> extends NonRequired<RouteComponentProps> {
    t?: TFunction;
    locale?: Locales;
    theme?: Themes;
}

export function useForceUpdate() {
    const [, setTick] = React.useState(0);
    const update = React.useCallback(() => {
        setTick(tick => tick + 1);
    }, []);
    return update;
}

export function useRouter<T = any>() {
    const routerContext: RouteComponentProps<T> = React.useContext(__RouterContext);
    if (!routerContext) {
        throw new Error('Router context not found, upgrade to react-router-dom@^5 or higher');
    }

    const forceUpdate = useForceUpdate();
    // 路由发生变化了就强制刷新组件
    React.useEffect(() => {
        return routerContext.history.listen(forceUpdate);
    }, [routerContext]);

    return routerContext;
}

export function baseInjectHook<T extends BaseInjectHookProps = BaseInjectHookProps>
(component: React.FunctionComponent<T>): React.FunctionComponent<T> {
    return hookObserver((props: T) => {
        const routerContext: RouteComponentProps = useRouter();
        const theme = appStore.theme;
        const enhancedProps = Object.assign({}, props, routerContext,
            {t: i18n.t.bind(i18n), locale: i18n.language as Locales, theme});
        const render = component(enhancedProps);
        return render;
    });
}

export function nextEventLoop(fn: Function) {
    setTimeout(fn);
}

export function uid() {
    return uuidv1();
}

export function notUndefined(param: any) {
    return param !== undefined;
}