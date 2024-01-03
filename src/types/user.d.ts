// 用户 数据类型

export interface UserQueryType {
    name?: string;
    status?: number;
    idNum?: string;
    current?: number;
    pageSize?: number;
}

export interface UserType {
    name: string;
    idNum: string;
    password: string;
    status: "on" | "off";
    _id: string;
    sex: USER_SEX;
    role: USER_ROLE;
    // status: USER_STATUS
}