import React,{useState} from 'react';
import { Table ,Button,Modal,Space, notification,} from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function NewsDraft() {
    const createConfig = (item) => {
        //声明confirm提示框的设置
        const config = {
            title: '您确定要删除该草稿？',
            content: `即将删除：${item.title}`,
            onOk() {
            console.log('确认删除！');
                deletMethod(item)
            },
            onCancel() {
                console.log('取消删除！');
            }
        }
        console.log(config)
        
        return config
    }
    //定义删除方法
    const deletMethod = (item) => {
            let list = dataSource.filter(data => data.id === item.rightId)
            //此时进行setSourceData,使用展开运算符
            setdataSource([...list])
            //同步后端
            axios.delete(`http://localhost:3000/news/${item.id}`)
    }
    const navigate = useNavigate(); //使用useNavigate钩子

    const [dataSource, setdataSource] = useState([])
    const [modal, modalContextHolder] = Modal.useModal()
    const [api, notificationContextHolder] = notification.useNotification()
    const {username}=JSON.parse(localStorage.getItem('token') || '{}')
    //获取数据
    useEffect(() => { 
       axios.get(`http://localhost:3000/news?author=${username}&auditState=0&_expand=category`).then(res => {
           const list = res.data
           setdataSource(list)
       })
    }, [username])
    
    const handleCheck = (id) => {
        axios.patch(`http://localhost:3000/news/${id}`, {
            auditState: 1 // 设置审核状态为 1（审核中）
        }).then(res => {
            console.log('审核状态更新成功:', res.data);
            setdataSource(dataSource.filter(item => item.id !== id)); // 更新状态
            api.success({
            message: '通知',
            description: '审核已提交，请等待管理员审核',
            placement: 'bottomRight',
            })
            setTimeout(() => {
            navigate('/audit-manage/list');
            }, 1500)
        }).catch(err => {
            console.error('审核状态更新失败:', err);
        }
        )
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
        },{
           title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return  <div>{category && category.title ? category.title : '无分类'}</div>;
            }
        },{
            title: '操作',
            render: (item) => {
                // console.log(item)
                //这个item就是当前操作的那一项
                return <div>
                        <Space>
                            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            // 动态生成config
                            const confirmed = modal.confirm(createConfig(item))
                            console.log('Confirmed: ', confirmed);
                        }} />
                        </Space>

                       <Button
                        type="primary"
                        shape="circle"
                        onClick={() =>navigate(`/news-manage/update/${item.id}`)}
                        icon={<EditOutlined />}
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<UploadOutlined />}
                        onClick={() =>handleCheck(item.id)}
                    />

                   
                </div>
            }
        },
    ]
    
    
 
    return (
        <div>
            {/* contextHolder 必须放在 return 里 */}
            {modalContextHolder}
            {notificationContextHolder}
            {/* pageSize设置每页显示的条目数 */}
            {/* 假设每条数据都有唯一id字段 */}
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={item=>item.id}  />
        </div>
    );
}

export default NewsDraft;