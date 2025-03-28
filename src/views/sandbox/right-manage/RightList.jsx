import React,{useState,createContext} from 'react';
import { Table ,Tag,Button,Modal,Space,Popover,Switch} from 'antd';
import { useEffect } from 'react';
import axios from 'axios';
import { DeleteOutlined,EditOutlined, StopOutlined } from '@ant-design/icons';
function RightList() {
    const ReachableContext = createContext(null);
    const UnreachableContext = createContext(null);
    const createConfig = (item) => {
        //声明confirm提示框的设置
        const config = {
            title: '您确定要删除该条目？',
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
        console.log(item)
        if (item.grade === 1) {
            //同步后端+从数据里删除,用filter方法，不改变原数组，返回一个新数组,通过item.id筛选
        axios.delete(`http://localhost:3000/rights/${item.id}`).then(() => {
            console.log('删除成功');
            // 请求成功后，更新前端数据
            setdataSource(dataSource.filter(data=>data.id!==item.id));
        })
        .catch((error) => {
            console.error('删除失败', error);
        });
        } else {
            let list = dataSource.filter(data => data.id === item.rightId)
            console.log(list)
            //从第一级列表里把children删掉,此时dataSource已经被改变了
            list[0].children = list[0].children.filter(data => data.id !== item.id)
            //此时进行setSourceData,使用展开运算符
            setdataSource([...dataSource])
            //同步后端
            axios.delete(`http://localhost:3000/children/${item.id}`)
        }
        
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
    //获取数据
    useEffect(() => { 
       axios.get('http://localhost:3000/rights?_embed=children').then(res => {
           //修改json数据children长度为0的children为空
           res.data.map(item => { item.children.length <= 0? item.children = "" :item})
           setdataSource(res.data)
       })
    }, [])
   


    const columns = [
    //在定义表格的列的地方进行样式渲染
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'name',
            render: (key) => {
                return <b>{key}</b>
            }
        }, {
            title: '权限名称',
            dataIndex: 'title',
        }, {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return   <Tag color="orange">{key}</Tag>
            }
        },{
            title: '操作',
            render: (item) => {
                // console.log(item)
                //这个item就是当前操作的那一项
                return <div>
                    <ReachableContext.Provider value="Light">
                        <Space>
                            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={async () => {
                            // 动态生成config
                            const confirmed = await modal.confirm(createConfig(item))
                            console.log('Confirmed: ', confirmed);
                        }} />
                        </Space>
                        
                    </ReachableContext.Provider>
                    <Popover content={(
                        <div>
                            <p>页面配置项</p>
                            <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)} />
                        </div>
                    )} title="Title" trigger={item.pagepermisson === undefined ? '' : 'click'}>
                        {/* 如果pagepermisson不为1，就显示编辑按钮不可用*/}
                       <Button
                        type="primary"
                        shape="circle"
                        icon={item.pagepermisson === undefined ? <StopOutlined /> : <EditOutlined />}
                        disabled={item.pagepermisson === undefined}
                    />
                    </Popover>
                   
                </div>
            }
        },
    ]
    
    
 
    return (
        <div>
            {/* contextHolder 必须放在 return 里 */}
            {contextHolder}
            {/* pageSize设置每页显示的条目数 */}
            <Table dataSource={dataSource} columns={columns} pagination={{pageSize:5}} />
        </div>
    );
}

export default RightList;