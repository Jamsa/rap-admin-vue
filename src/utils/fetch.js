import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000                  // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    /*const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })
      }*/
    /*if(response.status!='200'){
      return Promise.reject('error')
    } else {
      return response//.data
    }*/
    return response;
  },
  error => {
    //console.log('err' + error)// for debug
    var msg =  '未知错误!';
    if(error && error.response) {
        switch (error.response.status) {
            case 400: msg = '请求错误(400)：' ; break;
            case 401: msg = '未授权，请重新登录(401)'; break;
            case 403: msg = '拒绝访问(403)'; break;
            case 404: msg = '请求出错(404)，未找到数据'; break;
            case 408: msg = '请求超时(408)'; break;
            case 500: msg = '服务器错误(500)'; break;
            case 501: msg = '服务未实现(501)'; break;
            case 502: msg = '网络错误(502)'; break;
            case 503: msg = '服务不可用(503)'; break;
            case 504: msg = '网络超时(504)'; break;
            case 505: msg = 'HTTP版本不受支持(505)'; break;
            default: msg = `连接出错(${err.response.status})!`;
        }
    }
    /*this.$message({
      showClose: true,
      message: msg+(error.response.data?error.response.data:''),
      type: 'error'
    });*/
    Message({
        message: msg+(error.response.data?error.response.data:''),
        type: 'error',
        duration: 5 * 1000,
        showClose:true
    });
    error.message = msg;
    return Promise.reject(error);
  }
)

export default service
