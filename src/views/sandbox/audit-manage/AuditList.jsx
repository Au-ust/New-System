import { useEffect, useState } from "react";
import { Table, Button, Space,Tag , notification,} from "antd";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";

function AuditList() {
    const [dataSource,setDataSource]=useState([])
    const { username } = JSON.parse(localStorage.getItem('token') || '{}')// 获取用户信息+空值检验
    const [api, notificationContextHolder] = notification.useNotification()

    useEffect(() => {
        axios.get(`http://localhost:3000/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            console.log('审核列表:', res.data);
            setDataSource(res.data)
        }) 
    }, [username])
    //撤销的函数
    const handleRervert=(item) => {
        setDataSource(dataSource.filter(data => data.id !== item))
        axios.patch(`http://localhost:3000/news/${item.id}`, {
            auditState: 0
        }
        ).then(res => {
            console.log('撤销成功:', res.data)
            api.success({
            message: '通知',
            description: `已撤销新闻：
            《${res.data.title}》，您可以到草稿箱中查看你的新闻`,
            placement: 'bottomRight',
            })
        })
    }
    //更新的函数
    const navigate = useNavigate(); //使用useNavigate钩子
    const handleUpdate = (id) => { 
         navigate(`/news-manage/update/${id}`)
    }
    //发布的函数
        const handlePublish = (id) => {
        axios.patch(`http://localhost:3000/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
        }).then(res => {
            console.log('发布成功:', res.data)
            setDataSource(dataSource.filter(item => item.id !== id))
            api.success({
                message: '通知',
                description: `已发布新闻：
                《${res.data.title}》，您可以到【发布管理/已发布】中查看你的新闻`,
                placement: 'bottomRight',
            })
            setTimeout(() => {
            navigate(`/publish-manage/published`);
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
            dataIndex: 'category',
            render: (category) => {
                return  <div>{category && category.title ? category.title : '无分类'}</div>;
            }
        },{
            title: '审核状态',
            dataIndex: 'auditState',
            render: (auditState) => {
                const colorList = ['black', 'orange', 'green', 'red']
                const auditMap = {0: '未审核',1: '审核中',2: '已通过',3: '未通过'}
                return <Tag color={colorList[auditState]}> {auditMap[auditState]}</Tag>
            }
        },{
            title: '操作',
            render: (item) => {
                //这个item就是当前操作的那一项
                return <div>
                        <Space>
                        {
                            item.auditState===1 ? <Button  color="danger"  variant="solid" onClick={() => handleRervert(item)}>撤销</Button> : null
                        }{
                            item.auditState===2 ? <Button  color="default" variant="outlined" onClick={() => handlePublish(item.id)}>发布</Button> : null
                        }{
                            item.auditState===3 ? <Button  color="primary" variant="outlined" onClick={() => handleUpdate(item.id)}>更新</Button> : null
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

export default AuditList;