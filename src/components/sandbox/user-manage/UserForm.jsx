import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

const UserForm = ({ regionList, roleList, form, initialValues }) => {
    const SUPER_ADMIN_ROLE_ID = 1; // 超级管理员角色ID
    const [isDisabled, setIsDisabled] = useState(false); // 控制区域选择框是否禁用

   //监听 roleId 变化，自动更新 isDisabled 状态
   //这样可以确保 roleId 变化时，isDisabled 状态始终同步，避免 setIsDisabled 在 onChange 里可能出现的异步更新问题
    useEffect(() => {
        const roleId = form.getFieldValue("roleId");
        setIsDisabled(roleId === SUPER_ADMIN_ROLE_ID);
    }, [form])
     // 设置初始值
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [form, initialValues]);
    const token = JSON.parse(localStorage.getItem("token")) || {};
    const roleId = token.roleId; // 直接访问 token.roleId
    const region = token.region;
    const isSuperAdmin = roleId === 1; // 超级管理员
    const isAdmin = roleId === 2;      // 区域管理员
    const isEditor = roleId === 3;     // 编辑


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
                            setIsDisabled(true);
                            form.setFieldsValue({ region: "" });
                        } else {
                            setIsDisabled(false);
                        }
                    }}
                    style={{ width: 120 }}
                    options={roleList
                        ?.filter(item => {
                            // 超级管理员可以看到所有角色
                            if (isSuperAdmin) return true;
                            
                            // 区域管理员可以看到区域管理员(2)和编辑(3)
                            if (isAdmin) return item.id >= 2 && item.id <= 3;
                            
                            // 编辑只能看到编辑(3)
                            if (isEditor) return item.id === 3;
                            
                            // 默认情况下不显示任何角色
                            return false;
                        })
                        .map((item) => ({
                            value: item.id,
                            label: item.roleName,
                        }))}
                    //仅超级管理员和区域管理员可修改
                     disabled={!isSuperAdmin && roleId !== 2} // 仅超级管理员和区域管理员可修改
                />
            </Form.Item>

            {/* 区域选择框 */}
            <Form.Item
                name="region"
                label="区域"
                rules={isDisabled ? [] : [{ required: true, message: "请选择区域！" }]}
            >
                <Select
                    disabled={isDisabled || (!isSuperAdmin && roleId !== 2)} // 根据 isDisabled 状态决定是否禁用
                    style={{ width: 120 }}
                     options={regionList
                        ?.filter(item => 
                            isAdmin 
                            ? item.value === region // 区域管理员只能选择自己所在的区域
                                : true // 其他用户可以看到所有区域

                    )
                        .map((item) => ({
                            value: item.value,
                            label: item.title,
                    }))}
                />
            </Form.Item>
        </>
    );
};

export default UserForm;
