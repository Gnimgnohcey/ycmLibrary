import axios from 'axios'
export const getUserListAPI=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/getUserList',
        method:'GET',
        params:params
    })
}

export const updateUserInfoAPI=(params="")=>{
    return axios.request({
        url:'http://localhost:3000/updateUserInfo',
        method:'GET',
        params:params
    })
}
