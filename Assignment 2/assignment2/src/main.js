import Vue from 'vue'
import App from './App.vue'
// import Home from './Home.vue';
import Users from './Users.vue';
// import User from './SingleUser.vue';
import Petitions from './Petitions.vue';
import SinglePetition from './SinglePetition.vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

import VueRouter from 'vue-router';
Vue.use(VueRouter);


const routes = [
  // {
  //   path: "/",
  //   component: Home
  // },
  // {
  //   path: "/users/:userId",
  //   name: "user",
  //   component: User
  // },

  {
    path: "/",
    name: "login",
    component: Users
  },

  {
    path: "/petitions",
    name: "petitions",
    component: Petitions
  },

  {
    path: "/petitions/:id",
    name: "petition",
    component: SinglePetition
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
