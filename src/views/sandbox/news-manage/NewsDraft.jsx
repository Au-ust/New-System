import React,{useState} from 'react';
import { Table ,Tag,Button,Modal,Space,} from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
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
    //定义编辑方法
    const switchMethod = (item) => {
        console.log('切换权限:', item);
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
        //改变数据
        setdataSource([...dataSource])
        //同步后端
        if (item.grade === 1) {
            axios.patch(`http://localhost:3000/rights/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        } else {
            axios.patch(`http://localhost:3000/children/${item.id}`, {
                pagepermisson: item.pagepermisson
            })
        }
    }

    const [dataSource, setdataSource] = useState([])
    const [modal, contextHolder] = Modal.useModal();
    const {username}=JSON.parse(localStorage.getItem('token') || '{}')
    //获取数据
    useEffect(() => { 
       axios.get(`http://localhost:3000/news?author=${username}&auditState=0&_expand=category`).then(res => {
           const list = res.data
           setdataSource(list)
       })
    }, [username])
   


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
            dataIndex: 'categoryId',
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
                        icon={<EditOutlined />}
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<UploadOutlined />}
                    />

                   
                </div>
            }
        },
    ]
    
    
 
    return (
        <div>
            {/* contextHolder 必须放在 return 里 */}
            {contextHolder}
            {/* pageSize设置每页显示的条目数 */}
            {/* 假设每条数据都有唯一id字段 */}
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} rowKey={item=>item.id}  />
        </div>
    );
}

export default NewsDraft;