/** 用户列表添加组件 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Select,
  message,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useRouter } from 'next/router';
import styles from './index.module.css'
import Content from '../Content';
import { userAdd, getUserList, userUpdate } from '@/api/user';
import { UserType } from '@/types';
import { USER_STATUS, USER_ROLE, USER_SEX } from '@/constant/user';


function UserForm({
  title, 
  editData={
    sex: USER_SEX.MALE,
    role: USER_ROLE.USER,
    status: USER_STATUS.ON },
  }: {
    title: string;
    editData?: Partial<UserType>
  }) {

    const [form] = Form.useForm();
    const router = useRouter();
    const [value, setValue] = useState(1);
    const onChange = (e: RadioChangeEvent) => {
      setValue(e.target.value);
    };

    useEffect(() => {
      if (editData._id) {
        form.setFieldsValue(editData);
      }
    }, [editData, form])

    // 创建用户
    const handleFinish = async (values: UserType) => {
      if (editData?._id) {
        // 若已存在
        await userUpdate(values);
      } else {
        // 不存在，则创建
        await userAdd(values);
        message.success("创建成功");
        router.push('/user');
      }
    }

    return (
        <Content title={title}>
          
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20  }}
            className={styles.form}
            layout="horizontal"
            onFinish={handleFinish}
            initialValues={editData}
          >
            <Form.Item label="学工号" name="idNum" rules={[{ required: true, message: '请输入学工号！' }]}>
              <Input allowClear placeholder="请输入学工号"/>
            </Form.Item>

            <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名！' }]}>
              <Input allowClear placeholder="请输入姓名"/>
            </Form.Item>

            <Form.Item label="性别" name="sex">
              <Radio.Group>
                <Radio value="male">男</Radio>
                <Radio value="female">女</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码！' }]}>
              <Input.Password
                allowClear
                placeholder="请输入密码"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Radio.Group>
                <Radio value="on">启用</Radio>
                <Radio value="off">禁用</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="角色" name="role">
              <Radio.Group>
                <Radio value="user">用户</Radio>
                <Radio value="admin">管理员</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="" colon={false}>
              <Button size="large" htmlType='submit' className={styles.btn}>创建</Button>
            </Form.Item>
          </Form>
        </Content>
      );
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default UserForm;