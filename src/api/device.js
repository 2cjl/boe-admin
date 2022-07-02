import request from '@/utils/request'
export function fetchDeviceList(query) {
  return request({
    url: '/device/all',
    method: 'get',
    params: query
  })
}

export function fetchDeviceInfo(id) {
  return request({
    url: '/device/info/${id}',
    method: 'get',
    params: id
  })
}

export function delDevice(id) {
  return request({
    url: `/device/${id}`,
    method: 'delete',
  })
}
