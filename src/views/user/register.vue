<template>
   <div>
    <Card style="width:600px;margin:150px auto">
        <Form style="margin:10px;" :label-width="40" ref="formInline" :model="formInline" :rules="ruleInline" inline>
            <h3>图书馆藏管理系统</h3>
            <br/>
            <i-col span="12">
            <FormItem prop="studentId">
                 <i-input type="text" v-model="formInline.studentId" placeholder="学号">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
                </i-input>
            </FormItem>
            </i-col>
          <i-col span="12">
            <FormItem prop="classes">
                <Select v-model="formInline.classes" prefix="ios-home-outline" style="width:220px;text-align:left" placeholder="请选择班级">
                        <Option v-for="item in classList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
           </i-col> 
            <i-col span="12">
            <FormItem prop="userName">
                <i-input type="text" v-model="formInline.userName" placeholder="姓名">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
                </i-input>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem prop="password">
            <i-input type="password" v-model="formInline.password" placeholder="密码">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </i-input>
            </FormItem>
            </i-col>
            <i-col span="12">
            <FormItem prop="accountCard">
                <Select v-model="formInline.accountCard" prefix="ios-person-outline" style="width:220px;text-align:left" placeholder="请选择身份">
                        <Option v-for="item in accountCard" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
             </FormItem>
            </i-col> 
            <i-col span="12">
               <FormItem prop="mail">
                   <i-input v-model="formInline.mail" placeholder="Enter your e-mail">
                        <Icon type="ios-mail-outline" slot="prepend"></Icon>
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
            <FormItem>
            <Row :gutter="36">
            <i-col span="10">
                <Button type="primary" @click="handleSubmit('formInline')" ghost>注册</Button>
            </i-col>
            <i-col span="10">
                <Button type="primary" :to="{path:'login'}" ghost>登陆</Button>
                <!--//路由跳转注册-->
            </i-col>
            </Row>
            </FormItem>
        </Form>
        </Card>
   </div>  
</template>
<script>
import { registerAPI } from 'apiList/user.js'
export default {
   name:'register',
   data(){
    return{
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
       accountCard:[
           {
            value:'教师',
            label:'教师'
           },
           {
             value:'学生',
             label:'学生'
           }
       ],
       formInline:{
        studentId:'',
        classes:'',
        userName:'',
        password:'',
        sex: '男',
        mail:'',
        accountCard:''
       },
       ruleInline:{
         studentId:[
            { required:true,message:'学号不能为空!',trigger:'blur'}
         ],
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
         ],
        accountCard:[
            { required:true,message:'用户类别!',trigger:'blur'}
        ] 
      }
    }
   },
   methods:{
       handleSubmit(name){
             this.$refs[name].validate((valid) => {
                    if (valid) {
                        console.log(this.formInline)
                        registerAPI(this.formInline).then((res)=>{
                            if(res.data.state=="success"){
                                this.$Message.success('注册成功!');
                                this.$router.push({
                                    name:'login'
                                })
                            }else{
                                this.$Message.error(res.data.errorResult.sqlMessage);
                            }
                        })
                       
                    } else {
                        this.$Message.error('请先通过验证!');
                    }
            })
       }
   }
}
</script>
<style>

</style>