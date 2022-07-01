import request from '@/utils/request'

export function getAllGroup(query) {
  return request({
    url: '/group/all',
    method: 'get',
    params: query
  })
}

export function delGroup(id) {
  return request({
    url: `/group/${id}`,
    method: 'delete',
  })
}
