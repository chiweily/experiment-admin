// 设置系统主页呈现的内容

import { Layout } from '@/components/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Login from './login';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return router.pathname === '/login' ? (
    <Login/>
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
