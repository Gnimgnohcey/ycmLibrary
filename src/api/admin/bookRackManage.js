import axios from 'axios'
// export const getRackListInManage=(params='')=>{
//     return axios.request({
//         url:'http://localhost:3000/get',
//         method:'GET',
//         params:params
//     })
// }
export const getRackByCategoryAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/getRackByCategory',
        method:'GET',
        params:params
    })
}
export const addRackAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/addRack',
        method:'GET',
        params:params
    })
}
export const deleteRackAPI=(params='')=>{
    return axios.request({
        url:'http://localhost:3000/deleteRack',
        method:'GET',
        params:params
    })
}
