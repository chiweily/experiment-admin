// 实验 数据类型

export interface ExperimentQueryType {
    title?: string;
    current?: number;
    pageSize?: number;
    stock?: number;
    all?: boolean;  // 获取所有数据
}

export interface ExperimentType {
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