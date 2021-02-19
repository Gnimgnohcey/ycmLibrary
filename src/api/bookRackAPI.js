import axios from 'axios';
export const getBookrackListAPI=(params='')=>{
    return axios.request({
        url: 'http://localhost:3000/getBookrack',
        method: 'get',
        params: params
      })
}
export const searchBookInRackAPI=(params='')=>{
    return axios.request({
        url: 'http://localhost:3000/searchBookInRack',
        method: 'get',
        params: params
      })
}