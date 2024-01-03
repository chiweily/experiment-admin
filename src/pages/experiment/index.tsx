// 实验列表

import { Inter } from 'next/font/google'
import { Drawer, Form, Button, Input, Space, Row, Col, Table, Pagination, TablePaginationConfig, Tooltip, message, Modal} from 'antd'
import { useRouter } from 'next/router';
import { SetStateAction, useEffect, useState } from 'react';
import styles from './index.module.css';
import dayjs from 'dayjs';
import { experimentDelete, getExperimentList } from '@/api/experiment'
import { ExperimentQueryType, ExperimentType } from '@/types';
import Content from '@/components/Content';

const inter = Inter({ subsets: ['latin'] })

export default function Experiment() {
  // 实验表单列表头
  const COLUMNS = [
    {
      title: '实验名称',
      dataIndex: 'title',
      key: 'title',
      width: 140,
      render: (text: string, record: any) => {
        return (<a onClick={() => {showDrawer(record)}}>{text}</a>)
      } 
    },
    {
      title: '实验时长',
      dataIndex: 'runtime',
      key: 'runtime',
      width: 100,
    },
    {
      title: '实验报酬',
      dataIndex: 'pay',
      key: 'pay',
      width: 100
    },
    {
      title: '实验内容',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
      render: (text: string) => {
        return (<Tooltip title={text} placement='topLeft'>{text}</Tooltip>)
      }
    },
    {
      title: '实验地点',
      dataIndex: 'location',
      key: 'location',
      width: 120
    },
    {
      title: '实验名额',
      dataIndex: 'stock',
      key: 'stock',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      key: 'createAt',
      width: 120,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD')
    }
  ];

  const [form] = Form.useForm();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState<ExperimentType | null>(null);
  const [open, setOpen] = useState(false);

  async function fetchData(search?: ExperimentQueryType) {
    const res = await getExperimentList({current: pagination.current, pageSize: pagination.pageSize, ...search});
    const {data} = res;
    setData(data);
    // 每次fetchData后都需要更新pagination
    setPagination({...pagination, total: res.toal})
  } 
  
  useEffect(() => {
    fetchData();
  }, []);

  // 抽屉页显示
  const showDrawer = (record: any) => {
    setSelectedItem(record);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  
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
      current: newPagination.current || 1,  // 显式处理 undefined
      pageSize: newPagination.pageSize || 10,
      showSizeChanger: newPagination.showSizeChanger || true,
      total: newPagination.total || 0
    });
    const query = form.getFieldsValue()
    getExperimentList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...query
    });
  };  

  // 获取表单实例
  const [searchForm] = Form.useForm();
  // 搜索实验
  const searchHandler = async (values: ExperimentQueryType) => {
    const res = await getExperimentList({...values, current:1, pageSize: pagination.pageSize})
    setData(res.data)
    setPagination({...pagination, current: 1, total: res.toal})
  }
  
  // 编辑实验信息
  const editExperimentHandler = (id: string) => {
    router.push(`/experiment/edit/${id}`)
  }
  // 删除实验
  const deleteExperimentHandler = async (id: any) => {
    Modal.confirm({
      title: "确认删除？",
      okText: "确认",
      cancelText: "取消",
      async onOk(...args) {
        /* 删除接口 */
        await experimentDelete(id);
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
                onClick={() => {editExperimentHandler(row._id)}}>
                  编辑
              </Button>
              <Button 
                type='link' 
                danger 
                onClick={()=>deleteExperimentHandler(row._id)}>
                删除
              </Button>
            </>
          )
        }
    }]

  return (
    <Content title="实验列表" operation={
      <Button onClick={() => {router.push('/experiment/add')}} 
      >
        添加
      </Button>
    }>
      <Form
        name="searchExperiment"
        form={searchForm}
        onFinish={searchHandler}
        initialValues={{
          title:'',
        }}
    >
        <Row gutter={24}>
          <Col span={5}>
            <Form.Item name="title" label="实验名称">
              <Input placeholder="请输入" allowClear />
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

      <Drawer 
        className={styles.drawerWrapper}
        title="实验详情" 
        placement="right" 
        width={500}
        onClose={onClose} 
        open={open} 
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
       {selectedItem &&  (
        <>
          <Form.Item label="【实验名称】" name="title">
            <p>{selectedItem.title}</p>
          </Form.Item>
          <Form.Item label="【实验时长】" name="runtime">
            <p>{selectedItem.runtime}</p>
          </Form.Item>
          <Form.Item label="【实验报酬】" name="pay">
            <p>{selectedItem.pay}</p>
          </Form.Item>
          <Form.Item label="【实验内容】" name="content">
            <p>{selectedItem.content}</p>
          </Form.Item>
          <Form.Item label="【实验名额】" name="enroll">
            <p>{selectedItem.stock}</p>
          </Form.Item>
          <Form.Item label="【实验地点】" name="location">
            <p>{selectedItem.location}</p>
          </Form.Item>
          <Form.Item label="【注意事项】" name="notice">
            <p>{selectedItem.notice}</p>
          </Form.Item>
          <Form.Item label="【联系方式】" name="contact">
            <p>{selectedItem.contact}</p>
          </Form.Item>
        </>
       )}
      </Drawer> 

    {/* 实验列表组件 */}
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