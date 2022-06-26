import request from '@/utils/request'

export function getAllGroup() {
  return request({
    url: '/group/all',
    method: 'get'
  })
}
