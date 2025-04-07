import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import NewsRouter from "../../components/sandbox/NewsRouter";
//引入antd
import { theme, Layout, ConfigProvider } from "antd";
//引入进度条
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Progress bar styles
//引入自己写的css
import "./NewSandbox.css";
import { useEffect } from "react";
//解构Layout
const { Content } = Layout;

function NewSandbox() {
    //解构theme
    const { token } = theme.useToken(); // 获取主题 token
    const { colorBgContainer, borderRadiusLG } = token;
    //调用进度条
    useEffect(() => {
        NProgress.start(); // 组件开始渲染时，启动进度条
        setTimeout(() => {
            NProgress.done(); // 组件渲染完成后，稍微延迟结束进度条，让用户可见加载过程
        }, 200); // 200ms 延迟，使进度条有明显的效果
    }, []);
    return (
       <ConfigProvider> <Layout>    
            {/* 侧边栏 */}
            <SideMenu />
            <Layout>
                {/* 顶部栏 */}
                <TopHeader></TopHeader>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'auto',
                    }}
                >
                    {/* 引入路由表 */}
            <NewsRouter></NewsRouter>
            </Content>
        </Layout>
        </Layout></ConfigProvider>
    
    );
}

export default NewSandbox;