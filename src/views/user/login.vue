<template>
   <div>
      <div>
      <Card style="width:300px;margin:150px auto">
      <Form style="margin:10px;" :label-width="20" ref="formInline" :model="formInline" :rules="ruleInline" inline>
        <h3>图书馆藏管理系统</h3>
        <br/>
        <i-col span="24">
          <FormItem prop="studentId">
            <i-input type="text" v-model="formInline.studentId" placeholder="学号">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
          </FormItem>
        </i-col>
        <i-col span="24">
        <FormItem prop="password">
          <i-input type="password" v-model="formInline.password" placeholder="密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </i-input>
        </FormItem>
        </i-col>
        <FormItem>
          <Row :gutter="36">
          <i-col span="10">
            <Button type="primary" @click="handleSubmit('formInline')" ghost>登陆</Button>
          </i-col>
          <i-col span="10">
            <Button type="primary" :to="{path:'register'}" ghost>注册</Button>
            <!--//路由跳转注册-->
          </i-col>
          </Row>
        </FormItem>
      </Form>
      </Card>
    </div>
   </div>    
</template>
<script>
import {loginAPI} from 'apiList/user.js'
export default {
    name:'login',
    data(){
      return {
        formInline: {
            studentId: '',
            password: ''
        },
        ruleInline: {
            studentId: [
             { required: true, message: '学号不能为空', trigger: 'blur' }
            ],
            password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
            ]
        }
        }
    },
    methods:{
        handleSubmit (name) {
        this.$refs[name].validate((valid) => {
            if (valid) { 
               loginAPI(this.formInline).then((getData)=>{
                   if(getData.data.state=='success'){
                      //  console.log(getData.data.userInfo)
                      //  const useInfo=JSON.stringify(getData.data.userInfo)
                       localStorage.clear()
                      //  先清除本地保存的再保存新的useInfo
                       localStorage.setItem('userInfo',this.formInline.studentId)
                      //  localStorage.setItem('runRoute',JSON.stringify(getData.data.runRoute))
                       //将学生学号保存在localStoreage,用保存登陆状态
                       if(this.formInline.studentId=='101'){
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
                          this.$router.options.routes.push(doRouteSplit(getData.data.adminRoute))
                          this.$router.addRoutes(doRouteSplit(getData.data.adminRoute))
                          localStorage.setItem("adminRoute",JSON.stringify(getData.data.adminRoute))
                        }
                      // 动态加载后台路由
                       this.$Message.success('登陆成功!');
                       this.$router.push({
                         name:'firstPage',
                       })
                   }else{
                         this.$Message.error(getData.data.resultReason);
                   }
               })
            }
        })
      }
    }
}
</script>
<style>

</style>