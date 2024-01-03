import { Inter } from 'next/font/google';
import EnrollForm from '@/components/EnrollForm';
const inter = Inter({ subsets: ['latin'] })

export default function AddBorrow() {
  return <EnrollForm title="选择实验" editData />
}
