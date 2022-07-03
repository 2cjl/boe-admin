import request from '@/utils/request'

export function fetchShowList(offset, count, name) {
  return request({
    url: '/show/all',
    method: 'get',
    params: {
      offset,
      count,
      name
    }
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
