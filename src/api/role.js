import fetch from '@/utils/fetch'

import createApi from '@/utils/apis'


export default createApi('role')


/*
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

export function updateDetail(id,detail){
    return fetch({
        url: '/role/'+id,
        method:'put',
        data:detail
    })
}

export function deleteDetail(id){
    return fetch({
    url:'/role/'+id,
    method:'delete'
    })
}*/