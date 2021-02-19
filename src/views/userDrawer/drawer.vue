<template>
    <div>
        <Drawer 
        :closable="true"
        width="640"
        v-model="drawerState"
        @on-close="onStateChange"
        >
            <p :style="pStyle">个人中心</p>
            <div class="demo-drawer-profile">
                <Row>
                    <i-col span="12">
                        学号: {{outUserInfo.studentId}}
                    </i-col>
                    <i-col span="12">
                        姓名:{{outUserInfo.userName}}
                    </i-col>
                </Row>
                <Row>
                    <i-col span="12">
                        班级: {{outUserInfo.classes}}
                    </i-col>
                    <i-col span="12">
                        性别: {{outUserInfo.sex}}
                    </i-col>
                </Row>
                <Row>
                    <i-col span="8">
                        邮箱: {{outUserInfo.mail}}
                    </i-col>
                    <i-col span="8">
                        信誉分: {{outUserInfo.credit}}
                    </i-col>
                    <i-col span="8">
                        身份: {{outUserInfo.accountCard}}
                    </i-col>
                </Row>
            </div>
            <Divider />
            <p :style="pStyle">借书记录</p>
            <div class="demo-drawer-profile">
                <Row>
                    <i-col span="22">
                        我借过的书籍:
                          <Poptip trigger="hover" v-for="(item,index) in BIGather" :key="index" :title="item.borrowTime|handleTime('borrow')" :content="item.backTime|handleTime('back')">
                              <Tag color="default"  type="border" checkable @on-change="routeTo(item)"  >{{item.bookName}}</Tag>
                          </Poptip>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="22">
                        已还:
                         <Poptip trigger="hover" v-for="(item,index) in BIGather" :key="index" :title="item.borrowTime|handleTime('borrow')" :content="item.backTime|handleTime('back')">
                            <Tag color="orange"  type="border" checkable @on-change="routeTo(item)" v-if="item.isReturn">{{item.bookName}}</Tag>
                         </Poptip>   
                    </i-col>
                </Row>
                  <Row>
                    <i-col span="22">
                        未还:
                         <Poptip trigger="hover" v-for="(item,index) in BIGather" :key="index" :title="item.borrowTime|handleTime('borrow')" :content="item.backTime|shouldReturn(item)">
                            <Tag :color="noticeRunout(item)"  :type="noticeReturn(item)" checkable @on-change="routeTo(item)"  v-if="!item.isReturn">{{item.bookName}}</Tag>
                         </Poptip> 
                    </i-col> 
                </Row>
            </div>
            <Divider />
            <div class="demo-drawer-profile">
                <Row>
                    <i-col span="22">
                        我的收藏: 
                        <span v-for="(item,index) in TCGather" :key="index">
                            <Tag color="volcano"  type="border" checkable @on-change="routeTo(item)"  v-if="item.isThumb">{{item.bookName}}</Tag>
                        </span>
                       
                    </i-col> 
                </Row>
                  <Row>
                    <i-col span="22">
                        我的点赞: 
                       <span v-for="(item,index) in TCGather" :key="index">
                         <Tag color="cyan"  type="border" checkable @on-change="routeTo(item)" v-if="item.isCollect">{{item.bookName}}</Tag>
                      </span>
                    </i-col> 
                </Row>
            </div>
            <p :style="pStyle">Contacts</p>
            <div class="demo-drawer-profile">
                <Row>
                     <i-col span="5">
                        <Button type="primary" @click="exitAccount" ghost>退出账号</Button>       
                    </i-col>
                    <i-col span="12">
                        <Button type="success" @click="toAdminSystem" ghost v-if="outUserInfo.studentId=='101'">前往管理中心</Button>
                    </i-col>
                </Row>
            </div>
        </Drawer>
    </div>
</template>
<script>
import { getUserBookAPI } from 'apiList/user';
import {mapGetters} from 'vuex'
    export default {
        props:{
            value:{
                type:Boolean,
                default:false
            },
        },
        filters:{
            handleTime(resultDate,opera){
                 const dataHandle=new Date(resultDate)
                 if(opera=='borrow'){
                    return '借书时间:'+ dataHandle.getFullYear()+'-'+(dataHandle.getMonth()+1)+'-'+dataHandle.getDate()+" "+dataHandle.getHours()+':'+dataHandle.getMinutes()
                 }else{
                     if(resultDate==0){
                         return '未还'
                     }else{
                         return '归还时间:'+ dataHandle.getFullYear()+'-'+(dataHandle.getMonth()+1)+'-'+dataHandle.getDate()+" "+dataHandle.getHours()+':'+dataHandle.getMinutes()
                     }
                 }
             },
            shouldReturn(val,item){
                    const dataHandle=new Date((item.borrowTime/1000+(item.borrowDaylong*86400))*1000)
                    return '借阅时长:'+item.borrowDaylong+'天 最迟归还:'+dataHandle.getFullYear()+'-'+(dataHandle.getMonth()+1)+'-'+dataHandle.getDate()+" "+dataHandle.getHours()+':'+dataHandle.getMinutes()
             }
         },
        data () {
            return {
                returnDay:'',
                userInfomation:{},
                drawerState:false,
                pStyle: {
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.85)',
                    lineHeight: '24px',
                    display: 'block',
                    marginBottom: '16px'
                },
                BIGather:[],
                TCGather:[]
            }
        },
        mounted(){
            // setTimeout(()=>{
            //     this.$store.dispatch('getBorrowBook')
            //     console.log('?',this.$store.state)
            // // },2000)
        },
        methods:{
           onStateChange(){
             this.$emit("input",false)
           },
           exitAccount(){
               localStorage.clear();
               this.$router.go(0);
           },
           toAdminSystem(){
               this.$router.push({
                   name:'bookManage'
               })
           },
           routeTo(item){     
               this.$router.push({
                   path:'singleBook',
                   query:{
                       bookId:item.bookId
                   }
               })
           },
           noticeReturn(item){
               const nowDate=Number(new Date())
               const remainDay=(nowDate-item.borrowTime)/86400000
               if(item.borrowDaylong-remainDay<=2){
                 return 'dot'
               }else{
                 return 'border'
               }
               //判断剩余时间,剩余时间小于2天时间提醒
           },
           noticeRunout(item){
               const nowDate=Number(new Date())
               const remainDay=(nowDate-item.borrowTime)/86400000
               if(item.borrowDaylong-remainDay<=0){
                 return 'error'
               }else{
                 return 'warning'
               }
           }
        },
        computed:{
            ...mapGetters(['outUserInfo'])
        },  
        watch:{
            value(val){
                if(val!=this.drawerState){
                    this.drawerState=val
                }
            },
            drawerState(val){
                 if(val==true){
                    getUserBookAPI({studentId:this.outUserInfo.studentId}).then(result=>{
                        this.BIGather=result.data.BTresult
                        this.TCGather=result.data.TCresult
                    })
                }
            }
        }
    }
</script>
<style>
    .demo-drawer-profile{
        font-size: 14px;
    }
    .demo-drawer-profile .ivu-i-col{
        margin-bottom: 12px;
    }
</style>
