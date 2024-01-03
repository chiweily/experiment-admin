// 12/14
// TODO：登陆成功后的主页 --> 增加一个欢迎页

import { Inter } from 'next/font/google';
import Experiment from './experiment';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (<Experiment/>)
}