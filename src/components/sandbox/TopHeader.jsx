//导入antd
import { Layout, theme, Button,Dropdown,Space,Avatar,} from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { DownOutlined} from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';

//从Layout组件中解构Header组件
const { Header} = Layout;
function TopHeader() {
    const [collapsed, setCollapsed] = useState(false)
    //定义changeCollapsed函数，用于展开/收起侧边栏,通过取反实现
    //这里不需要了，因为antd的Button组件已经封装好了
    // const changeCollapsed = () => {
    //     setCollapsed(!collapsed)
    // }
    const { token } = theme.useToken(); // 获取主题 token
    const { colorBgContainer, borderRadiusLG } = token;
    const items = [
    {
        key: '1',
        label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            超级管理员
        </a>
        ),
    },
   {
        key: '2',
        danger: true,
        label: '退出登录',
    },
   
   
    ];
    return (
            <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            //展开/收起侧边栏，本来要绑定onClick事件，结果发现antd的Button组件已经封装好了
            icon={collapsed ? <MenuUnfoldOutlined  /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
            />
            {/* {让盒子浮动到右边} */}
            <div style={{ float: 'right', marginRight: '20px' }}> 
                <span>
                    欢迎您，admin 
                </span>
                {/* 下拉菜单栏 */}
                  <Dropdown
                    menu={{items,}}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                    {/* 插槽的形式,hover用户头像图标显示下DownOutlined*/}
                        <Avatar size="large" icon={<UserOutlined />} />
                        <DownOutlined />
                    </Space>
                    </a>
                </Dropdown>
            </div>
        </Header>
    )
}

export default TopHeader;