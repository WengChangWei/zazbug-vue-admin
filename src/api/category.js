import http from '../utils/http';
// import axios from '../utils/request';
/**
 * @params request 请求地址 例如:http://192.168.0.1:18088/api/...
 * @params 'testIp' 代表vue-cli中vue.config.js中配置的代理
 */

export function findPageByList(params){
    return http.get(`/category/search/`,params)
}

export function add(params){
    return http.post(`/category`,params)
}

export function update(params){
    return http.put(`/category/`+params.id,params)
}

export function cateFindAll(){
    return http.get(`/category/all`,{})
}