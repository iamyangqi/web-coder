import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./containers/App";
import {I18nextProvider} from "react-i18next";
import i18n from 'i18next';
import {Router} from "react-router";
import {History, I18nNamespaceConfig, initI18nNext} from "./utils";
import './index.scss';
import {Locales} from "./interfaces/app";

const i18nNsConfigs: I18nNamespaceConfig[] = [
    {
        ns: 'App',
        lng: Locales.en,
        content: require('../translations/en/App.json'),
    }, {
        ns: 'App',
        lng: Locales.zh,
        content: require('../translations/zh/App.json'),
    }, {
        ns: 'Configs',
        lng: Locales.en,
        content: require('../translations/en/Configs.json'),
    }, {
        ns: 'Configs',
        lng: Locales.zh,
        content: require('../translations/zh/Configs.json'),
    }, {
        ns: 'Graph',
        lng: Locales.en,
        content: require('../translations/en/Graph.json'),
    }, {
        ns: 'Graph',
        lng: Locales.zh,
        content: require('../translations/zh/Graph.json'),
    }];

initI18nNext(i18nNsConfigs);

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Router history={History}>
            <App />
        </Router>
    </I18nextProvider>,
    document.getElementById("app")
)