import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./containers/App";
import {I18nextProvider} from "react-i18next";
import i18n from 'i18next';
import {Router} from "react-router";
import {HISTORY} from "./utils";
import './index.scss';

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Router history={HISTORY}>
            <App />
        </Router>
    </I18nextProvider>,
    document.getElementById("app")
)