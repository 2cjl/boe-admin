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
