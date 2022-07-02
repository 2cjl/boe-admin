import request from '@/utils/request'

export function getAllGroup(query) {
  return request({
    url: '/group/all',
    method: 'get',
    params: query
  })
}

export function createGroup(data) {
  return request({
    url: `/group`,
    method: 'post',
    data
  })
}

export function getGroupDevice(id) {
  return request({
    url: `/group/${id}/devices`,
    method: 'get'
  })
}

export function delGroup(id) {
  return request({
    url: `/group/${id}`,
    method: 'delete'
  })
}
