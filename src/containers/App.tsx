import * as React from 'react';
import Layout from 'antd/es/layout';
import 'antd/es/layout/style';
import {baseInjectHook, BaseInjectHookProps} from "../utils";
import ThemeSelect from "../components/ThemeSelect";
import LocaleSelect from "../components/LanguageSelect";
import './index.scss';
import i18n from "i18next";

const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;

const App = baseInjectHook((props: BaseInjectHookProps) => {
    return (
        <Layout className='app'>
            <Header className='header'>
                <section className="logo"></section>
                <section className="actions">
                    <ThemeSelect />
                    <LocaleSelect />
                </section>
            </Header>
            <Layout className='content'>
                <Sider>{i18n.t('App:TEST')}</Sider>
                <Content>Content</Content>
            </Layout>
            <Footer>{props.locale}</Footer>
        </Layout>
    )
});

export default App;