// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import axios from 'axios';

Vue.use(iView);

Vue.config.productionTip = false
Vue.prototype.$ajax = axios

Vue.directive('permision',{
  bind:function (el,binding) {
    axios.get('/ispermision/'+binding.expression).then(function (response) {
      console.log(response);
      if (!response.data){
        el.style.display='none';
      }
    });
  }
})

//添加一个请求拦截器
axios.interceptors.request.use(function(config){
  return config;
},function(err){
  vue.$Message.error("请求错误");
  return Promise.reject(error);
});
//添加一个响应拦截器
axios.interceptors.response.use(function(res){
  if(res.data.resultCode=402){
    vue.$Message.error("请先登录");
    vue.$router.push({name:'Login'});
  }
  else if (!res.data.success){
    vue.$Message.error("操作失败");
  }
  return res;
},function(err){
  vue.$Message.error("系统错误");
  return Promise.reject(error);
})


/* eslint-disable no-new */
const vue=new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
