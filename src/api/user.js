import fetch from '@/utils/fetch'

export function getList(params) {
  return fetch({
    url: '/user',
    method: 'get',
    params
  })
    }

export function getDetail(id) {
    return fetch({
        url: '/user/'+id,
        method: 'get'
    })
}

export function saveDetail(detail){
    return fetch({
        url: '/user',
        method:'post',
        data:detail
    })
}

export function updateDetail(id,detail){
    return fetch({
        url: '/user/'+id,
        method:'put',
        data:detail
    })
}

export function deleteDetail(id){
    return fetch({
    url:'/user/'+id,
    method:'delete'
    })
}
