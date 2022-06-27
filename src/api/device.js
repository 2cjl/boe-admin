import request from '@/utils/request'
export function fetchDeviceList(query) {
  return request({
    url: '/group/all',
    method: 'get',
    params: query
  })
}
