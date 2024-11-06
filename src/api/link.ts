import request from '@/utils/request'
/**
 *
 * 套餐管理
 *
 **/

// 查询列表数据
export const getLink = (taskId: number) => {
  return request({
    url: '/link/task/'+taskId,
    method: 'get',
  })
}

export const addLink = (params: any) => {
  return request({
    url: '/link',
    method: 'put',
    data: { ...params }
  })
}
export const upLoad = (formData) => {
  return request({
    url: '/common/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data' // 确保上传文件时使用 multipart/form-data
    },
    data: formData
  });
};
export const savePhase = (params: any) => {
  return request({
    url: '/link/savephase',
    method: 'post',
    data: { ...params }
  })
}

export const getTaskdes = (taskId: number) => {
  return request({
    url: '/task/'+taskId,
    method: 'get',
  })
}

export const getUrl = (params: any) => {
  return request({
    url: '/doc/save',
    method: 'post',
    data: { ...params }
  })
}
