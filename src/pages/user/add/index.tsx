// 用户添加

import { Inter } from 'next/font/google'
import UserForm from '@/components/UserForm'

const inter = Inter({ subsets: ['latin'] })

export default function UserAdd() {
  return (<UserForm title="用户添加"/>)
}