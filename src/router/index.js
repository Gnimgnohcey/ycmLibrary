import Vue from 'vue'
import Router from 'vue-router'
import Home from '_c/views/Home.vue'

Vue.use(Router)
let routes=[
  {
    path:'/',
    redirect:'/home/FirstPage',
    name: 'home',
    component: Home,
    children:[
      {
      path:'/home/FirstPage',
      name:'firstPage',
      component: () => import('_c/views/homeComp/homePage.vue')
     },
     {
      path:'/home/book',
      name:'bookList',
      component: () => import('_c/views/homeComp/bookList.vue')
     },
     {
      path:'/home/singleBook',
      name:'singleBook',
      component:()=>import('_c/views/bookDetail/singleBook.vue')
    },
    {
      path:'/home/bulletBoard',
      name:'bulletBoard',
      component:()=>import('_c/views/bulletinBoard/bulletinContent.vue')
    },
    {
      path:'home/noticeDetail',
      name:'noticeDetail',
      component:()=>import('_c/views/bulletinBoard/noticeDetail.vue')
    },
    {
      path:'home/selectStudyRoom',
      name:'selectStudyRoom',
      component:()=>import('_c/views/studyRoom/selectStudyRoom.vue')
    }
   ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '_c/views/user/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "about" */ '_c/views/user/register.vue')
  }
]
function doRouteSplit(routeList){
  let data=[];
  routeList.forEach(element => {
    if(element.children&&element.children.length!=0){
       data.push({
         path:element.path,
         name:element.name,
         component:(resolve) => require(['_c/views/' + element.componentURL], resolve),
         children:doRouteSplit(element.children)
       })
    }else{
         data.push({
         path:element.path,
         name:element.name,
         component:(resolve) => require(['_c/views/' + element.componentURL], resolve)
       })
    }
  })
   return data
}

if(localStorage.getItem("adminRoute")!=undefined){
   routes=routes.concat(doRouteSplit(JSON.parse(localStorage.getItem("adminRoute"))))
}
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL||'/',
  routes
})
