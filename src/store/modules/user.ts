import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, userLogout, register } from '@/api/employee' // 确保引入 register API
import { getToken, setToken, removeToken, setUserInfo, getUserInfo, removeUserInfo } from '@/utils/cookies'
import store from '@/store'
import Cookies from 'js-cookie'
import { Message } from 'element-ui'

export interface IUserState {
  token: string
  name: string
  userInfo: any
  username: string
}

@Module({ 'dynamic': true, store, 'name': 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public userInfo = {}
  public username = Cookies.get('username') || ''

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_USERINFO(userInfo: any) {
    this.userInfo = { ...userInfo }
  }

  @Mutation
  private SET_USERNAME(username: string) {
    this.username = username
  }

  @Action
  public async Login(userInfo: { username: string, password: string }) {
    let { username, password } = userInfo
    username = username.trim()
    this.SET_USERNAME(username)
    Cookies.set('username', username)
    const { data } = await login({ username, password })
    if (String(data.code) === '1') {
      console.log('data.data =', data.data)
      this.SET_TOKEN(data.data.token)
      setToken(data.data.token)
      this.SET_USERINFO(data.data)
      Cookies.set('user_info', data.data)
      return data
    } else {
      return Message.error(data.msg)
    }
  }

  // 添加 Register 方法
  @Action
public async Register(registerInfo: { username: string, password: string }) {
  const { username, password } = registerInfo;
  try {
    const { data } = await register({ username, password });
    if (data.code === 1) {
      // 注册成功，显示提示信息
      // Message.success('注册成功！');
      return data;
    } else {
      // 注册失败，显示错误信息
      Message.error(data.msg || '');
      return null;
    }
  } catch (error) {
    // 捕获网络错误或其他异常
    Message.error('注册失败，请稍后重试');
    return null;
  }
}
  @Action
  public ResetToken (){
    removeToken()
    this.SET_TOKEN('')
  }

  @Action
  public async GetUserInfo () {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }

    const data = JSON.parse(<string>getUserInfo())
    if (!data) {
      throw Error('Verification failed, please Login again.')
    }

    const { roles, name, applicant, storeManagerName } = data
    if (!roles || roles.length <= 0) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    this.SET_USERINFO(data)
    this.SET_NAME(name || applicant || storeManagerName)
  }

  @Action
  public async LogOut () {
    const { data } = await userLogout({})
    removeToken()
    this.SET_TOKEN('')
    // this.SET_ROLES([])
    Cookies.remove('username')
    Cookies.remove('user_info')
    removeUserInfo()
  }
}

export const UserModule = getModule(User)
