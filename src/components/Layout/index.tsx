// 整体布局 layout

import React, { PropsWithChildren } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout as AntdLayout, Menu, Dropdown, Space, message } from 'antd';
import styles from './index.module.css';
import Link from 'next/link';
import { userLogout } from '@/api/user';

const { Header, Content, Sider } = AntdLayout;

// 左侧菜单栏
const ITEMS: MenuProps['items'] = [
  {
    label: "实验管理",
    key: "experiment",
    children: [
      {
        label: "实验列表",
        key: "/experiment",
      }, 
      {
        label: "添加实验",
        key: "/experiment/add",
      }
    ]
  },
  {
    label: "实验选择",
    key: "enroll",
    children: [
      {
        label: "实验登记列表",
        key: "/enroll",
      }, 
      {
        label: "选择实验",
        key: "/enroll/add",
      }
    ]
  },
  {
    label: "用户管理",
    key: "user",
    children: [
      {
        label: "用户列表",
        key: "/user",
      }, 
      {
        label: "添加用户",
        key: "/user/add",
      }
    ]
  }
]

export const Layout: React.FC<PropsWithChildren> = ({children}) => {
  const router = useRouter();
  // 设置下拉菜单
  const USER_ITEMS: MenuProps['items'] = [
    {
      key: '1',
      label: <Link href='/user'>用户中心</Link>
    },
    {
      key: '2',
      label: <span onClick={async() => {
        await userLogout();
        // TODO: 二次确认
        message.success('退出成功');
        router.push('/login');
      }}>
        退出
      </span>
    }
  ]
  // 获取被点击的菜单项的key
  const handleMenuClick: MenuProps['onClick'] = ({key}) => {
    router.push(key);
  }

  const activeMenu = router.pathname;
    return (
        <AntdLayout>
            <Header className={styles.header}>
              <Image 
                  className={styles.logo}
                  alt='logo' 
                  src='/logoWhite.png'
                  width={180}
                  height={70}
              />
              <span className={styles.logoname}>
                实验管理系统
              </span>

              <span className={styles.dropmenu}>
                <Dropdown menu={{items: USER_ITEMS}}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      用户名
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </span>
            </Header>

            <AntdLayout className={styles.sectionInner}>

                <Sider width={220}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['experiment']}
                  defaultOpenKeys={['experiment']}
                  style={{ height: '100%', borderRight: 0 }}
                  selectedKeys={[activeMenu]}
                  items={ITEMS}
                  onClick={handleMenuClick}
                /> 
                </Sider>
                
                <AntdLayout className={styles.sectionContent}>
                  <Content className={styles.content}>
                      {children}
                  </Content>
                </AntdLayout>
            </AntdLayout>
    </AntdLayout>
    )
}