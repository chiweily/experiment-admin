// 实验登记主页

import { Inter } from 'next/font/google'
import { Form, Button, Input, Select, Space, Row, Col, Table, Pagination, TablePaginationConfig, Tooltip, message, Modal, Tag} from 'antd'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './index.module.css';
import dayjs from 'dayjs';
import { getExperimentList } from '@/api/experiment';
import { EnrollQueryType, ExperimentType, EnrollType } from '@/types';
import Content from '@/components/Content';
import { getEnrollList, enrollDelete } from '@/api/enroll';

const inter = Inter({ subsets: ['latin'] })

// 实验登记表单列表头
const COLUMNS = [
  {
    title: '实验名称',
    dataIndex: 'expName',
    key: 'expName',
    width: 140
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 140,
    render: (text: string) => {
      return text === 'on' ? (<Tag color='green'>进行中</Tag>) : (<Tag color='red'>已结束</Tag>)
    }
  },  
  {
    title: '被试',
    dataIndex: 'enrollUser',
    key: 'enrollUser',
    width: 120
  },
  {
    title: '登记时间',
    dataIndex: 'enrollAt',
    key: 'enrollAt',
    width: 120,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD')
  }
];

// 实验状态数据
const STATUS_OPTIONS = [
    {
      label: "进行中",
      value: "on"
    },
    {
      label: "已结束",
      value: "off"
    }
];


export default function Enroll() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([]);

  const [experimentList, setExperimentList] = useState<ExperimentType[]>([]);
  const [userList, setUserList] = useState<any[]>([]);

  // 获取数据
  async function fetchData(search?: EnrollQueryType) {
    const res = await getEnrollList({
      current: pagination.current, 
      pageSize: pagination.pageSize, 
      ...search
  });
    const newData = res.data.map((item: EnrollType) => ({
      ...item,
      expName: item.experiment.title,
      enrollUser: item.user.name
    }))
    setData(newData);
    setPagination({...pagination, total: res.toal})
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
   
    const query = form.getFieldsValue()
    getEnrollList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    });
  }; 


  // 搜索登记
  const searchHandler = async (values: EnrollQueryType) => {
    const res = await getEnrollList({
      ...values, 
      current:1, 
      pageSize: pagination.pageSize
    })

    const newData = res.data.map((item: EnrollType) => ({
      ...item,
      expName: item.experiment.title,
      enrollUser: item.user.name
    }))
    setData(newData)
    setPagination({
      ...pagination, 
      current: 1, 
      total: res.toal
    })
  }

  // 获取表单实例
  const [searchForm] = Form.useForm();
  
  const editEnrollHandler = (id: string) => {
    router.push(`/enroll/edit/${id}`)
  }
  // 删除登记操作
  const deleteEnrollHandler = async (id: any) => {
    Modal.confirm({
      title: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      async onOk(...args) {
        await enrollDelete(id);
        message.success("删除成功！");
        fetchData(form.getFieldsValue());
      },
    })
  }

  // 添加“删除”和“编辑”按钮
  const columns = [...COLUMNS, 
    {
      title:'操作',
      key:'action',
      render:(_:any, row:any) => {
          return (
            <>
              <Button 
                type='link' 
                danger 
                onClick={()=>deleteEnrollHandler(row._id)}>
                删除
              </Button>
            </>
          )
        }
    }]

  return (
    <Content title="登记列表" operation={
      <Button onClick={() => {router.push('/enroll/add')}}>
        添加
      </Button>
    }>
      <Form
        name="searchEnroll"
        form={searchForm}
        onFinish={searchHandler}
        initialValues={{
          name:'',
          author:'',
          category:''
        }}
    >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="name" label="实验名称">
              <Select 
                allowClear 
                showSearch 
                optionFilterProp="label" 
                options={experimentList.map(item => ({label: item.title, value: item._id}))}>
              </Select>
            </Form.Item>
          </Col>

          <Col span={5}>
          <Form.Item name="status" label="状态">
            <Select allowClear options={STATUS_OPTIONS}></Select>
          </Form.Item>
          </Col>

          <Col span={5}>
          <Form.Item name="user" label="登记人">
            <Select
              allowClear
              showSearch
              placeholder="请选择"
              options={userList.map(item => ({label: item.name, value: item._id}))}/>
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