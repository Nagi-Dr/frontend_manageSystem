import Cookies from 'js-cookie';

// User
const tokenKey = 'token';
export const getToken = () => Cookies.get(tokenKey);
export const setToken = (token: string) => Cookies.set(tokenKey, token);
export const removeToken = () => Cookies.remove(tokenKey);

// userInfo

const userInfoKey = 'userInfo';
export const getUserInfo = () => Cookies.get(userInfoKey);
export const setUserInfo = (useInfor: Object) => Cookies.set(userInfoKey, useInfor);
export const removeUserInfo = () => Cookies.remove(userInfoKey);

// printinfo

const printKey = 'print';
export const getPrint = () => Cookies.get(printKey);
export const setPrint = (useInfor: Object) => Cookies.set(printKey, useInfor);
export const removePrint = () => Cookies.remove(printKey);

// 获取消息
const newData = 'new';
export const getNewData = () => Cookies.get(newData);
export const setNewData = (val: Object) => Cookies.set(newData, val);
