import Vuex from 'vuex'
import Vue from 'vue'
import user from './module/user'
Vue.use(Vuex);
export default new Vuex.Store({
   state:{},
   mutations:{},
   actions:{},
   getters:{},
   modules:{
     user
   }
})