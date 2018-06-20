import fetch from '@/utils/fetch'

export function getList(params) {
  console.log('333333');
  return fetch({
    url: '/user',
    method: 'get',
    params
  })
}
