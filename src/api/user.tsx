// 用户 API

import { UserQueryType, UserType } from "@/types";
import request from '@/utils/request'; 
import queryString from "query-string";

// 获取用户列表：GET请求
export async function getUserList(params?: UserQueryType) {
    // 如果 params 存在，则调用 queryString.stringify(params)，否则传递一个空对象
    const queryStringParams = params ? queryString.stringify(params) : '';
    return request.get(`/api/users?${queryStringParams}`);
}

// 创建用户：POST请求
export async function userAdd(params: UserType) {
    return request.post("/api/users", params)
}

// 删除用户：DELETE请求
export async function userDelete(id: string) {
    return request.delete(`/api/users/${id}`)
}

// 更新用户：PUT请求
export async function userUpdate(params: UserType) {
    return request.put("/api/users", params)
}

// 获取用户详情：GET请求
export async function getUserDetail(id: string) {
    return request.get(`/api/users/${id}`)
}

// 用户登录：POST请求
export async function userLogin(params: Pick<UserType, 'idNum' | 'password'>) {
    return request.post('/api/login', params); 
}

// 用户退出：GET请求
export async function userLogout() {
    return request.get('/api/logout')
}