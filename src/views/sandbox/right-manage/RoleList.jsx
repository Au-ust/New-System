import React, { useState ,useEffect,createContext} from 'react'
import axios from 'axios'
import { DeleteOutlined, UnorderedListOutlined , StopOutlined } from '@ant-design/icons';
import { Table, Tag, Button, Modal, Space, Tree } from 'antd';
import RightList from './RightList';

function RoleList() {
    const ReachableContext = createContext(null);
    const [dataSource, setdataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRights, setcurrentRights] = useState([])
    const [currentId, setcurrentId] = useState(0)
    const [modal, contextHolder] = Modal.useModal();
    const createConfig = (item) => {
        //声明confirm提示框的设置
        const config = {
            title: '您确定要删除该条目？',
            content: `即将删除：${item.roleName}`,
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
            //同步后端+从数据里删除,用filter方法，不改变原数组，返回一个新数组,通过item.id筛选
        axios.delete(`http://localhost:3000/roles/${item.id}`).then(() => {
            console.log('删除成功');
            // 请求成功后，更新前端数据
            setdataSource(dataSource.filter(data=>data.id!==item.id));
        })
        .catch((error) => {
            console.error('删除失败', error);
        })
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    //展示的处理函数
    const showModal = () => {
        setIsModalOpen(true);
    }
    //成功的处理函数,使用 async/await 确保操作顺序
    const handleOk = async () => {
        try {
            // 先更新后端
            await axios.patch(`http://localhost:3000/roles/${currentId}`, {
                rights: currentRights
            });

            // 再更新前端
            setdataSource(dataSource.map(item => 
                item.id === currentId 
                    ? { ...item, rights: currentRights } 
                    : item
            ))
            setIsModalOpen(false);
        } catch (error) {
            message.error('权限更新失败');
            console.error(error);
        }
    };

    //取消的处理函数
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onCheck = (checkKeys) => {
        //更改角色的权限选择,赋值，修改状态
        setcurrentRights(checkKeys.checked)
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return  <b>{id}</b>
            }
        }, {
            title: '角色名称',
            dataIndex: 'roleName',
        }, {
            title: '操作',
            render: (item) => {
                // console.log(item)
                //这个item就是当前操作的那一项
                return <div>
                    <ReachableContext.Provider value="Light">
                        <Space>
                            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => {
                                const config = createConfig(item); // 先获取配置对象
                                modal.confirm(config); // 直接传入 modal.confirm
                            }} />
                        </Space>
                        
                    </ReachableContext.Provider>
                    <Button type="primary" shape="circle" onClick={() => {
                        showModal()
                        setcurrentRights(item.rights)
                        setcurrentId(item.id)
                    }} icon={<UnorderedListOutlined/>}>
                    </Button>
                    <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                           <Tree
                            checkable
                            //使用受控控制不同角色的权限
                            checkedKeys={currentRights}
                            //点击复选框触发
                            onCheck={onCheck}
                            //控制树的子节点不和父节点关联
                            checkStrictly={true}
                            treeData={rightList}
                            />
                    </Modal>
                   
                </div>
            }
        },
    ]
  

    useEffect(() => {
         // 获取角色列表
        axios.get('http://localhost:3000/roles').then(res => {
            setdataSource(res.data);
        });

        // 获取权限列表
        axios.get('http://localhost:3000/rights?_embed=children').then(res => {
            //把获取到的数据转为需要的Tree格式
            const formattedData = res.data.map(item => ({
                title: item.title,
                key: item.key,
                children: item.children?.map(child => ({
                    title: child.title,
                    key: child.key
                })) || []
            }));
            setRightList(formattedData);
        })
    }, [])
    return (
        <div>
            {/* contextHolder 必须放在 return 里 */}
            {contextHolder}
            <Table dataSource={dataSource} columns={columns} rowKey={(item)=>item.id}></Table>
        </div>
    );
}

export default RoleList;