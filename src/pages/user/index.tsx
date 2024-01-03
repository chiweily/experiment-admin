// “用户管理”主页

import { Inter } from 'next/font/google'
import { Form, Button, Input, Select, Space, Row, Col, Table, Pagination, TablePaginationConfig, Tooltip, message, Modal, Tag} from 'antd'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './index.module.css';
import dayjs from 'dayjs';
import { getExperimentList } from '@/api/experiment'
import { UserType, UserQueryType } from '@/types';
import Content from '@/components/Content';
import { getUserList, userDelete, userUpdate } from '@/api/user';
import error from 'next/error';

const inter = Inter({ subsets: ['latin'] })

// 用户表单列表头
const COLUMNS = [
  {
    title: '学工号',
    dataIndex: 'idNum',
    key: 'idNum',
    width: 140
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 140
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 140,
    render: (text: string) => {
      return text === STATUS.ON ? (<Tag color='red'>禁用</Tag>) : (<Tag color='green'>正常</Tag>)
    } 
  }
];

// 用户状态
const STATUS = {
  ON: 'on',
  OFF: 'off'
}

// 用户状态数据
const STATUS_OPTIONS = [
    {
      label: "正常",
      value: STATUS.ON
    },
    {
      label: "禁用",
      value: STATUS.OFF
    }
];


export default function User() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([]);

  const [experimentList, setExperimentList] = useState([]);
  const [userList, setUserList] = useState<any[]>([]);

  // 先获取数据
  async function fetchData(search?: UserQueryType) {
    const res = await getUserList({
      current: pagination.current, 
      pageSize: pagination.pageSize, 
      ...search
  });
  setData(res.data);
    // 每次fetchData后都需要更新pagination
    setPagination({...pagination, total: res.total})
  }
  
  useEffect(() => {
    fetchData();
    // 获取所有实验名称
    getExperimentList({all: true}).then(
      res=> {
        setExperimentList(res.data);
      }
    );
  }, []);
  

  // 设置分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
    total: 0
  })
  // 双向绑定：页面条目数下拉框选择条目数与页面条目的呈现
  const paginationChangeHandler = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current || 1,  
      pageSize: newPagination.pageSize || 10,
      showSizeChanger: newPagination.showSizeChanger || true,
      total: newPagination.total || 0
    });
    // 分页改变，随即list也改变
    const query = form.getFieldsValue()
    getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    });
  }; 

  // 搜索登记
  const searchHandler = async (values: UserQueryType) => {
    const res = await getUserList({
      ...values, 
      current:1, 
      pageSize: pagination.pageSize
    })
    setData(res.data)
    setPagination({
      ...pagination, 
      current: 1, 
      total: res.total
    })
  }

  // 获取表单实例
  const [searchForm] = Form.useForm();
  const editUserHandler = (id: string) => {
    router.push(`/user/edit/${id}`)
  }
 
  const deleteUserHandler = async (id: string) => {
    Modal.confirm({
      title: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      async onOk(...args) {
        /* 删除接口 */
        await userDelete(id);
        message.success("删除成功！");
        fetchData(form.getFieldsValue());
      },
  
    })
  }

  // “禁用”“启用”状态切换
  const statusChangeHandler = async (row: UserType) => {
    // 获取用户状态
    /* const status = row.status === STATUS.ON ? STATUS.OFF : STATUS.ON; */
    const status: "on" | "off" = row.status === "on" ? "off" : "on";
    await userUpdate({
      ...row,
      status
    });
    // 更新列表数据
    fetchData(form.getFieldsValue());
  }

  // 添加“编辑”“禁用/启用”“删除”按钮
  const columns = [...COLUMNS, 
    {
      title:'操作',
      key:'action',
      render:(_:any, row:any) => {
          return (
            <>
              <Button 
                type='link' 
                onClick={() => {editUserHandler(row._id)}}>
                  编辑
              </Button>

              <Button 
                type='link' 
                danger={row.status === STATUS.ON ? true : false}
                onClick={() => {statusChangeHandler(row)}}>
                  {row.status === STATUS.ON ? "启用" : "禁用"}
              </Button>

              <Button 
                type='link' 
                danger 
                onClick={()=>deleteUserHandler(row._id)}>
                删除
              </Button>
            </>
          )
        }
    }]

  return (
    <Content title="用户列表" operation={
      <Button onClick={() => {router.push('/user/add')}}>
        添加
      </Button>
    }>
      <Form
        name="searchUser"
        form={searchForm}
        onFinish={searchHandler}
        initialValues={{
          name:'',
          status:''
        }}
    >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="姓名">
              <Input placeholder="请输入" allowClear /> 
            </Form.Item>
          </Col>

          <Col span={5}>
          <Form.Item name="status" label="状态">
            <Select allowClear options={STATUS_OPTIONS}></Select>
          </Form.Item>
          </Col>

          <Col span={9}>
          <Form.Item>
            <Space>
              <Button type="default" htmlType="submit">
                搜索
              </Button>
            </Space>
          </Form.Item>
          </Col>
        </Row>
      </Form>
    <div className={styles.tablewrap}>
      <Table 
        dataSource={data} 
        columns={columns} 
        scroll={{x: 1000}}
        pagination={{...pagination, showTotal: () => `共${pagination.total}条`}}
        onChange={paginationChangeHandler}
      />
    </div>
    </Content>
  )
}