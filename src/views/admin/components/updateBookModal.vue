<template>
    <div>
      <Modal
        v-model="modalState"
        title="Common Modal dialog box title"
        width="888"
        > 
        <Row>
            <i-col span="4">
            <Upload
                action="http://localhost:3000/upload"
                :format="['jpg','jpeg','png']"
                :on-format-error="handleFormatError"
                :on-success="handleSuccLoad"
                ref="upload-file"
                >
            <Button icon="ios-cloud-upload-outline">上传书籍封面</Button>
            </Upload>
             <show-img v-model="currentBook.imgSrc"></show-img>
            </i-col>
            <i-col span="20">
               <Form ref="formInline" :model="currentBook" :rules="ruleInline"  :label-width="80">
                   <p>图书信息</p>
                    <i-col span="24">
                       <FormItem label="书名" prop="bookName">
                           <!-- <Input   placeholder="Enter something..."/> -->
                         <i-input type="text" v-model="currentBook.bookName" placeholder="bookName"/>
                     </FormItem>
                    </i-col>
                    <i-col span="8">
                    <FormItem label="作者" prop="author">
                            <i-input type="text" v-model="currentBook.author"/>
                     </FormItem>
                    </i-col>
                    <i-col span="8">
                        <FormItem label="书类" prop="category">
                          <Select v-model="currentBook.category">
                            <Option v-for="item in bookTypeList" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                     </FormItem>
                    </i-col>
                    <i-col span="8">
                     <FormItem label="库存" prop="bookStock">
                         <i-input v-model="currentBook.bookStock"/>
                     </FormItem>
                    </i-col>
                    <i-col span="8">
                       <FormItem label="出版社" prop="publisher">
                         <i-input type="text" v-model="currentBook.publisher"/>
                     </FormItem>
                    </i-col>
                    <i-col span="8">
                       <FormItem label="出版日期" prop="publicTime">
                           <!-- <Input   placeholder="Enter something..."/> -->
                         <i-input type="text" v-model="currentBook.publicTime"/>
                     </FormItem>
                    </i-col>
                    <i-col span="8">
                       <FormItem label="价格" prop="bookPrice">
                           <!-- <Input   placeholder="Enter something..."/> -->
                         <i-input type="text" v-model="currentBook.bookPrice"/>
                     </FormItem>
                    </i-col>
                    <i-col span="24">
                       <FormItem label="简述" prop="bookBrief">
                           <!-- <Input   placeholder="Enter something..."/> -->
                         <Input v-model="currentBook.bookBrief" maxlength="500" show-word-limit type="textarea" placeholder="Enter something..."/>
                     </FormItem>
                    </i-col>
                     <p>书架信息</p>
                        <i-col span="8">
                       <FormItem label="书架列表" prop="bookRackId">
                        <Select v-model="currentBook.bookRackId" style="width:160px">
                            <Option v-for="item in rackInfoList" :value="item.bookRackId" :key="item.bookRackId">{{ item.bookRack }}</Option>
                        </Select>
                     </FormItem>
                    </i-col>
                    <i-col span="8">
                       <FormItem label="层数" prop="bookDetailAddress">
                         <i-input type="text" v-model="currentBook.bookDetailAddress"/>
                     </FormItem>
                    </i-col>
                    <i-col span="8">
                       <FormItem label="最低信用" prop="lowestCredit">
                         <i-input type="text" v-model="currentBook.lowestCredit"/>
                     </FormItem>
                    </i-col>
                </Form>
               </i-col>
             </Row>
            <div slot="footer">
                 <Button type="default"  @click="doCanel">取消</Button>
                 <Button type="default" :loading="saveLoading"  @click="doSave">保存</Button>
            </div>
      </Modal>
    </div>
</template>
<script>
import showImg from '../../../components/exhibit/showImg/showImg.vue'
import { getRackEnumAPI,saveBookInfoAPI} from 'apiList/admin/bookAdmin'
export default {
  components: { showImg },
    name:'updateModal',
    props:{
        value:{
            type:Boolean,
            default:false
        },
        selectBook:{
            type:Object
        }
    },
    data () {
        return {
            modalState:false,
            file: null,
            bookTypeList:['HistoryAndPhilosophy','FinancialEconomics','CultureAndScience','CultureAndArt'],
            rackInfoList:[],
            currentBook:{
                bookId:'',
                bookName:'',
                author:'',
                bookBrief:'',
                publisher:'',
                bookStock:1,
                bookPrice:'',
                bookRackId:'',
                category:'',
                imgSrc:'',
                publicTime:'',
                lowestCredit:''
            },
            clearData:{
                bookId:'',
                bookName:'',
                author:'',
                bookBrief:'',
                publisher:'',
                bookStock:1,
                bookPrice:'',
                bookRackId:'',
                category:'',
                imgSrc:'',
                publicTime:'',
                lowestCredit:''
            },
            // 默认初始值,用于区分是否是修改还是添加
            loadingStatus: false,
            uploadUrl:'',
            ruleInline: {
                bookName: [{ required: true, message: 'Please fill in the bookName.', trigger: 'blur' }],
                author:[{ required: true, message: 'Please fill in the  author', trigger: 'blur' }],
                category:[{ required: true, message: 'Please fill in the  category', trigger: 'blur' }],
                publisher:[{ required: true, message: 'Please fill in the  publisher', trigger: 'blur' }],
                publicTime:[{ required: true, message: 'Please fill in the  publicTime', trigger: 'blur' }],
                bookStock:[{ required: true,pattern: /^[a-z0-9]+$/,message: 'Please fill in the  stock', trigger: 'blur'}],
                bookBrief:[{ required: true, message: 'Please fill in the  bookBrief', trigger: 'blur' }],
                bookPrice:[{ required: true, message: 'Please fill in the  bookPrice', trigger: 'blur' }],
                bookRackId:[
                        { required: true,type: 'number', message: 'Please select the bookRack', trigger: 'change' }
                    ],
                lowestCredit:[{ required: true,pattern: /^[a-z0-9]+$/,message: 'Please fill in the  lowestCredit', trigger: 'blur'}],
            },
            saveLoading:false
        }
    },
    computed:{
        selectCategory(){
            return this.currentBook.category
        }
    },
    methods: {
        doSave(){
           this.$refs['formInline'].validate((valid) => {
           if(valid) {
               this.saveLoading=true
               saveBookInfoAPI(this.currentBook).then(res=>{
                this.currentBook=this.clearData
                this.$Message.success(res.data.state);   
                this.$emit("doSaveSuccess",true)
                this.saveLoading=false
                this.modalState=false
                this.$refs['upload-file'].clearFiles()
                //清空文件上传列表
               })
            } else {
                this.$Message.error('Fail!');
            }
         })
        },
        doCanel(){
           this.modalState=false
        },
        handleSuccLoad(response,file,fileList){
           this.currentBook.imgSrc=`http://localhost:3000/static/${response}`
        },
        handleFormatError(file){
           this.$Notice.warning({
                title: 'The file format is incorrect',
                desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png or jpeg'
            });
        }
    },
    watch:{
        modalState(val){
            if(!val)(
                this.$emit("input",false)
            )
        },
        value(val){
            if(val){
                this.modalState=true
            }
        },
        selectBook:{
            deep:true,
            handler(val){
               console.log('val', val,typeof val.bookStock)
               Object.assign(this.currentBook,val)
            }
        },
        selectCategory(val){
             getRackEnumAPI({category:val}).then(result=>{
                 this.rackInfoList=result.data
                 this.currentBook.bookRackId=this.selectBook.bookRackId
             })
        }
    }
}
</script>
<style scoped>

</style>