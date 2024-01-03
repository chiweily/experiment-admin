// 实验登记 API

import { ExperimentType, ExperimentQueryType } from "@/types";
import request from '@/utils/request'; 
import queryString from "query-string";

// 获取登记列表：GET请求
export async function getEnrollList(params?: ExperimentQueryType) {
    // 如果 params 存在，则调用 queryString.stringify(params)，否则传递一个空对象
    const queryStringParams = params ? queryString.stringify(params) : '';
    return request.get(`/api/enrolls?${queryStringParams}`);
}

// 创建登记：POST请求
export async function enrollAdd(params: ExperimentType) {
    return request.post("/api/enrolls", params)
}

// 删除登记：DELETE请求
export async function enrollDelete(id: string) {
    return request.delete(`/api/enrolls/${id}`)
}

// 登记详情更新
export async function enrollUpdate(params: ExperimentType) {
    return request.put("/api/enrolls", params)
}

// 获取登记详情
export async function getEnrollDetail(id: string) {
    return request.get(`/api/enrolls/${id}`)
}