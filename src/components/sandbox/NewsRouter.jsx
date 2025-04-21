
import { Routes, Route } from "react-router-dom";
import Home from "../../views/sandbox/home/Home";
import RightList from "../../views/sandbox/right-manage/RightList";
import UserList from "../../views/sandbox/user-manage/UserList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import { Navigate } from "react-router-dom";
import Nopermission from "../../views/sandbox/nopermission/Nopermission";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import NewsPreview from "../../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../../views/sandbox/news-manage/NewsUpdate";
import { useEffect, useState } from "react";
import axios from "axios";
//本地i的路由映射表，根据权限映射
const LocalRouterMap = {
    //React Router v6应该写成JSX元素，而不是组件类
    '/home':<Home />,
    '/user-manage/list': <UserList/>,
    '/right-manage/right/list': <RightList/>,
    '/right-manage/role/list': <RoleList/>,
    //新闻
    '/news-manage/add': <NewsAdd/>,
    '/news-manage/draft': <NewsDraft/>,
    '/news-manage/category':<NewsCategory/>,
    '/news-manage/preview/:id': <NewsPreview />,
    '/news-manage/update/:id': <NewsUpdate/>,
    //审核
    '/audit-manage/audit': <Audit/>,
    '/audit-manage/list': <AuditList/>,
    //发布 
    '/publish-manage/unpublished': <Unpublished/>,
    '/publish-manage/published': <Published/>,
    '/publish-manage/sunset':<Sunset/>
}
function NewsRouter() {
  const [userRoutes, setUserRoutes] = useState([]); // 存储用户有权限的路由

  useEffect(() => {
    // 1. 获取路由数据
    Promise.all([
      axios.get('http://localhost:3000/rights'),
      axios.get('http://localhost:3000/children')
    ]).then(([rightsRes, childrenRes]) => {
      // 2. 合并路由数据
      const allRoutes = [...rightsRes.data, ...childrenRes.data];
        const validRoutes = allRoutes.filter(route => 
        //根据路由表过滤出有效路由
        LocalRouterMap.hasOwnProperty(route.key)
      );
      
      setUserRoutes(validRoutes);
      
      // 3. 这里添加用户权限过滤逻辑
      const token = JSON.parse(localStorage.getItem("token"));
      const userRights = token.role?.rights || [];
      //从localStorage获取用户权限
      const authorizedRoutes = validRoutes.filter(route => 
        userRights.includes(route.key)
      );
      
      setUserRoutes(authorizedRoutes);
    });
  }, []);


    return (
        <Routes>
            {
            // 遍历路由表
            userRoutes.map(item =><Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} ></Route>)
            }
            <Route path='/' element={<Navigate to='/home' />} />
            {/*404路由,把网速调慢可以看效果*/}
            {userRoutes.length === 0 ? <Route path='*' element={<Nopermission />} /> : null}    
                <Route path='*' element={<Nopermission />} />
            </Routes>
    );
}

export default NewsRouter;