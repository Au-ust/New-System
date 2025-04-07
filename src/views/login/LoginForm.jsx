
import './Login.css'
import { createStyles } from 'antd-style';
import { AntDesignOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Space, Form, Input, Checkbox, message, } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

function LoginForm() {
    const navigate = useNavigate();
    const onFinish = (values) => {
      console.log('Success:', values);
      axios.get(`/users?username=${values.username}&password=${values.password}&roleType=true&_expand=role`)
        .then(res => {
            console.log(res.data)
            if (res.data.length === 0) {
                message.error('用户名或密码不匹配')
            } else {
                localStorage.setItem('token', JSON.stringify(res.data[0]))
                navigate("/");
            }
        
      })
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }
 
    const useStyle = createStyles(({ prefixCls, css }) => ({
    linearGradientButton: css`
      &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
        > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
    }))
       const { styles } = useStyle();
  return (
    <div>
    
            <div className='formContainer'>
                <div className='login-title'>全球新闻管理系统</div>
            <Form
           
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
            label="Username"
            name="username"
            rules={[
                {
                required: true,
                message: '请输入用户名！',
                },
            ]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Password"
            name="password"
            rules={[
                {
                required: true,
                message: '请输入密码',
                },
            ]}
            >
            <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Form.Item label={null}>
              <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <Space>
        <Button type="primary" size="large" icon={<AntDesignOutlined />} htmlType="submit">
          登录
        </Button>
      </Space>
    </ConfigProvider>
            </Form.Item>
        </Form>
        </div>
      </div>
    )
}

export default LoginForm