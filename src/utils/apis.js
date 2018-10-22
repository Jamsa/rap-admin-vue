import request from '@/utils/request'

export default function createApi(moduleName) {
  const api = {
    getList: function(params) {
      return request({
        url: `/${moduleName}`,
        method: 'get',
        params
      })
    },
    getSubList: function(subname,params) {
      return request({
        url: `/${moduleName}/${subname}`,
        method: 'get',
        params
      })
    },
    getDetail: function(id) {
      return request({
        url: `/${moduleName}/${id}`,
        method: 'get'
      })
    },

    saveDetail: function(detail) {
      return request({
        url: `/${moduleName}`,
        method: 'post',
        data: detail
      })
    },

    updateDetail: function(id, detail) {
      return request({
        url: `/${moduleName}/${id}`,
        method: 'put',
        data: detail
      })
    },

    deleteDetail: function(id) {
      return request({
        url: `/${moduleName}/${id}`,
        method: 'delete'
      })
    }
  }

  return api
}
