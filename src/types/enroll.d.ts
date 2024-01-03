// 实验登记 数据类型

import { ExperimentType } from ".";

export interface EnrollQueryType {
    name?: string;
    current?: number;
    pageSize?: number;
    all?: boolean; // 获取所有数据
}

export interface EnrollType {
    experiment: Type;
    enrollAt: number;
    user: any;
    title: string;
    runtime: number;
    pay: string;
    time: string;
    location: string;
    notice: string;
    contact: string;
    content: string;
    createAt: number;
    _id?: string;
    stock: number;
}