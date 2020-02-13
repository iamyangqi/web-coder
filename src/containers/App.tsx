import * as React from 'react';
import Layout from 'antd/es/layout';
import 'antd/es/layout/style';
import {baseInjectHook, BaseInjectHookProps} from "../utils";
import './index.scss';

const Sider = Layout.Sider;
const Header = Layout.Header;
const Footer = Layout.Footer;
const Content = Layout.Content;

const App = baseInjectHook((props: BaseInjectHookProps) => {
    return (
        <Layout className='app'>
            <Header>{props.t!('Header')}</Header>
            <Layout>
                <Sider>Sider</Sider>
                <Content>Content</Content>
            </Layout>
            <Footer>Footer</Footer>
        </Layout>
    )
});

export default App;