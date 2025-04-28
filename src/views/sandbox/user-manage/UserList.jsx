import React,{useState,createContext} from 'react'
import { Table ,Button,Modal,Space,Form,Switch} from 'antd'
import { useEffect } from 'react'
import axios from 'axios'
import UserForm from '../../../components/sandbox/user-manage/UserForm'
import { DeleteOutlined,EditOutlined, StopOutlined } from '@ant-design/icons'
function UserList() {
    const ReachableContext = createContext(null);
    const createConfig = (item) => {
        //声明confirm提示框的设置
        const config = {
            title: '您确定要删除该条目？',
            content: `即将删除：${item.username}`,
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
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`http://localhost:3000/users/${item.id}`)
    }
    
    const [dataSource, setdataSource] = useState([])
    const [modal, contextHolder] = Modal.useModal();
    
    const [roleList,setroleList]=useState([])
    const [regionList,setregionList]=useState([])
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm(); //创建antd的form实例
    
    const [updateform] = Form.useForm(); //创建antd的updateform实例
    const token = JSON.parse(localStorage.getItem("token")) || {};
    const roleId = token.roleId; // 直接访问 token.roleId
    const region = token.region || "";// 直接访问 token.region
    const isSuperAdmin = roleId === 1; // 超级管理员
    const isAdmin = roleId === 2;      // 区域管理员
    const isEditor = roleId === 3;     // 编辑

// 调试日志
console.log("权限状态:", { roleId, region, isSuperAdmin, isAdmin, isEditor });

// 根据权限过滤数据源
useEffect(() => {
  axios.get('http://localhost:3000/users?_expand=role').then(res => {
    let filteredData = res.data;
    
    // 超级管理员：查看所有用户
    if (isSuperAdmin) {
      console.log("超级管理员看到全部数据", res.data);
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
    
    setdataSource(filteredData);
  });
}, [isAdmin, isEditor, region, isSuperAdmin]);
   //异步操作确保操作顺序
   const handleChange = async (item) => {
        try {
            const newRoleState = !item.roleState;
            
            // 更新后端
            const response = await axios.patch(`http://localhost:3000/users/${item.id}`, {
                roleState: newRoleState
            });
            
            // 更新前端状态
            if (response.status === 200) {
                //prev 代表更新前的用户数据列表。map() 方法用来遍历每个用户数据,更新当前编辑的用户数据
                setdataSource(prev => prev.map(data => 
                    data.id === item.id ? { ...data, roleState: newRoleState } : data
                ));
            }
        } catch (error) {
            console.error("更新失败:", error);
            Modal.error({
                title: '更新失败',
                content: error.message
            });
        }
    }
    //编辑的函数
    const handleUpdate = (item) => {
        setCurrentEditUser(item);
        setisUpdate(true);
        
        // 清空表单后再设置新值（避免残留状态）
        updateform.resetFields();
        
        // 确保在模态框渲染后设置值
        setTimeout(() => {
            updateform.setFieldsValue({
            username: item.username,
            password: item.password,
            confirmpassword: item.password,
            region: item.region, // 确保使用原始值
            roleId: item.role?.id
            });
        }, 0);
    };

    const columns = [
    //在定义表格的列的地方进行样式渲染
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                //筛选模块
                ...regionList.map(item => ({
                    text: item.title,
                    value:item.value
                })),{
                    text:'全球',
                    value:'全球'
                }
            ],
            filterMultiple: true, // 启用多选
            onFilter: (value, item) =>  value==='全球'?item.region==='':item.region===value,
            render: (region) => {
                return <b>{region===''?'全球':region}</b>
            }
        }, {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role.roleName
            }
        }, {
            title: '用户名',
            dataIndex: 'username',
        },{
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                //item就是当前的对象，所以也可以用item获取
                return <Switch checked={roleState} disabled={item.default}
                onChange={()=>handleChange(item)}
                ></Switch>
            }
        },{
            title: '操作',
            render: (item) => {
                // console.log(item)
                //这个item就是当前操作的那一项
                return <div>
                    <ReachableContext.Provider value="Light">
                        <Space>
                            <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            // 动态生成config
                            const confirmed = modal.confirm(createConfig(item))
                            console.log('Confirmed: ', confirmed);
                            }}
                            disabled={item.default}    />
                        </Space>
                        
                    </ReachableContext.Provider>
                       <Button
                        type="primary"
                        shape="circle"
                        icon={<EditOutlined />}
                        disabled={item.default}
                        onClick={() =>handleUpdate(item)}
                    />
                </div>
            }
        },
    ]
    
    
 
    //获取区域数据
    useEffect(() => { 
       axios.get('http://localhost:3000/regions').then(res => {
           setregionList(res.data)
       })
    }, [])
    
    //获取角色数据
    useEffect(() => { 
       axios.get('http://localhost:3000/roles').then(res => {
           setroleList(res.data)
       })
    }, [])
    // 表单提交处理函数
    const handleSubmit = () => {
        form.validateFields()
            .then(values => {
                console.log('表单数据:', values);
                // 在这里提交表单数据到后端
                axios.post('http://localhost:3000/users', values)
                    .then(res => {
                        console.log('用户添加成功:', res.data);
                        setOpen(false);
                        form.resetFields(); // 重置表单
                        // 刷新用户列表
                        axios.get('http://localhost:3000/users?_expand=role').then(res => {
                            setdataSource(res.data);
                        });
                    })
                    .catch(err => {
                        console.error('添加用户失败:', err);
                    });
            })
            .catch(err => {
                console.log('表单验证失败:', err);
            });
    }
    //编辑模态框内部的函数和变量
    const [isUpdate, setisUpdate] = useState(false)
    // 添加当前编辑用户的状态
    const [currentEditUser, setCurrentEditUser] = useState(null)
    const updateFormOk = async () => {
    try {
        const values = await updateform.validateFields();
        console.log('更新的用户信息:', values);

        // 发送更新请求
        const response = await axios.patch(`http://localhost:3000/users/${currentEditUser.id}`, values);

        if (response.status === 200) {
            setdataSource(prev => prev.map(user => 
                user.id === currentEditUser.id ? { ...user, ...values } : user
            ));
            setisUpdate(false);
        }
    } catch (error) {
        console.error('更新失败:', error);
    }
};

    return (
        <div>
            <Button type='primary'onClick={()=>{setOpen(true)}}>添加用户</Button>
            {/* contextHolder 必须放在 return 里 */}
            {contextHolder}
            {/* pageSize设置每页显示的条目数 */}
            <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{pageSize:5}} />
            <Modal
                open={open}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setOpen(false);
                   form.resetFields() // 关闭时重置表单
                }}
                onOk={handleSubmit} // 绑定提交处理函数
                destroyOnClose
                modalRender={(dom) => (
                <Form
                        // 垂直布局
                        layout="vertical"
                        form={form} // 将form实例传递给Form组件
                >
                    {dom}
            </Form>
        )}
      >
            <UserForm regionList={regionList} roleList={roleList} form={form}></UserForm>
            {/* 编辑按钮的模态框 */}
            </Modal>
            <Modal
                open={isUpdate}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setisUpdate(false);
                    updateform.resetFields(); // 关闭时重置表单
                }}
                onOk={updateFormOk} // 绑定提交处理函数
                destroyOnClose
                forceRender // 关键属性：强制渲染DOM
                modalRender={(dom) => (
                <Form
                    // 垂直布局
                    layout="vertical"
                    form={updateform} // 将form实例传递给Form组件
                >
                    {dom}
            </Form>
        )}
      >
                <UserForm
                    regionList={regionList}
                    roleList={roleList}
                    form={updateform}
                    initialValues={{
                        region: isAdmin ? region : undefined // 区域管理员默认选择自己的区域
                    }}></UserForm>
            </Modal>
      </div>
    )
}

export default UserList;