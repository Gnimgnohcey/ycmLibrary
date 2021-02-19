<template>
  <div class="home">
    <header>
      <i-col span="20">
      <svg width="100%" height="60px" viewBox="0 0 1000 60">
        <text x="40" y="30" class="titleText">
            面向高校的图书馆馆藏管理系统
        </text>
      </svg>
      </i-col>
      <i-col span="4">
        <Row v-if="!loginState">
          <i-col span="10">
            <Button  type="default" :to="{name:'login'}" ghost>login</Button>
          </i-col> 
          <i-col span="10">
            <Button  type="default" :to="{name:'register'}" ghost>Register</Button>
          </i-col> 
        </Row>
        <div v-if="loginState" class="after-login-header"  @click="openUserInfo">
          <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>
        </div>
      </i-col>
    </header>
     <Menu mode="horizontal" active-name="1">
        <MenuItem name="1" :to='{name:"firstPage"}'>
           <Icon type="ios-home" />
              主页
        </MenuItem>
        <MenuItem name="2" :to='{name:"bookList"}'>
            <Icon type="ios-book" />
              查看书架
        </MenuItem>
        <MenuItem name="3" :to='{name:"selectStudyRoom"}'>
            <Icon type="ios-flame" />
              自习室查询
        </MenuItem>
        <MenuItem name="4" :to='{name:"bulletBoard"}'>
            <Icon type="ios-alert" />
              公告栏
        </MenuItem>
     </Menu>
    <router-view style="margin-top:2px"></router-view>
     <footer>
        若有版权争议,请联系管理员ycm,联系电话1805873348x 联系邮箱105168756x@qq.com
    </footer>
    <drawer v-model="drawState"></drawer>
  </div>
</template>

<script>
import Drawer from './userDrawer/drawer.vue'
// @ is an alias to /src
// import {mapActions,mapGetters} from 'vuex'
export default {
  name: 'home',
  data(){
    return{
      loginState:false,
      drawState:false
    }
  },
  components: {
    Drawer
  },
  computed: {
     //...mapGetters({outUserInfo:'user/outUserInfo'})
  },
  created() {
     if(localStorage.getItem("userInfo")){
       this.$store.dispatch('getUserInfo',localStorage.getItem("userInfo"))
       this.loginState=true
     }
     //读取当前登陆状态,如果用户信息存在,则登陆中
  },
  methods: {
    openUserInfo(){
      this.drawState=true
    }
  },
}
</script>
<style scoped>
    .home{
      width: 85%;
      margin: 0 auto;
    }
    header{
      display: flex;
      background-image:linear-gradient(to right, rgb(103, 156, 216),rgb(231, 231, 195));
      height: 60px;
      padding-top:10px;
    }
    .after-login-header{
       margin-left:50%;
       margin-top:3px;
       position:absolute;
       z-index: 111;
    }

   .titleText{
      font-size: 32px;
      fill: transparent;
      stroke:rgb(230, 226, 17);
      stroke-width: 1;
      stroke-dasharray:500;
      stroke-dashoffset:0;
      animation:drawTitle 6s ease-in infinite;
    }
  @keyframes drawTitle{
    50%{
      stroke-dasharray:500;
      stroke-dashoffset:500;		 
    }
    100%{
      stroke-dasharray:500;
      stroke-dashoffset:0;
    }
  }
    footer{
       display: block;
       height: 60px;
       margin-top:20px;
       padding-top:15px ;
       border-top:2px solid lightpink ;
       font-size:8px;
       color:lightgrey
   }
</style>
