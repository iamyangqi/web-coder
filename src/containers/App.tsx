import * as React from 'react';
import Layout from 'antd/es/layout';
import 'antd/es/layout/style';
import {baseInjectHook, BaseInjectHookProps} from "../utils";
import './index.scss';
import i18n from "i18next";
import TopOperations from "./TopOperations/TopOperations";
import Index from "../components/Cytoscape";
import {changeTheme} from "../components/ThemeSelect";
import {Themes} from "../interfaces/app";
import FileOperations from "./FileOperations/FileOperations";
import Cytoscape from "../components/Cytoscape";

const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;

const App = baseInjectHook((props: BaseInjectHookProps) => {

    React.useEffect(() => {
        changeTheme(Themes.default);
    });

    return (
        <Layout className='app'>
            <Header className='header'>
                <TopOperations />
                <FileOperations />
            </Header>
            <Layout className='content'>
                <Sider>{i18n.t('App:TEST')}</Sider>
                <Content>
                    <Cytoscape containerId={'cyto'} />
                </Content>
            </Layout>
            <Footer>{props.locale}</Footer>
        </Layout>
    )
});

export default App;