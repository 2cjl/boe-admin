import request from '@/utils/request'

export function fetchShowList(query) {
  return request({
    url: '/show/all',
    method: 'get',
    params: query
  })
}

export function preview(data) {
  return request({
    url: '/file/presign',
    method: 'post',
    data
  })
}

export function upload(url, data) {
  return request({
    url,
    method: 'put',
    data
  })
}
