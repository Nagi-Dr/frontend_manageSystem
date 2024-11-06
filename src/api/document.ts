import request from '@/utils/request'

/**
 *
 * 文档管理
 *
 **/

// 获取所有文档
export const getAllDocument = (params: any) =>
    request({
      url: '/doc/page',
      method: 'get',
      params
    })
// 根据项目ID查询文档
export const getDocumentByProId = (proId: Number) =>
  request({
    url: '/doc/pro/' + proId,
    method: 'get',
  })
// 删除文档
export const deleteSelectedDocument = (docId: Number) =>
  request({
    url: '/doc/delete/' + docId,
    method: 'delete',
  })
// 下载文档
export const downloadDocument = (params: any) =>
  request({
    url: '/common/download',
    method: 'post',
    params
  })
