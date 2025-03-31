import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

const UserForm = ({ regionList, roleList, form, }) => {
    const SUPER_ADMIN_ROLE_ID = 1; // 超级管理员角色ID
    const [isDisabled, setIsDisabled] = useState(false); // 控制区域选择框是否禁用

  //监听 roleId 变化，自动更新 isDisabled 状态
  //这样可以确保 roleId 变化时，isDisabled 状态始终同步，避免 setIsDisabled 在 onChange 里可能出现的异步更新问题
    useEffect(() => {
        const roleId = form.getFieldValue("roleId");
        setIsDisabled(roleId === SUPER_ADMIN_ROLE_ID);
    }, [form]);

    return (
        <>
            {/* 用户名输入框 */}
            <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: "请输入用户名！" }]}
            >
                <Input />
            </Form.Item>

            {/* 密码输入框 */}
            <Form.Item
                name="password"
                label="密码"
                rules={[{ required: true, message: "请输入密码！" }]}
            >
                <Input.Password />
        </Form.Item>
          {/* 密码确认框 */}
            <Form.Item
                name="confirmpassword"
                label="确认密码"
                dependencies={['password']} // 依赖密码字段，确保在密码变化时重新验证
                 rules={[
                  { required: true, message: "请输入确认密码！" },
                  ({ getFieldValue }) => ({
                      validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                              return Promise.resolve(); // 如果确认密码为空或与密码一致，验证通过
                          }
                          return Promise.reject(new Error('确认密码与密码不一致！'));
                      },
                  }),
              ]}
            >
                <Input.Password />
            </Form.Item>

            {/* 角色选择框 */}
            <Form.Item
                name="roleId"
                label="角色"
                rules={[{ required: true, message: "请选择角色！" }]}
            >
                <Select
                    onChange={(value) => {
                        if (value === SUPER_ADMIN_ROLE_ID) {
                            setIsDisabled(true); // 如果选择了超级管理员，禁用区域选择框
                            form.setFieldsValue({ region: "" }); // 清空区域字段
                        } else {
                            setIsDisabled(false); // 其他角色允许选择区域
                        }
                    }}
                    style={{ width: 120 }}
                    options={roleList?.map((item) => ({
                        value: item.id,
                        label: item.roleName,
                    }))}
                />
            </Form.Item>

            {/* 区域选择框 */}
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [{ required: true, message: "请选择区域！" }]}
            >
                <Select
                    disabled={isDisabled} // 根据 isDisabled 状态决定是否禁用
                    style={{ width: 120 }}
                    options={regionList?.map((item) => ({
                        value: item.value,
                        label: item.title,
                    }))}
                />
            </Form.Item>
        </>
    );
};

export default UserForm;
