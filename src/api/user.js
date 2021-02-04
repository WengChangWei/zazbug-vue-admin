import http from '../utils/http';

/**
 * @params request 请求地址 例如:http://192.168.0.1:18088/api/...
 * @params 'testIp' 代表vue-cli中vue.config.js中配置的代理
 */

 export function postLogin(params){
         return http.post(`/login`,params)
}