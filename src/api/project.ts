import request from '@/utils/request';
/**
 *
 * 项目管理
 *
 **/
// 查询所有项目
export const getAllProject = (params: any) =>
  request({
    url: '/project',
    method: 'get',
    params
  });
// 查询重点项目的数量
export const getKeynoteByProLevel = (params: any) =>
  request({
    url: '/statistics/prolevel/1',
    method: 'get',
    params
  });
// 查询普通项目的数量
export const getNormalByProLevel = (params: any) =>
  request({
    url: '/statistics/prolevel/0',
    method: 'get',
    params
  });
// 查询进行中项目的数量
export const getPerformByProState = (params: any) =>
  request({
    url: '/statistics/prostate/1',
    method: 'get',
    params
  });
// 查询已关闭项目的数量
export const getClosedByProState = (params: any) =>
  request({
    url: '/statistics/prostate/2',
    method: 'get',
    params
  });
// 查询项目动态
export const getDynamics = (params: any) =>
  request({
    url: '/dynamics',
    method: 'get',
    params
  });
// 根据ID查询项目信息
export const getProjectInfo = (proId: Number) =>
  request({
    url: '/project/' + proId,
    method: 'get',
  });
// 删除项目
export const deleteSelectedProject = (proId: Number) =>
  request({
    url: '/project/delete/' + proId,
    method: 'delete',
  });

// 修改接口
export const editProject = (params: any) => {
  return request({
    url: '/project',
    method: 'put',
    data: { ...params }
  });
};
// 新增接口
export const addProject = (params: any) => {
  return request({
    url: '/project/save',
    method: 'post',
    data: { ...params }
  });
};
export const getArchive = (proId: Number) => {
  console.log('2345-pro----', proId);
  return request({
    url: '/archive/achive/'+ proId,
    method: 'get',
  });
};
