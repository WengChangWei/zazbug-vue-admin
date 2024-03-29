import http from '../utils/http';
// import axios from '../utils/request';
/**
 * @params request 请求地址 例如:http://192.168.0.1:18088/api/...
 * @params 'testIp' 代表vue-cli中vue.config.js中配置的代理
 */

export function findPageByList(params){
    return http.get(`/images/search/`,params)
}

export function imagesAdd(params){
    return http.post(`/images`,params)
}

export function imagesUpdate(params){
    return http.put(`/images/` + params.id,params)
}