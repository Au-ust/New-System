//导入antd
import { Layout, theme, Button,Dropdown,Space,Avatar,} from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { DownOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import avatarImg from '../../Avatar.jpg'
import { toggleCollapsed } from "../../redux/reducers/CollapsedReducer";
import { useNavigate } from "react-router-dom";
//从Layout组件中解构Header组件
const { Header } = Layout;

function TopHeader() {
  const collapsed = useSelector(state => state.collapsed.value);
  const dispatch = useDispatch();
    //const [collapsed, setCollapsed] = useState(false)//使用redux来管理侧边栏的折叠状态
    //定义changeCollapsed函数，用于展开/收起侧边栏,通过取反实现
    //这里不需要了，因为antd的Button组件已经封装好了
    // const changeCollapsed = () => {
    //     setCollapsed(!collapsed)
    // }
  const { token } = theme.useToken(); // 获取主题 token
  const { colorBgContainer, borderRadiusLG } = token;
   // 安全获取用户信息
    const getUserInfo = () => {
        try {
            const tokenData = JSON.parse(localStorage.getItem("token")) || {};
            return {
                roleName: tokenData.role?.roleName || "无角色",
                username: tokenData.username || "游客"
            };
        } catch (error) {
            console.error("解析token失败:", error);
            return {
                roleName: "无角色",
                username: "游客"
            };
        }
    };

    const { roleName, username } = getUserInfo();
    const items = [
    {
        key: '1',
        label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
            {roleName}
        </a>
        ),
    },
   {
        key: '2',
        danger: true,
        label: '退出登录',
    },
  ]
  const navigate = useNavigate();
  const handleMenuClick = (e) => {
    console.log(e.key)
    //根据item，e.key==='2'的时候是退出,是字符2
    if (e.key ==='2') {
      //清除用户信息，退出登录
      localStorage.removeItem("token")
      //跳转到登录页面
      navigate("/login");
      }
    }

  return (
            <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
    type="text"
    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    onClick={() => dispatch(toggleCollapsed())}
    style={{
      fontSize: '16px',
      width: 64,
      height: 64,
  }}
/>
            {/* {让盒子浮动到右边} */}
            <div style={{ float: 'right', marginRight: '20px' }}> 
                <span>
                    欢迎您，<span style={{color:'#1890ff'}}>{username}</span>
                </span>
                {/* 下拉菜单栏 */}
                  <Dropdown
                    menu={{
                    items,
                    onClick: handleMenuClick 
                  }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                    {/* 插槽的形式,hover用户头像图标显示下DownOutlined*/}
                         <Avatar src={<img src={avatarImg} alt="avatar" />} />
                        <DownOutlined />
                    </Space>
                    </a>
                </Dropdown>
            </div>
        </Header>
    )
}

export default TopHeader;