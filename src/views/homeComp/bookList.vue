<template>
  <div>
    <Row>
      <i-col span="6">
        <Tree
          :data="searchList"
          show-checkbox
          expand-node
          @on-check-change="pushSearch"
        ></Tree>
        <Tree
          :data="bookrackList"
          :load-data="loadData"
          @on-select-change="pushBookrack"
        ></Tree>
      </i-col>
      <i-col span="18">
        <Row style="padding-top: 10px">
          <i-input v-model="searchKey.searchContent" placeholder="Enter something...">
            <!-- <Button slot="append" icon="ios-search" @click="doSearchName"></Button> -->
                 <Icon  @click="doSearchName" type="ios-search" slot="suffix"/>
          </i-input>
          <i-col span="6">
            <RadioGroup v-model="searchKey.searchType">
            <Radio label="bookName">
                <span>书名</span>
              </Radio>
              <Radio label="author">
                <span>作者</span>
              </Radio>
              <Radio label="publisher">
                <span>出版社</span>
              </Radio>
           </RadioGroup>
           </i-col>
           <i-col span="15">
             <span v-if="handleBookrackSelect.length">当前选中的书架:</span>
             <Tag v-for="(item,index) in handleBookrackSelect" :key="index" :name="item" closable @on-close="handleClose">{{item}}</Tag>
           </i-col>
        </Row>
        <Row>
           <book-exhib v-model="selectTreeList" :searchField="searchFindKey" :handleBookrackSelect="handleBookrackSelect"></book-exhib>
        </Row>
      </i-col>
    </Row>
  </div>
</template>
<script>
import bookExhib from '../../components/bookExhib/bookExhib.vue';
import { getBookrackListAPI } from 'apiList/bookRackAPI'
export default {
  components: { bookExhib },
  name: "bookList",
  data() {
    return {
      searchKey:{
        searchType:'bookName',
        searchContent:''
      },
      searchFindKey:{
        searchType:'bookName',
        searchContent:''
      },
      selectSearch:"allBook",
      searchList: [
        {
          title: "搜索列表",
          expand: true,
          disableCheckbox: true,
          children: [
            {
              title: "查看全部",
              operation:'findAll',
              expand: false,
              rank: 1,
              checked:false
            },
            {
              title: "新书上架",
              expand: false,
              operation:'findNew',
              rank: 1,
              checked:false
            },
            {
              title: "热门书籍",
              expand: false,
              operation:'findHot',
              rank: 1
            },
            {
              title: "无库存",
              operation:'findAfterRent',
              expand: true,
              rank: 2,
            },
            {
              title: "有库存",
              operation:'findBeforeRent',
              expand: true,
              rank: 2,
            },
          ],
        }
      ],
      bookrackList:[
        {
          title:'书架列表',
          loading: false,
          children: []
        }
      ],
      selectTreeList: [],
      bookrackSelect:new Set(),
      handleBookrackSelect:[]
      //由于计算属性无法监听computer中set的变化，所以再次定义数组用作添加
    };
  },
  computed:{
    // handleBookrackSelect(){
    //   let arr=[...this.bookrackSelect]
    //   return arr
    // }
  },
  methods: {
    doSearchName() {
        // this.searchFindKey.searchType=this.searchKey.searchType
        // this.searchFindKey.searchContent=this.searchKey.searchContent
        Object.assign(this.searchFindKey,this.searchKey)
        // 浅拷贝一次,避免出现引用的情况,因为展示层监听的是searchFindKey的变化做出查询,如果直接引用,会导致输入就调用查询
        // 这里要单独赋值一次,避免对象变成引用
    },
    pushSearch(val, select) {
      let causalArr = [];
      console.log("tag", val);
      val.forEach((element) => {
        if (element.rank == select.rank && element.nodeKey != select.nodeKey) {
          element.checked = false;
        }
        if (element.checked == true) {
          causalArr.push(element.operation);
        }
      });
      this.selectTreeList = causalArr;
      // 将点击的选中左侧目标存储在selectTree中,同时传入书架展示组件,来请求数据
    },
    loadData (item, callback) {
       getBookrackListAPI().then((result)=>{
            var outData=[
              {
                title:'文史哲',
                category:'HistoryAndPhilosophy',
                children:[
                ]
              },
               {
                title:'财政经济',
                category:'FinancialEconomics',
                children:[
                ]
              },
                 {
                title:'文化科学',
                category:'CultureAndScience',
                children:[
                ]
              },
              {
                title:'文学艺术',
                category:'CultureAndArt',
                children:[
                ]
              },
            ];
          outData.forEach(lastItem=>{
            result.data.map(item=>{
                 if(lastItem.category==item.category){
                      lastItem.children.push({
                        title:item.bookRack
                      })
                  }
               })
            })
            callback(outData)
        })
     
     },
     //书架列表需要异步加载
     pushBookrack(val,select){
        if(!select.children){
             this.bookrackSelect.add(select.title)
         }
       this.handleBookrackSelect=[...this.bookrackSelect]
       //利用set数据类型,添加选择的书架
     },
     handleClose (event, name) {
       this.bookrackSelect.delete(name)
       this.handleBookrackSelect=[...this.bookrackSelect]
     }
  },
  mounted(){
      if(this.$route.params.findOpera){
         this.searchList[0].children[1].checked=true
         this.selectTreeList=['findNew']
      }else{
         this.searchList[0].children[0].checked=true
         this.selectTreeList=['findAll']
      }
  }
};
</script>