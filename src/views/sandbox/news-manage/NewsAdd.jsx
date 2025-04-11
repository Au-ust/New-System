import { Steps, Button, Input, Form, Select, message ,notification,} from 'antd';
import React, { useEffect, useState } from 'react';
import { EditOutlined, UploadOutlined, FormOutlined } from '@ant-design/icons';
import style from './News.module.css';
import NewEditor from '../../../components/news-manage/NewsEditor';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';

const { Option } = Select;
// 提取空内容判断函数
const isEditorEmpty = (content) => {
  return !content || 
         content.replace(/<[^>]*>|&nbsp;/g, '').trim() === '' ||
         ['<p></p>', '<p><br></p>'].includes(content);
};
function NewsAdd() {
    const [current, setCurrent] = useState(0)//存储当前在第几步
    const [categoryList, setCategoryList] = useState([])//存储拉取的分类条目
    const [form] = Form.useForm(); // 使用 Form 的 hook
    const [formInfo,setformInfo] = useState({}); // 用于存储表单数据
    const [editorContent, setEditorContent] = useState(''); // 用于存储文本编辑器内容
    const [api, contextHolder] = notification.useNotification(); // 使用 notification API
    const navigate = useNavigate(); // 使用 useNavigate Hook
    const [notificationData, setNotificationData] = useState(null);
    const handleNext = () => {
        if (current === 0) {
            // 提交并验证表单,用form实例来验证
            form.validateFields()
                .then((res) => {
                    setformInfo(res)
                    setCurrent(current + 1)
                })
                .catch(err => {
                    console.log('验证失败:', err)
                })
        } else if (isEditorEmpty(editorContent)) {
            message.error('请输入新闻内容！');
        } else {
            setCurrent(current + 1);
        }
    }
    const handlePrev = () => {
        setCurrent(current - 1);
    }

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    }
    const handleSave = async (auditState) => { 
        //  console.log("handleSave 被调用了");
        try {
            await  axios.post('http://localhost:3000/news', {
            ...formInfo,
            content: editorContent,
            region: localStorage.getItem('region') ? localStorage.getItem('region') : '全球', // 获取地区
            author: localStorage.getItem('username'), // 获取作者
            roleId: localStorage.getItem('roleId'), // 获取角色ID
            auditState: auditState, // 审核状态
            publishState: 0, // 发布状态
            createTime: Date.now(), // 创建时间
            star: 0, // 点赞数
            view: 0,// 浏览量
            // publishTime: 0, // 发布时间
        } ) 
           api.success({
            message: '操作成功',
            description: `已${auditState === 0 ? '保存到草稿箱' : '提交审核'}`,
            placement: 'bottomRight',
        });

        // ⏳ **延迟 500ms 再跳转，确保用户能看到通知**
        setTimeout(() => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');
        }, 500);
        
    } catch (error) {
        api.error({
            message: '操作失败',
            description: error.response?.data?.message || error.message,
            placement: 'bottomRight',
        });
    }
};

    // 处理通知数据
    useEffect(() => {
        console.log('notificationData updated:', notificationData); // 添加这行
        console.log('API:', api);
        if (notificationData) {
            const { type, ...rest } = notificationData; // 解构，去掉 type
            api[type || 'info'](rest);
            setNotificationData(null);
}
    }, [notificationData]);
    useEffect(() => {
        axios.get('http://localhost:3000/categories')
            .then(res => setCategoryList(res.data))
            .catch(err => console.error('获取分类失败:', err));
    }, []); // 添加空依赖数组，避免重复请求

    return (
        <div>
            {contextHolder} {/* 必须添加 */}
            <h2 className='news-title'>撰写新闻</h2>
            <Steps
                current={current} // 使用 current 状态控制步骤
                items={[
                    {
                        title: '基本信息',
                        description: '新闻标题、新闻分类',
                        icon: <FormOutlined />,
                    },
                    {
                        title: '新闻内容',
                        description: '新闻主题内容',
                        icon: <EditOutlined />,
                    },
                    {
                        title: '新闻提交',
                        description: '保存草稿或者提交审核',
                        icon: <UploadOutlined />,
                    },
                ]}
            />

            <div style={{ marginTop: '50px' }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        {...layout}
                        form={form} // 绑定 form 实例
                        name="basic"
                        style={{ maxWidth: 600 }}
                    >
                        <Form.Item
                            name="title"
                            label="新闻标题"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的新闻标题',
                                },
                            ]}
                        >
                            <Input placeholder="输入您的新闻标题" />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="新闻分类"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择您的新闻分类!',
                                },
                            ]}
                        >
                            <Select placeholder="选择您的新闻分类" allowClear>
                                {categoryList.map(item => (
                                    <Option value={item.value} key={item.id}>
                                        {item.title}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            <div className={current === 1 ? '' : style.active}>
                <NewEditor
                    getCurrentContent={(value) => {
                    console.log('编辑器内容更新:', value) // 调试用
                    setEditorContent(value)
                    }}
                />
            </div>

            <div className={current === 2 ? '' : style.active}>
                <Input placeholder="Basic usage" />
            </div>

            <div style={{ marginTop: '30px' }}>
                {current > 0 && (
                    <Button style={{ marginRight: 8 }} onClick={handlePrev}>
                        上一步
                    </Button>
                )}
                {current < 2 && (
                    <Button type="primary" onClick={handleNext}>
                        下一步
                    </Button>
                )}
                {current === 2 && (
                    <>
                        <Button type="primary" style={{ marginRight: 8 }} onClick={()=>handleSave(0)}>
                            保存草稿箱
                        </Button>
                        <Button type="primary" danger onClick={()=>handleSave(1)}>
                            提交审核
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default NewsAdd;