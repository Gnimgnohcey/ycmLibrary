<template>
    <div>
       <Row style="margin-top:10px;">
           <i-col span="16" style="text-align:right">
             <Button  icon="ios-add" @click="addBook">添加书籍</Button>
           </i-col>
           <i-col span="8">
                     <i-input v-model="searchContent" placeholder="Enter name" style="width: auto">
                          <Icon  @click="doSearch" type="ios-search" slot="suffix"/>
                    </i-input>
           </i-col>
       </Row>
       <Row>
         <i-col span="8" v-for="(item,index) in bookInfo" :key="index">  
         <Card style="width:345px;margin-top:20px;" >
            <p slot="title" style="text-align:left;">
             <!-- <Icon type="ios-film-outline"></Icon> -->
               {{increaseBookName(item.bookName)}} 
              <Poptip
                confirm
                 title="你确定删除么?"
                 @on-ok="doDeleteBook(item.bookId)"
                 style="float:right;margin-right:20px;text-align:left"
               >
              <Icon v-if="bookBorrowList.indexOf(item.bookId)==-1" type="ios-trash-outline"/>
              </Poptip>
            </p>
            <a href="#" slot="extra" @click.prevent="changeModelState(item)">
              <Icon type="ios-arrow-dropup"/>
            </a>
            <Row>
                <i-col span="7">
                    <show-img v-model="item.imgSrc" :imgAttr="imgAttr"></show-img>
                </i-col>
                <i-col span="17" style="font-size:6px">
                  <Row>
                     <i-col span="12">借阅次数:{{item.borrowAmount}}</i-col>  
                     <i-col span="12">库存:{{item.bookStock}}</i-col> 
                      <i-col span="12">当前书架:{{item.bookRack}}</i-col> 
                  </Row>
                  <!-- <i-col span="12">
                    <Button type="info" ghost>设为新书</Button>
                  </i-col>
                  <i-col span="12">
                    <Button type="warning" ghost>设为热门</Button>
                  </i-col> -->
                </i-col>
            </Row>
         </Card>
         </i-col>
       </Row>
        <Page  class="divePage" :current.sync="reCurrent" @on-change="pageTo" :total="total" :page-size="9" show-elevator />
        <update-book-modal v-model="showUpdate" :selectBook="selectBookInfo" @doSaveSuccess="callBackSuccess"></update-book-modal>
    </div>
</template>
<script>
import showImg from '../../../components/exhibit/showImg/showImg.vue'
import { showBookInfoAdmin,doDeleteBookAPI,outBorrowAPI } from 'apiList/admin/bookAdmin'
import UpdateBookModal from '../components/updateBookModal.vue'
export default {
  components: { showImg, UpdateBookModal },
    name:'bookAdmin',
    data(){
      return{
          searchContent:'',
          //搜索关键字
          showUpdate:false,
          total:100,
          selectBookInfo:{},
          reCurrent:1,
          //当前页码,用于重置页码用
          nullBook:{
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
          imgAttr:{
            loadWidth:80,
            loadHeight:100,
            loadAlt:''
          },
         bookInfo:[{
          bookName:'an',
          author:"hello",
          bookId:"12",
          publisher:"asdsad",
          bookPrice:"123123",
          bookBrief:"asdasd",
          imgSrc:"https://www.hzlib.net/u/cms/www/202007/03143403teok.png",
          category:"11231321",
          bookDetailAddress:"126545",
          bookStock:"132"
         }],
         bookBorrowList:[],
        //  存储有借阅记录的书籍id
         bookList:[]
      }
    },
    created(){
      this.loadingData()
      this.loadBorrowState()
    },
    methods:{
      doDeleteBook(val){
         doDeleteBookAPI({bookId:val}).then(result=>{
           this.$Message.success(result.data.state)
           this.loadingData()
           this.loadBorrowState()
         })
      },
      loadingData(searchVal=''){
         showBookInfoAdmin({searchKey:searchVal}).then(result=>{
           this.bookList=result.data.bookInfo
           this.bookInfo=result.data.bookInfo[0]
           this.total=result.data.total
           this.reCurrent=1
          })
        },
      loadBorrowState(){
         outBorrowAPI().then(result=>{
           let newArray=[]
           result.data.forEach(element => {
              newArray.push(element.bookId)
           });
           this.bookBorrowList=newArray
            //c查询出有借阅记录书籍的书籍ID
         })
      },
      increaseBookName(val){
            if(val.length>15){
                return val.slice(0,15)+'...'
            }else{
                return val
            }
        },
        pageTo(val){
          this.bookInfo=this.bookList[val-1]
        },
        changeModelState(item){
          this.selectBookInfo=item
          this.showUpdate=true
        },
        addBook(){
          this.selectBookInfo=this.nullBook
          this.showUpdate=true
        },
        doSearch(){
            this.loadingData(this.searchContent)
        },
        callBackSuccess(val){
           this.loadingData()
           this.loadBorrowState()
        }
    }
}
</script>
<style scoped>
   .divePage{
       margin-top:10px;
   }
</style>