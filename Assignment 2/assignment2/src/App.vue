<template>
  <div>
    <div v-if="isLoggedin()">
      <td>
    <button type="button" class="btn btn-primary" data-dismiss="modal"
            v-on:click="logout()">
      Logout
    </button>
      </td>
      <td style="padding:10px"><router-link :to="{ name: 'user', params: {'userId': userId}}">See My Profile</router-link></td>
    </div>
    <div v-else>
      <router-link :to="{ name: 'login'}">Login</router-link>
    </div>
    <td><router-link :to="{ name: 'petitions'}">See Petitions</router-link></td>


    <router-view></router-view>
  </div>
</template>
<script>
  import Petitions from "./Petitions.vue";
  export default {
    data() {
      return {
        userId: localStorage.getItem('userId')
      }
    },
    methods: {
      logout: function () {
        this.$http.post("http://localhost:4941/api/v1/users/logout", {}, {headers: {"X-Authorization": localStorage.getItem("X-Authorization")}})
          .then((response) => {
            localStorage.removeItem("X-Authorization");
            localStorage.removeItem("userId");
            this.$router.push({name: "login"});
          }).catch((error) => {
          console.log(error.response.statusText);
          if (error.response.status == 401 || error.response.status == 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },
      isLoggedin : function() {
        return localStorage.getItem("X-Authorization") != null;
      }
    }
  }
</script>

