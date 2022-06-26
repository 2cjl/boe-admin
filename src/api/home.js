import request from '@/utils/request'

export function groupCount() {
  return request({
    url: '/home/group/count',
    method: 'get'

  })
}

export function getEventsRecord(token) {
  return request({
    url: '/home/events',
    method: 'get',
    params: { token }
  })
}
