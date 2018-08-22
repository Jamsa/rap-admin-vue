import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}

export function getDetail(id) {
  return request({
    url: '/user/' + id,
    method: 'get'
  })
}

export function saveDetail(detail) {
  return request({
    url: '/user',
    method: 'post',
    data: detail
  })
}

export function updateDetail(id, detail) {
  return request({
    url: '/user/' + id,
    method: 'put',
    data: detail
  })
}

export function deleteDetail(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}
