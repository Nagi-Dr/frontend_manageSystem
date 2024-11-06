import request from '@/utils/request'

/**
 *
 * 员工管理
 *
 **/

// 登录
export const login = (data: any) =>
  request({
    url: '/employee/login',
    method: 'post',
    data
  })

// 退出
export const userLogout = (params: any) =>
  request({
    url: `/employee/logout`,
    method: 'post',
    params
  })

// 修改密码
export const editPassword = (data: any) =>
  request({
    'url': '/employee/editPassword',
    'method': 'put',
    data
  })

// 注册
export const register = (data: any) =>
  request({
    url: '/employee/register', // 确保这是你实际的注册接口路径
    method: 'post',
    data
  })

// 根据项目ID查询员工
export const getProMenByProId = (proId: Number) =>
  request({
    url: '/promen/pro/' + proId,
    method: 'get',
  });

// 其他员工管理 API
export const getEmployeeList = (params: any) => {
  return request({
    url: '/promen/page',
    method: 'get',
    params
  })
}

// 修改---启用禁用接口
export const enableOrDisableEmployee = (params: any) => {
  return request({
    url: `/employee/status/${params.status}`,
    method: 'post',
    params: { id: params.id }
  })
}

// 新增---添加员工
export const addEmployee = (params: any) => {
  return request({
    url: '/promen/save',
    method: 'post',
    data: { ...params }
  })
}

// 修改---编辑员工
export const editEmployee = (params: any) => {
  return request({
    url: '/employee',
    method: 'put',
    data: { ...params }
  })
}

// 删除数据接口
export const deleteEmployee = (promenId: number) => {
  return request({
    url: '/promen/delete/'+promenId,
    method: 'delete',
  })
}

// 查询员工详情
export const queryEmployeeById = (id: string | (string | null)[]) => {
  return request({
    url: '/promen/page',
    method: 'get'
  })
} // 确保在这里有一个关闭的大括号
