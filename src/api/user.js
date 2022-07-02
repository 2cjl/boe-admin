import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function fetchUserList(query) {
  return request({
    url: '/user/get_users',
    method: 'get',
    params: query
  })
}

export function putStop(data) {
  return request({
    url: '/user/ban_user',
    method: 'put',
    data
  })
}

export function delUser(data) {
  return request({
    url: '/user/delete_user',
    method: 'delete',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update_account',
    method: 'put',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/user/create_account',
    method: 'post',
    data
  })
}

