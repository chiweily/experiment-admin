// 实验编辑
import { Inter } from 'next/font/google'
import ExperimentForm from '@/components/ExperimentForm'

const inter = Inter({ subsets: ['latin'] })

export default function EditExperiment() {
  return (<ExperimentForm title="实验编辑"/>)
}