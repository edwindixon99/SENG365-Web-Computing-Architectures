<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div v-if="$route.params.userId">
      <div id="user">


        <table>
          <tr>
            <td style="padding:10px"></td>
            <td style="padding:10px">User ID </td>
            <td style="padding:10px">Name</td>
            <td v-if="user.city != null" style="padding:10px">City</td>
            <td v-if="user.country != null" style="padding:10px">Country</td>
            <td v-if="user.email != null" style="padding:10px">Email</td>
          </tr>
          <tr>
            <td v-if="isUserPhoto"><img :src="imageElement" width="100" height="100"/></td>
            <td v-else ><img src="./assets/default.png" width="100" height="100"/></td>
            <td style="padding:10px">{{ $route.params.userId }}</td>
            <td style="padding:10px">{{ user.name }}</td>
            <td v-if="user.city != null" style="padding:10px">{{ user.city }}</td>
            <td v-if="user.country != null" style="padding:10px">{{ user.country }}</td>
            <td v-if="user.email != null"  style="padding:10px">{{ user.email }}</td>
          </tr>
        </table>

        <div v-if="">
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#editUserModal">
            Edit User Details
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
                  Email
                  <input v-model=email placeholder="email" />
                </form>
              </div>
              <div>
                <form>
                  New Password
                  <input v-model=password type="password" placeholder="********" />
                </form>
              </div>
              <div>
                <form>
                  current Password
                  <input v-model=currentPassword type="password" placeholder="*******" />
                </form>
              </div>
              <div>
                <form>
                  Name
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
              * current password is required if changing password
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal"
                      v-on:click="editUser($route.params.userId)">
                Ok
              </button>

              <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="resetValues()">
                Cancel
              </button>
            </div>
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
        photo: null,
        isUserPhoto: 0,
        baseurl: "http://localhost:4941/api/v1/users/"
      }
    },
    mounted: function() {
      this.getSingleUser(this.$route.params.userId);
    },
    methods: {
      logout: function() {
        this.$http.post(this.baseurl + 'logout', {}, {headers: {"X-Authorization":localStorage.getItem("X-Authorization")}})
          .then((response)=> {
            localStorage.removeItem("X-Authorization");
            localStorage.removeItem("userId");
            this.$router.push({name:"login"});
          }).catch((error) => {
          console.log(error.response.statusText);
          if (error.response.status == 401 || error.response.status == 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },
      getSingleUser: function(id) {
        this.getUserPhoto(id);
        this.$http.get(this.baseurl + id, {headers: {"X-Authorization":localStorage.getItem("X-Authorization")}})
          .then((response)=> {
            this.user = response.data;
          }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status == 401 || error.response.status == 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },
      editUser: function(id) {
        let data = {};
        if (this.name != "") {
          data["name"] = this.name;
        }
        if (this.email != "") {
          data["email"] = this.email;
        }
        if (this.password != "") {
          data["password"] = this.password;
        }
        if (this.currentPassword != "") {
          data["currentPassword"] = this.currentPassword;
        }
        if (this.city != "") {
          data["city"] =this.city;
        }
        if (this.country != "") {
          data["country"] = this.country;
        }
        if (this.uploadingPhoto != null) {
          this.putPetitionPhoto(id);
        }
        if (Object.keys(data).length == 0 & this.uploadingPhoto != null) {
          this.getSingleUser(id);
          return;
        }

        this.$http.patch(this.baseurl +  + id, data,
          {headers:{"X-Authorization":localStorage.getItem("X-Authorization")}})
          .then((response) => {
            this.resetValues();
            this.getSingleUser(id);

        }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status == 401 || error.response.status == 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },

      processPhoto: function(event) {
        this.uploadingPhoto = event.target.files[0];
      },

      putPetitionPhoto: function(id) {
        this.$http.put(this.baseurl + id + "/photo", this.uploadingPhoto,{ headers:{"X-Authorization":localStorage.getItem("X-Authorization"), "Content-Type":"image/png"}})
          .then((response)=> {
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
      },
      isLoggedin : function() {
        return localStorage.getItem("X-Authorization") != null;
      },
      getUserPhoto: function(id) {
        this.$http.get(this.baseurl + id + "/photo", { responseType:"blob"})
          .then((response) => {
            this.isUserPhoto = 1;
            const reader = new FileReader();
            reader.readAsDataURL((response.data));
            reader.onload = function () {

              imageDataUrl = reader.result;
              // this.imageElement= reader.result;
              imageElement.setAttribute("src", imageDataUrl);
            };
          }).catch((error) => {
          if (error.response.status == 404) {
            this.isUserPhoto = 0;
          } else {
            this.error = error;
            this.errorFlag = true;
          }
        });
      },
    }
  }
</script>
