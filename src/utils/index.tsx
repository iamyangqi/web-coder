import { createBrowserHistory } from 'history';
import * as i18n from 'i18next';
import * as React from 'react';
import {observer as hookObserver} from 'mobx-react-lite';
// @ts-ignore
import {__RouterContext, RouteComponentProps} from 'react-router-dom';
import {Locales, Themes} from "../interfaces/app";
import appStore from "../stores/AppStore";

export type NonRequired<T> = {
    [K in keyof T]?: T[K];
};

export const HISTORY = createBrowserHistory();

export interface BaseInjectHookProps<T = any> extends NonRequired<RouteComponentProps> {
    t?: i18n.TFunction;
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
            {t: i18n.default.t, locale: i18n.default.language as Locales, theme});
        const render = component(enhancedProps);
        return render;
    });
}