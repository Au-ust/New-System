import React, { useEffect, useState } from "react";
//控制路由
import { useLocation, useNavigate } from "react-router-dom";
//从antd引入Layout组件的子组件Sider
import { Layout ,Menu} from "antd";
//引入antd的图标组件
import {
  HomeOutlined ,
  AppstoreOutlined,
  UploadOutlined,
  UserOutlined,
  ClusterOutlined ,
  TeamOutlined,
  FileSearchOutlined ,
  InfoCircleOutlined,
  BarsOutlined,
  AuditOutlined,
  EditOutlined ,
} from '@ant-design/icons';
import './index.css';
//引入css
import './index.css';
import axios from "axios";
import { useSelector } from 'react-redux'; // ✅ 引入 Redux Hook,管理侧边栏是否折叠
//解构Layout
const { Header, Content, Sider } = Layout;
//接收RightList的dataSource
function SideMenu() {
  // 图标映射表
  const iconMap = {
     '/user-manage':<UserOutlined/>,
    '/user-manage/list': <TeamOutlined />,
     "/right-manage":<ClusterOutlined />,
     '/right-manage/right/list': <BarsOutlined />,
    '/right-manage/role/list': <BarsOutlined />,
    //新闻
     "/news-manage":<FileSearchOutlined />,
     '/news-manage/add': <EditOutlined />,
     '/news-manage/draft': <BarsOutlined />,
     '/news-manage/category':<BarsOutlined />,
    //审核
        
  "/audit-manage": <AuditOutlined />,
   '/audit-manage/audit':<InfoCircleOutlined />,
    '/audit-manage/list': <BarsOutlined />,
    //发布 
    "/publish-manage": <UploadOutlined />,
    '/publish-manage/unpublished': <BarsOutlined />,
    '/publish-manage/published': <BarsOutlined />,
    '/publish-manage/sunset': <BarsOutlined />,
    //首页
    "/home": <HomeOutlined />,
    //其他
  "default": <AppstoreOutlined />
};

  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  //获取路径名
  const pathname = useLocation().pathname;
  //截取一级路由
  const openKeys = [pathname.split("/").slice(0, 2).join("/")];
  //获取用户数据
  
  //获取登录的用户数据
  const token = JSON.parse(localStorage.getItem("token")) || {};
  const rights = token?.role?.rights || [];
  const collapsed = useSelector((state) => state.collapsed.value); //从全局状态读取折叠状态

  const checkPermission = (item) => { 
    if (item.pagepermisson === 1&&rights.includes(item.key)) { 
      return true; 
    } 
    if (item.children) { 
      return item.children.some(child => checkPermission(child)); 
    } 
    return false;
  }

  //声明格式化 JSON 数据为 AntD 所需的 items 格式的函数
  const formatMenu = (data) => {
    return data
      .filter(item =>checkPermission(item))//过滤pagepermisson
      .map(item => ({
        key: item.key,
        icon: iconMap[item.key] || iconMap["default"],
        label: item.title,
        //递归调用，判断是否有children，再判断children是否有长度
        children: item.children?.length > 0 ? formatMenu(item.children) : undefined
      }));
    };
     //获取数据
  useEffect(() => { 
      //调用格式化函数，格式数据
      axios.get('http://localhost:3000/rights?_embed=children') .then(response => setMenuItems(formatMenu(response.data)))
        .catch(error => console.error("加载失败：", error));
    }, []);
    
   const handleMenuClick = (e) => {
    navigate(e.key);  // 切换路由
  };
  return (
       //collapsible可折叠的，是否可收起；collapsed当前的折叠状态
       <Sider trigger={null} collapsible collapsed={collapsed}>
       <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
       <div className="logo">全球新闻发布管理系统</div>
        <div style={{flex: 1, overflow: 'auto'}}>
          <Menu
          theme="dark"
          mode="inline"
        /*defaultSelectedKeys默认选中的菜单项 key 数组，打开默认的item是对应key的值,这里是home*/
            defaultSelectedKeys={['1']}
        /*selectedKeys当前选中的菜单项 key 数组*/
            selectedKeys={pathname}
        /*defaultOpenKeys默认展开的 SubMenu 菜单项 key 数组,只截取一级路由*/
            defaultOpenKeys={openKeys}
          items={menuItems}
          onClick={handleMenuClick}
        />
        </div>
      </div>
      </Sider>
    );
}

export default SideMenu;
