// 用户编辑组件

import { Inter } from 'next/font/google'
import UserForm from '@/components/UserForm'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { getUserDetail } from '@/api/user';

const inter = Inter({ subsets: ['latin'] })

export default function EditUser() {
  // 获取id，然后初始化
  const router = useRouter();
  const [data, setData] = useState();
  const id = router.query.id;
  useEffect(() => {
    if (id) {
      getUserDetail(id as string).then(res => {
        setData(res.data);
      });
    }
  }, [id])
  return (<UserForm title="用户编辑"/>)
}