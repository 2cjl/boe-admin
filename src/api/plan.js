import request from '@/utils/request'

export function getPlanList(offset, count, name, state) {
  return request({
    url: `/plan/get_plan_list`,
    method: 'get',
    params: {
      offset,
      count,
      name,
      state
    }
  })
}

export function getPlanDetailList(planId) {
  return request({
    url: '/plan/get_plan_detail',
    method: 'get',
    params: {
      planId
    }
  })
}

export function getDeviceList(offset, count, name, group) {
  return request({
    url: '/device/all',
    method: 'get',
    params: {
      offset,
      count,
      name,
      group
    }
  })
}

export function getOrganization() {
  return request({
    url: '/organization',
    method: 'get'
  })
}

export function queryPlan(planId) {
  return request({
    url: '/plan/get_plan',
    method: 'get',
    params: planId
  })
}

export function getProgramList(offset, count, name) {
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

export function getGroupDevice() {
  return request({
    url: '/group/3/devices',
    method: 'get'
  })
}

export function copyProgram(planId) {
  return request({
    url: '/plan/copy_plan',
    method: 'post',
    params: {
      planId
    }
  })
}

export function deleteProgram(planId) {
  return request({
    url: '/plan/delete_plan',
    method: 'delete',
    params: {
      planId
    }
  })
}

export function getResolutionList() {
  return request({
    url: '/device/resolution/all',
    method: 'get'
  })
}
