import fetch from '@/utils/fetch'

export function getList(params) {
  return fetch({
    url: '/role',
    method: 'get',
    params
  })
}

export function getDetail(id) {
    return fetch({
        url: '/role/'+id,
        method: 'get'
    })
}

export function saveDetail(detail){
    return fetch({
        url: '/role',
        method:'post',
        data:detail
    })
}

export function updateDetail(detail){
    return fetch({
        url: '/role',
        method:'put',
        data:detail
    })
}

export function deleteDetail(id){
    return fetch({
    url:'/role/'+id,
    method:'delete'
    })
}