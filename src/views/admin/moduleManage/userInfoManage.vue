<template>
    <div style="padding-top:20px">用户列表
        <Row>
         <i-col span="8" v-for="(item,index) in currentUserPage" :key="index">  
         <Card style="width:305px;height:120px;margin-top:20px;text-align:left;" >
             <p slot="title">
                 用户信息
                <a href="#" slot="extra" style="margin-left:60%" @click.prevent="changeModelState(item)">
                  <Icon type="ios-arrow-dropup"/>
                </a>
             </p>
            <p>
                学号:{{item.studentId}}
                姓名:{{item.userName}}
                班级:{{item.classes}}
            </p>
            </Card>
            </i-col>
        </Row>
        <Page  class="divePage" :current="divPage.reCurrent" @on-change="pageTo" :total="divPage.total" :page-size="divPage.pageSize" show-elevator />
         <Modal
            v-model="modalState"
            width="666"
            title="修改用户信息"
            >
            <Row>
            <Form style="margin:10px;" :label-width="80" ref="formInline" :model="formInline" :rules="ruleInline">
            <i-col span="12">
            <FormItem label="学号">
                 <i-input type="text" disabled  v-model="formInline.studentId">
                   <Icon type="ios-person-outline" slot="prepend"></Icon>
                </i-input>
            </FormItem>
            </i-col>
           <i-col span="12">
            <FormItem prop="classes" label="班级">
                <Select v-model="formInline.classes" prefix="ios-home-outline" style="width:220px;text-align:left" placeholder="请选择班级">
                        <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
           </i-col>
            <i-col span="12">
            <FormItem prop="userName" label="用户名">
                <i-input type="text" v-model="formInline.userName" placeholder="姓名">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
                </i-input>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem prop="password" label="密码">
            <i-input type="password" v-model="formInline.password" placeholder="密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </i-input>
            </FormItem>
            </i-col>
             <i-col span="12">
               <FormItem prop="mail" label="邮箱">
                   <i-input v-model="formInline.mail" placeholder="Enter your e-mail">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                   </i-input>
                </FormItem>
            </i-col>
            <i-col span="12">
                <FormItem label="性别">
                    <RadioGroup v-model="formInline.sex">
                    <Radio label="男">男</Radio>
                    <Radio label="女">女</Radio>
                </RadioGroup>
            </FormItem>
           </i-col>
        </Form>
        </Row>
          <div slot="footer">
            <Button type="default"  @click="doCanel">取消</Button>
            <Button type="default" :loading="saveLoading"  @click="doSave">修改</Button>
        </div>
    </Modal>
    </div>
</template>
<script>
import {getUserListAPI,updateUserInfoAPI} from 'apiList/admin/userInfoManage';
export default {
    name:'userInfoManage',
    data(){
        return{
          divPage:{
              total:100,
              pageSize:9,
              reCurrent:1
          },
          currentUserPage:[],
          userListGather:[],
          modalState:false,
          saveLoading:false,
          formInline:{
            studentId:'',
            classes:'',
            userName:'',
            password:'',
            sex: '男',
            mail:''
          },
         classList:[
           {
            value:'网络工程194',
            label:'网络工程194'
           },
           {
             value:'网络工程195',
             label:'网络工程195'
           }
        ],
        ruleInline:{
            classes:[
                { required:true,message:'班级不能为空!',trigger:'blur'}
            ],
            mail: [
                { required: true, message: '邮箱不能为空', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
            ],
            userName: [
            { required: true,message: '姓名不能为空',trigger: 'blur'}
            ],
            password: [
                { required: true, message: '密码不能为空.', trigger: 'blur' },
                { type: 'string', min: 6, message: '密码的长度必须超过6', trigger: 'blur' }
            ]
          }
        }
    },
    methods:{
        pageTo(val){
          this.currentUserPage=this.userListGather[val-1]
        },
        initUserInfo(){
            getUserListAPI().then(result=>{
                this.divPage.total=result.data.total
                this.currentUserPage=result.data.userList[0]
                this.userListGather=result.data.userList
                this.divPage.reCurrent=1
                //重置选中的页数
            })
        },
        changeModelState(item){
           this.modalState=true
        //    this.formInline=item
           Object.assign(this.formInline,item)
        //    避免对Object的引用
        },
        doCanel(){
            this.modalState=false
        },
        doSave(){
          this.$refs['formInline'].validate((valid) => {
              this.saveLoading=true
              updateUserInfoAPI(this.formInline).then(result=>{
                     this.$Message[result.data.state](result.data.reason)
                     this.initUserInfo()
                     this.saveLoading=false
                     this.modalState=false
              })   
          })
        }
    },
    created(){
        this.initUserInfo()
    }
}
</script>
<style scoped>
  .divePage{
      margin-top:20px;
  }
</style>