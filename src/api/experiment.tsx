// 实验 API

import { ExperimentQueryType, ExperimentType } from "@/types";
import request from '@/utils/request'
import queryString from "query-string";

// 获取实验列表：GET请求
export async function getExperimentList(params?: ExperimentQueryType) {
    // 如果 params 存在，则调用 queryString.stringify(params)，否则传递一个空对象
    const queryStringParams = params ? queryString.stringify(params) : '';
    return request.get(`/api/experiments?${queryStringParams}`);
}

// 创建实验：POST请求
export async function experimentAdd(params: ExperimentType) {
    return request.post("/api/experiments", params)
}

// 删除实验：DELETE请求
export async function experimentDelete(id: string) {
    return request.delete(`/api/experiments/${id}`)
}