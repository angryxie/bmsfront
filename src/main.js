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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
