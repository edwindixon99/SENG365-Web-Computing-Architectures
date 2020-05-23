<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div>
      <div id="login">

        <button type="button" class="btn btn-primary" data-toggle="modal"
                data-target="#addUserModal">
          Register
        </button>

        <div>
          <form>
            Email
            <input v-model=email placeholder="email" />
          </form>
        </div>
        <div>
          <form>
            Password:
            <input v-model=password type="password" placeholder="***********" />
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
                <input v-model=password type="password" placeholder="password" />
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
            <tr style="padding:10px">
              <td style="padding:10px">Upload an image</td>
              <input @change="processPhoto($event)" type="file" id="myFile" name="filename" >
            </tr>
            * required
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="addUser()">
              Register
            </button>

            <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="resetValues()">
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
        user: "",
        name: "",
        email: "",
        password: "",
        currentPassword: "",
        city: "",
        country: "",
        uploadingPhoto: null,
        baseurl: "http://localhost:4941/api/v1/users"
      }
    },
    methods: {
      login: function() {
        if (localStorage.getItem("X-Authorization") == null) {
          this.$http.post(this.baseurl + '/login', {"email": this.email, "password": this.password})
            .then((response) => {
              if (response.status == 400) {
                alert("invalid registration!");
              } else {
                this.userId = response.data.userId;
                localStorage.setItem("X-Authorization", response.data.token);
                localStorage.setItem("userId", response.data.userId);
                this.email = "";
                this.password = "";
                console.log(response.data.userId);
                // this.getSingleUser(response.data.userId)
                this.$router.push({name: "user", params: {"userId": response.data.userId}});
              }
            }).catch((error) => {
            console.log(error.response.status);
            if (error.response.status == 401 || error.response.status == 400) {
              alert(error.response.statusText);
            }
            this.error = error;
            this.errorFlag = true;
          });
        } else {
          alert("Please Log out before logging into another account");
        }
      },
      addUser: function() {
          let data = {
          "name": this.name,
          "email": this.email,
          "password": this.password
         };
          if (this.country != "") {
            data["country"] = this.country;
          }
        if (this.city != "") {
          data["city"] = this.city;
        }
          this.$http.post(this.baseurl + '/register', data).then((response) => {
          if (response.status == 400) {
            alert("invalid registration!");
          } else {
            this.userId = response.data.userId;

            this.login();
            if (this.uploadingPhoto != null) {
              this.putUserPhoto(this.userId);
            }
            this.resetValues();
          }

        }).catch((error) => {
            console.log(error.response.status);
            if (error.response.status == 401 || error.response.status == 400) {
              alert(error.response.statusText);
            }
            this.error = error;
            this.errorFlag = true;
          });
      },

      getUserPhoto: function(id) {
        this.$http.get(this.baseurl + id + '/photos')
          .then((response)=> {
            this.user = response.data;
          }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status >= 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },

      processPhoto: function(event) {
        this.uploadingPhoto = event.target.files[0];
      },

      putUserPhoto: function(id) {
        this.$http.put(this.baseurl + "/" + id + "/photo", this.uploadingPhoto,{ headers:{"X-Authorization":localStorage.getItem("X-Authorization"), "Content-Type":this.uploadingPhoto.type}})
          .then((response)=> {
            this.getUserPhoto(id);
          }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status >= 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },
      resetValues : function() {
        this.email = "";
        this.password = "";
        this.currentPassword = "";
        this.name = "";
        this.city = "";
        this.country = "";
        this.uploadingPhoto == null;
      },
      isLoggedin : function() {
        return localStorage.getItem("X-Authorization") != null;
      }
    }
  }
</script>
