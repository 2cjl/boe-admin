import request from '@/utils/request'

export function getPlanList(offset, count) {
  return request({
    url: `/plan/get_plan_list`,
    method: 'get',
    params: {
      offset,
      count
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

export function getDeviceList(offset, count) {
  return request({
    url: '/device/all',
    method: 'get',
    params: {
      offset,
      count
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

export function getProgramList(offset, count) {
  return request({
    url: '/show/all',
    method: 'get',
    params: {
      offset,
      count
    }
  })
}

export function getGroupDevice() {
  return request({
    url: '/group/devices/3',
    method: 'get'
  })
}
