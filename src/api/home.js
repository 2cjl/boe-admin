import request from '@/utils/request'

// export function groupCount() {
//   return request({
//     url: '/home/group/count',
//     method: 'get'

//   })
// }

export function getEventsRecord() {
  return request({
    url: '/home/events',
    method: 'get'
  })
}

export function getCount() {
  return request({
    url: '/home/count',
    method: 'get'
  })
}

export function getDeviceStatus() {
  return request({
    url: '/home/device/state',
    method: 'get'
  })
}

export function getGroupCount() {
  return request({
    url: '/home/group/count',
    method: 'get'
  })
}

