import { Inter } from 'next/font/google'
import ExperimentForm from '@/components/ExperimentForm'

const inter = Inter({ subsets: ['latin'] })

export default function AddExperiment() {
  return <ExperimentForm title="添加实验"/>
}