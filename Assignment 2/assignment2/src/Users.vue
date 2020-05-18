<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div v-if="$route.params.userId">
      <div id="user">
        <button type="button" class="btn btn-primary" data-dismiss="modal"
                v-on:click="logout()">
          Logout
        </button>

        <table>
          <tr>
            <td style="padding:10px">User ID </td>
            <td style="padding:10px">Name</td>
            <td v-if="user.city != null" style="padding:10px">City</td>
            <td v-if="user.country != null" style="padding:10px">Country</td>
            <td v-if="user.email != null" style="padding:10px">Email</td>
          </tr>
          <tr>
            <td style="padding:10px">{{ $route.params.userId }}</td>
            <td style="padding:10px">{{ user.name }}</td>
            <td v-if="user.city != null"  style="padding:10px">{{ user.city }}</td>
            <td v-if="user.country != null" style="padding:10px">{{ user.country }}</td>
            <td v-if="user.email != null"  style="padding:10px">{{ user.email }}</td>
          </tr>
        </table>

        <div v-if="">
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#editUserModal">
            Edit
          </button>
        </div>


      </div>

      <div class="modal fade" id="editUserModal" tabindex="-1" role="dialog"
           aria-labelledby="editUserModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div>
                <form>
                  Email*
                  <input v-model=email placeholder="email" />
                </form>
              </div>
              <div>
                <form>
                  New Password*
                  <input v-model=password placeholder="********" />
                </form>
              </div>
              <div>
                <form>
                  current Password*
                  <input v-model=currentPassword placeholder="*******" />
                </form>
              </div>
              <div>
                <form>
                  Name*
                  <input v-model=name placeholder="Enter name" />
                </form>
              </div>
              <div>
                <form>
                  City
                  <input v-model=city placeholder="Enter City" />
                </form>
              </div>
              <div>
                <form>
                  Country
                  <input v-model=country placeholder="Enter Country" />
                </form>
              </div>
              * required
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal"
                      v-on:click="editUser($route.params.userId)">
                Ok
              </button>

              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-else>
      <div id="login">
        <button type="button" class="btn btn-primary" data-toggle="modal"
                data-target="#addUserModal">
          Register
        </button>

        <div>
          {{this.token}}
          {{this.token}}
          <form>
            Email
            <input v-model=email placeholder="email" />
          </form>
        </div>
        <div>
          <form>
            Password:
            <input v-model=password placeholder="***********" />
          </form>
        </div>
        <button type="button" class="btn btn-primary" data-dismiss="modal"
                v-on:click="login()">
          Login
        </button>

      </div>



    </div>
    <div class="modal fade" id="addUserModal" tabindex="-1" role="dialog"
         aria-labelledby="addUserModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addUserModalLabel">Create a new user</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div>
              <form>
                Email*
                <input v-model=email placeholder="email" />
              </form>
            </div>
            <div>
              <form>
                Password*
                <input v-model=password placeholder="password" />
              </form>
            </div>
            <div>
              <form>
                Name*
                <input v-model=name placeholder="Enter name" />
              </form>
            </div>
            <div>
              <form>
                City
                <input v-model=city placeholder="Enter City" />
              </form>
            </div>
            <div>
              <form>
                Country
                <input v-model=country placeholder="Enter Country" />
              </form>
            </div>
            * required
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="addUser()">
              Register
            </button>

            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data (){
      return{
        error: "",
        errorFlag: false,
        user: null,
        name: null,
        email: null,
        password: null,
        currentPassword: null,
        city: null,
        country: null,
        token: null,
        baseurl: "http://localhost:4941/api/v1/users/"
      }
    },
    mounted: function() {
      this.getSingleUser(this.$route.params.userId);
    },
    methods: {
      login: function() {
        this.$http.post(this.baseurl + 'login', {"email": this.email, "password": this.password})
          .then((response)=> {
            if (response.status == 400) {
              alert("invalid registration!");
            } else {
              this.userId = response.data.userId;
              this.token = response.data.token;
              localStorage.setItem("X-Authorization", response.data.token)
              this.email = null;
              this.password = null;
            }
          }).catch((error) => {
          this.error = error;
          this.errorFlag = true;
        });
      },
      logout: function() {
        this.$http.post(this.baseurl + 'logout', {}, {headers: {"X-Authorization":localStorage.getItem("X-Authorization")}})
          .then((response)=> {
            localStorage.removeItem("X-Authorization");
          }).catch((error) => {
          this.error = error;
          this.errorFlag = true;
        });
      },
      getSingleUser: function(id) {
        this.$http.get(this.baseurl + id, {headers: {"X-Authorization":localStorage.getItem("X-Authorization")}})
          .then((response)=> {
            this.user = response.data;
          }, function(error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      addUser: function() {
          let data = {
          "name": this.name,
          "email": this.email,
          "password": this.password
         }
          if (this.country != null) {
            data["country"] = this.country;
          }
        if (this.city != null) {
          data["city"] = this.city;
        }
          this.$http.post(this.baseurl + 'register', data).then((response) => {
          if (response.status == 400) {
            alert("invalid registration!");
          } else {
            this.userId = response.data.userId;
            this.login();
            this.email = null;
            this.password = null;
            this.name = null;
            this.city = null;
            this.country = null;
          }

        }).catch((error) => {
          this.error = error;
          this.errorFlag = true;
        });
      },

      editUser: function(id) {
        let data = {};
        if (this.name != null) {
          data["name"] = this.name;
        }
        if (this.email != null) {
          data["email"] = this.email;
        }
        if (this.password != null) {
          data["password"] = this.password;
        }
        if (this.currentPassword != null) {
          data["currentPassword"] = this.currentPassword;
        }
        if (this.city != null) {
          data["city"] =this.city;
        }
        if (this.country != null) {
          data["country"] = this.country;
        }

        this.$http.patch(this.baseurl +  + id, data,
          {headers:{"X-Authorization":localStorage.getItem("X-Authorization")}})
          .then((response) => {
            this.email = null;
            this.password = null;
            this.currentPassword = null;
            this.name = null;
            this.city = null;
            this.country = null;
            this.getSingleUser(id);

        }).catch((error) => {
          this.error = error;
          this.errorFlag = true;
        });
      }
    }
  }
</script>
