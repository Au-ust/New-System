import axios from "axios"
import { useEffect, useState } from "react"
import { Table, Button, Tag, notification, Space } from "antd"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom" 
function Audit() {
    const [dataSource,setDataSource]=useState([])
    const token = JSON.parse(localStorage.getItem("token")) || {};
    const roleId = token.roleId; // 直接访问 token.roleId
    const region = token.region || "";// 直接访问 token.region
    const isSuperAdmin = roleId === 1; // 超级管理员
    const isAdmin = roleId === 2;      // 区域管理员
    const isEditor = roleId === 3;     // 编辑
    useEffect(() => {
        axios.get(`http://localhost:3000/news?auditState=1&_expand=category`).then(res => {
            let filteredData = res.data;
              
              // 超级管理员：查看所有用户
              if (isSuperAdmin) {
                filteredData=[ ...filteredData.filter(item => item.author === username),...filteredData.filter(item => item.region === region&&isEditor)]
              } 
              // 区域管理员：仅查看本区域用户
              else if (isAdmin) {
                filteredData = res.data.filter(item => item.region === region);
                console.log("区域管理员过滤后数据", filteredData);
              }
              // 编辑：仅查看本区域用户
              else if (isEditor) {
                filteredData = res.data.filter(item => item.region === region);
              }
              
              setDataSource(filteredData);
            })
    }, [isAdmin, isEditor, region, isSuperAdmin])
    const [api, notificationContextHolder] = notification.useNotification()
    const navigate = useNavigate(); //使用useNavigate钩子
    const handleAudit= (item,auditState,publishState) => { 
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`http://localhost:3000/news/${item.id}`, {
            auditState,
            publishState
        }).then(res => { 
            api.success({
                message: '通知',
                description: `已审核：
                《${res.data.title}》，您可以到【审核管理】中查看你的新闻审核状态`,
                placement: 'bottomRight',
            })
            setTimeout(() => {
            navigate(`/audit-manage/list`);
            }, 1500)
        })
    }
     const columns = [
    //在定义表格的列的地方进行样式渲染
        {
            title: 'ID',
            dataIndex: 'id',
            render: (key) => {
                return <b>{key}</b>
            }
        }, {
            title: '新闻标题',
            dataIndex: 'title',
             render: (title, item) => (
            <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
            )
        }, {
            title: '新闻作者',
            dataIndex: 'author',
        }, {
            title: '新闻分类',
            dataIndex: 'categoryId',
           
        },{
            title: '操作',
            render: (item) => {
                //这个item就是当前操作的那一项
                return <div>
                        <Space>
                        {
                           <Button  color="primary"  variant="solid" onClick={() => handleAudit(item,2,1)}>通过</Button> 
                        }{
                           <Button  color="danger"  variant="outlined" onClick={() =>handleAudit(item,3,0)}>驳回</Button> 
                        }
                        </Space>       
                </div>
            }
        },
    ]
    return (
        <div>
            {notificationContextHolder}
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={{
                    pageSize:5
                }}
                rowKey={(item) => item.id}
            ></Table>
        </div>
    );
}

export default Audit;