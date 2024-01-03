// 登陆界面样式布局

import { Inter } from 'next/font/google';
import styles from './index.module.css';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { userLogin } from '@/api/user';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Login() {
  const router = useRouter();
  const handleFinish = async (values: {
    idNum: string;
    password: string
  }) => {
    try {
      const res = await userLogin(values);
      
      if (res.success) { 
        message.success("登陆成功");
        router.push('/experiment');
      } else {
        message.error('登录失败：' + res); // 替换为实际的错误属性
      }
    } catch (error) {
      console.error('登录请求失败：', error);
      message.error('登录请求失败，请稍后重试');
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>实验管理系统</h1>
        <Form 
         onFinish={handleFinish}
        >
          <Form.Item name="idNum" rules={[{ required: true, message: '请输入学工号！' }]}>
            <Input 
              allowClear
              size="large" 
              placeholder="请输入学工号" 
              prefix={<UserOutlined />} 
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
            <Input.Password
              allowClear
              size="large" 
              placeholder="请输入密码" 
              prefix={<KeyOutlined />} 
            />
          </Form.Item>
          <Form.Item>
            <Button 
              className={styles.btn} 
              htmlType='submit'
              size='large'
            >
              登陆
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    
  )
}