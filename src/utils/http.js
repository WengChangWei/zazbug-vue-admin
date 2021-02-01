// 导入封装好的axios实例
import request from './request'

const http = {
    /**
     * methods: 请求
     * @param {*} url 请求地址 
     * @param {*} params 请求参数
     */
    get(url,data){
        const config = {
            method: 'get',
            url:url + this.formatParams(data)
        }
        if(data) config.data = data
        return request(config)
    },

    post(url,data){
        const config = {
            method: 'post',
            url:url
        }
        if(data) config.data = data
        return request(config)
    },

    put(url,data){
        const config = { 
            method: 'put',
            url:url
        }
        if(data) config.data = data
        return request(config)
    },

    delete(url,data){
        const config = {
            method: 'delete',
            url:url
        }
        if(data) config.data = data
        return request(config)
    },
    formatParams(data){
        let arr = [];
        for (let name in data) {
            arr.push(encodeURIComponent(data[name]));
        }
        return arr.join("/");
    }
}

// 导出
export default http