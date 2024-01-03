/** 实验登记 组件 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  message,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ExperimentType, EnrollType, UserType } from '@/types';
import { useRouter } from 'next/router';
import styles from './index.module.css'
import Content from '../Content';
import { enrollAdd, enrollUpdate } from '@/api/enroll';
import { getUserList } from '@/api/user';
import { getExperimentList } from '@/api/experiment';


function EnrollForm({editData, title}: {editData: any; title: string}) {
    const [form] = Form.useForm();
    const router = useRouter();
    const [userList, setUserList] = useState<UserType[]>([]);
    const [experimentList, setExperimentList] = useState<ExperimentType[]>([]);
    const [stock, setStock] = useState(0);
    const experimentChangeHandler = (value: any, options: any) => {
      if (value !== undefined) {
        setStock(options.stock)
      }
    }
    
    const handleFinish = async (values: EnrollType) => {
      try {
        if (editData?._id) {
          // 编辑信息
          await enrollUpdate(values);
          message.success("编辑成功");
          router.push('/enroll');
        } else {
          // 创建选择
          await enrollAdd(values);
          message.success("登记成功");
          router.push('/enroll');
        }
      } catch (error) {
        console.log(error)
      }
      
    }

    // 页面初始化时，获取实验列表和用户列表
    useEffect(() => {
      getUserList().then(res => {
        setUserList(res.data);
      });
      getExperimentList().then(res => {
        setExperimentList(res.data);
      });
    }, []);


    return (
        <Content title={title}>
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15  }}
            className={styles.form}
            layout="horizontal"
            onFinish={handleFinish}
          >
            <Form.Item label="实验名称" name="title" rules={[{ required: true, message: '请选择实验！' }]}>
              <Select 
                allowClear 
                placeholder="请选择" 
                onChange={experimentChangeHandler}
                options={experimentList.map((item) => ({
                  label: item.title,
                  value: item._id,
                  stock: item.stock,
                } 
                ))}>
              </Select>
            </Form.Item>
            
            <Form.Item label="登记被试" name="user" rules={[{ required: true, message: '请选择用户！' }]}>
              <Select 
                allowClear 
                placeholder="请选择" 
                options={userList.map((item) => ({
                  label: item.name,
                  value: item._id
                }))}
                >
              </Select>
            </Form.Item>
            
            <Form.Item label="实验所剩名额" name="stock">{stock}</Form.Item>
            
            <Form.Item label="" colon={false}>
              <Button size="large" htmlType='submit' className={styles.btn} disabled={stock <= 0}>选择</Button>
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

export default EnrollForm;