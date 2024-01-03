/** 实验添加/编辑组件 */

import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Select,
  message,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { experimentAdd } from '@/api/experiment';
import { ExperimentType } from '@/types';
import { useRouter } from 'next/router';
import styles from './index.module.css'
import dayjs from 'dayjs';
import Content from '../Content';


const { TextArea } = Input;

function ExperimentForm({title}: {title: string}) {
    const [form] = Form.useForm();
    const router = useRouter();
    
    // 点击“创建”，提交数据
    const handleFinish = async (values: ExperimentType) => {
      await experimentAdd(values);
      message.success("创建成功");
      router.push('/experiment');
    } 

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
            
            <Form.Item label="实验名称" name="title" rules={[{ required: true, message: '请输入实验名称！' }]}>
              <Input allowClear/>
            </Form.Item>
            <Form.Item label="实验内容" name="content" rules={[{ required: true, message: '请输入实验内容！' }]}>
              <TextArea allowClear rows={5}/>
            </Form.Item>
            <Form.Item label="实验时长" name="runtime">
              <Input allowClear/>
            </Form.Item>
            <Form.Item label="实验名额" name="stock">
              <Input allowClear/>
            </Form.Item>
            <Form.Item label="实验报酬" name="pay">
                <Input allowClear/>
            </Form.Item>
            <Form.Item label="实验时间" name="time" rules={[{ required: true, message: '请选择实验时间！' }]}>
              <DatePicker allowClear/>
            </Form.Item>
            
            <Form.Item label="实验地点" name="location">
              <Input allowClear/>
            </Form.Item>
            <Form.Item label="注意事项" name="notice">
              <TextArea allowClear rows={4} placeholder="请输入"/>
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

export default ExperimentForm;