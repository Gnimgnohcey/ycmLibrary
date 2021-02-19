import axios from 'axios'
export const registerAPI=(params = '') => {
  return axios.request({
    url: 'http://localhost:3000/register',
    method: 'get',
    params: params
  })
}
export const loginAPI=(params = '') => {
  return axios.request({
    url: 'http://localhost:3000/login',
    method: 'get',
    params: params
  })
}

export const getUserInfoAPI=(params = '') => {
  return axios.request({
    url: 'http://localhost:3000/getUserInfo',
    method: 'get',
    params: params
  })
}

export const getUserBookAPI=(params = '')=>{
  return axios.request({
    url: 'http://localhost:3000/getUserBook',
    method: 'get',
    params: params
  })
}