import request from '@/utils/request';
/**
 *
 * 任务管理
 *
 **/
// 根据项目ID获取任务
export const countTaskByProId = (proId: Number) =>
    request({
      url: '/task/pro/' + proId,
      method: 'get',
    });
// 删除任务
export const deleteSelectedTask = (taskId: Number) =>
  request({
    url: '/task/delete/' + taskId,
    method: 'delete',
  })
// 新增任务
export const addTask = (params: any) =>
  request({
    url: '/task/save',
    method: 'post',
    data: { ...params }
  });
