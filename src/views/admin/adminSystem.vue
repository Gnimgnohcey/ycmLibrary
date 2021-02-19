<template>
    <div>
    <header>
      <i-col span="20">
      <svg width="100%" height="60px" viewBox="0 0 1000 60">
        <text x="40" y="30" class="titleText">
            面向高校的图书馆馆藏管理系统
        </text>
      </svg>
      </i-col>
      <i-col span="2"> <Button type="error" @click="exitAdmin">退出</Button></i-col>
    </header>
      <Row> 
         <i-col span="5">
            <Menu active-name="1">
                <MenuGroup title="图书管理">
                    <MenuItem name="1" :to="{name:'bookManage'}">
                        <Icon type="ios-book-outline" />
                        书籍管理
                    </MenuItem>
                    <MenuItem name="2" :to="{name:'bookRackManage'}">
                       <Icon type="ios-bookmarks-outline"/>
                        书架管理
                    </MenuItem>
                </MenuGroup>
                <MenuGroup title="公告管理">
                    <MenuItem name="3" :to="{name:'noticeManage'}">
                        <Icon type="ios-alert-outline" />
                       公告信息
                    </MenuItem>
                </MenuGroup>
                <MenuGroup title="用户管理">
                    <MenuItem name="4" :to="{name:'userInfoManage'}">
                        <Icon type="ios-people-outline" />
                        用户列表
                    </MenuItem>
                    <MenuItem name="5" :to="{name:'bookRemarkManage'}">
                      <Icon type="ios-card-outline" />
                         用户评价管理
                    </MenuItem>
                </MenuGroup>
                <MenuGroup title="自习室管理">
                    <MenuItem name="6" :to="{name:'studyRoomManage'}">
                       <Icon type="ios-bulb-outline" />
                        自习室列表
                    </MenuItem>
                </MenuGroup>
                <MenuGroup title="借阅管理">
                    <MenuItem name="7" :to="{name:'borrowManage'}">
                       <Icon type="ios-bulb-outline" />
                        借阅列表
                    </MenuItem>
                </MenuGroup>

            </Menu>        
         </i-col>
         <i-col span="19">
            <router-view></router-view>
         </i-col>
        </Row>

    </div>
</template>
<script>
export default {
    name:'adminSystem',
    methods:{
       exitAdmin(){
            localStorage.clear()
            this.$router.push({
                name:'login'
            })
            location.reload();
            // 退出页面刷新一下,让保存的admin路由清空,避免重复记录
        }
    },
    mounted(){
    }
}
</script>
<style scoped>
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
</style>