// 封装axios
import axios, { AxiosInstance, AxiosRequestConfig } from "axios"
import { NextRouter } from "next/router";
import { message as AntdMessage } from "antd";


interface AxiosInstanceType extends AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

export const CreateAxiosInstance = (router: NextRouter, config?: AxiosRequestConfig): AxiosInstanceType => {

    // 创建一个自定义的axios实例
    const instance = axios.create({
        timeout: 5000,
        ...config,
    });

    // 添加请求拦截器，它会在每次请求被发送之前执行指定的回调函数
    instance.interceptors.request.use(
        function(config){ return config },
        function(error){ return Promise.reject(error)}
    );

    // 添加响应拦截器
    // 拦截器在收到服务器响应之后，但在 then 或 catch 处理响应数据之前执行
    instance.interceptors.response.use(
        function(response) { 
            // 对响应数据进行处理
            // 此处的处理为检查是否登录，登录是否成功
            const { status, data, message } = response as any;
            if(status === 200) {
                return data;
            } else if (status === 401) {
                // 未登录或者无权限，则push登录页
                return router.push('/login');
            } else {
                // 其它error
                AntdMessage.error(message || "服务端异常");
            }
        },
        function(error){ 
            if(error.response && error.response.status === 401){
                return router.push('/login');
            }
            AntdMessage.error(error?.response?.data?.message || "服务端异常")
            return Promise.reject(error)
        }
    );
    return instance;
}
export default CreateAxiosInstance({});