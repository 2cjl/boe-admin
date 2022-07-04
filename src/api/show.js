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

export function getUploadToken() {
  return request({
    url: '/file/get_upload_token',
    method: 'get'
  })
}

export function createShow(data) {
  return request({
    url: '/show',
    method: 'post',
    data
  })
}

export function updateShow(data) {
  return request({
    url: '/show',
    method: 'put',
    data
  })
}

export function delShow(id) {
  return request({
    url: `/show/${id}`,
    method: 'delete'
  })
}
