import axios from 'axios'
export const getBorrowInfoListAPI=(params='')=>{
      return axios.request({
          url:'http://localhost:3000/getBorrowInfoList',
          method:'GET',
          params:params
      })
}
export const updateCheckAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/updateCheck',
        method:'GET',
        params:params
    })
}