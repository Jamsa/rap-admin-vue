import fetch from '@/utils/fetch'

export default function createApi(moduleName){

  let api = {
    getList: function (params) {
      return fetch({
        url: `/${moduleName}`,
        method: 'get',
        params
      })
    },

    getDetail: function(id) {
      return fetch({
        url: `/${moduleName}/${id}`,
        method: 'get'
      })
    },

    saveDetail: function(detail) {
      return fetch({
        url: `/${moduleName}`,
        method: 'post',
        data: detail
      })
    },

    updateDetail: function(id, detail) {
      return fetch({
        url: `/${moduleName}/${id}`,
        method: 'put',
        data: detail
      })
    },

    deleteDetail: function(id) {
      return fetch({
        url: `/${moduleName}/${id}`,
        method: 'delete'
      })
    }
  }

  return api
}