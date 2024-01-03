// 实验登记编辑页面

import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { getEnrollDetail } from '@/api/enroll'
import { useRouter } from 'next/router'
import EnrollForm from '@/components/EnrollForm'

const inter = Inter({ subsets: ['latin'] })

export default function EditEnroll() {
    const router = useRouter();
    const [data, setData] = useState();
    useEffect(() => {
        const fetchData = async () => {
            // 如果 router.query.id 是数组，那么返回第一个值，不是的话，保持原样
            const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
            if (id) {
                try {
                    const res = await getEnrollDetail(id);
                    setData(res.data)
                } catch (error) {
                    console.error("error")
                }
            }
        }; fetchData();
    },[router.query.id]);
  return (<EnrollForm editData={data} title="编辑选择"/>)
}