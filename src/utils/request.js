// 导入axios
import axios from 'axios';
// 使用element-ui Message做消息提醒
import { ColorPicker, Message} from 'element-ui';

// 创建新的axios实例
const service = axios.create({
    // 公共接口
    // baseURL: process.env.BASE_API, // http://localhost:18088
    // baseURL: 'http://localhost:18088',
    baseURL: '/api',
    // 超时时间 , 10s
    timeout: 10 * 1000
})

// 请求拦截器
service.interceptors.request.use(config => {
    // 发请求钱做的处理 , 数据转化 , 配置请求头 , 设置token , 设置loading等
    config.data = JSON.stringify(config.data); // 数据转化 , 也可以用QS
    // console.log(config)
    config.headers = {
        'Content-Type':'application/json' // 请求头
    }
    if(localStorage.getItem('Authorization')){
        config.headers.Authorization = localStorage.getItem('Authorization')
    }
    return config
}, error => {
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
    // 接口到响应数据并成功后的一些共有处理
    return response
},error => {
    // 接收到异常响应的处理
    if(error && error.response){
        // 公共错误处理
        // 响应码错误处理
        switch (error.response.status) {
            case 400:
                error.message = '错误请求'
                break;
            case 401:
                error.message = '未授权,请重新登录'
                localStorage.removeItem("Authorization")
                window.location.href = "/login"
                break;
            case 404:
                error.message = '请求错误,未找到该资源'
                // window.location.href = ""
                break;        
            default:
                error.message = `连接错误${error.response.status}`
                break;
        }
    }else{
        // 超时处理
        if (JSON.stringify(error).includes('timeout')) {
            Message.error('服务器响应超时，请刷新当前页')
        }
        error.message('连接服务器失败')
    }
    Message.error(error.message)
    return Promise.resolve(error.response)
})

// 导出
export default service