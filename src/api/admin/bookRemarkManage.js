import axios from 'axios'
export const getAllReMarkAPI=(params='')=>{
      return axios.request({
          url:'http://localhost:3000/getRemark',
          method:'GET',
          params:params
      })
}

export const deleteReMarkAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/deleteRemark',
        method:'GET',
        params:params
    })
}

export const stopRemarkAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/stopRemark',
        method:'GET',
        params:params
    })
}

export const retireMarkAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/retireMark',
        method:'GET',
        params:params
    })
}


export const getStopListAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/getStopList',
        method:'GET',
        params:params
    })
}
//因为对评论的操作只有删除,所以这里复用前面查看评论的接口