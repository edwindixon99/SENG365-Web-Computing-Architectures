<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>

    <div v-if="$route.params.id">
      <div id="petition">
        <router-link :to="{ name: 'petitions'}">Back to Petitions</router-link>

        <br /><br />

        <table>
          <tr>
            <td style="padding:10px">Title</td>
            <td style="padding:10px">{{petition.title}}</td>
          </tr>
          <br /><br />
          <tr>
            <td style="padding:10px"> Description </td>
            <td style="padding:10px"> {{petition.description}} </td>
          </tr>
          <br /><br />
          <tr>
            <td style="padding:10px"> Number of signatures </td>
            <td style="padding:10px">{{petition.signatureCount}}</td>
          </tr>
          <br /><br />
          <tr>
            <td style="padding:10px"> Category </td>
            <td style="padding:10px">{{petition.category}}</td>
          </tr>
          <br /><br />
          <tr>
            <td style="padding:10px"> Created Date </td>
            <td style="padding:10px">{{petition.createdDate}}</td>
          </tr>
          <br /><br />
          <tr>
            <td style="padding:10px"> Closing Date </td>
            <td style="padding:10px">{{petition.closingDate}}</td>
          </tr>
          <br /><br />
          <br /><br />
          <tr>
            <td style="padding:10px"></td>
            <button type="button" class="btn btn-primary" data-toggle="modal"
                    data-target="#signaturesModal">
              Show Signatories
            </button>
          </tr>
          <br /><br />


        </table>

        <div v-if="isLoggedin()">
        <div>
          <button type="button" class="btn btn-primary" data-toggle="modal" v-on:click="signPetition($route.params.id)">
            Sign
          </button>
          <button type="button" class="btn btn-primary" data-toggle="modal" v-on:click="unsignPetition($route.params.id)">
            Unsign
          </button>
        </div>
<!--        <div v-if="isLoggedAuthor()">-->
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#deletepetitionModal">
            Delete
          </button>

          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#editpetitionModal">
            Edit
          </button>
        </div>
<!--      </div>-->


      </div>
      <div class="modal fade" id="deletepetitionModal" tabindex="-1" role="dialog"
           aria-labelledby="deletepetitionModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="deletepetitionModalLabel">Delete petition</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure that you want to delete this petition?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal"
                      v-on:click="deletePetition($route.params.id)">
                Delete petition
              </button>

              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="editpetitionModal" tabindex="-1" role="dialog"
           aria-labelledby="editpetitionModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editpetitionModalLabel">Edit petition</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <table>
                <tr style="padding:10px">
                  <td style="padding:10px">Enter new Title</td>
                  <td style="padding:10px" ><form><input v-model=title placeholder="" /></form></td>
                </tr>

                <tr style="padding:10px">
                  <td style="padding:10px">Enter new Description</td>
                  <td style="padding:10px" ><form ><input style="padding:10px" v-model=description placeholder="" /></form></td>
                </tr>

                <tr style="padding:10px">
                  <td style="padding:10px">Choose new Category</td>
<!--                  <td style="padding:10px" ><select v-model="categoryId">-->
<!--                    <option v-for="category in categories" :value="category.categoryId">{{category.name}}</option>-->
<!--                  </select></td>-->
                </tr>

                <tr style="padding:10px">
                  <td style="padding:10px">Enter new Closing Date</td>
                  <td style="padding:10px" ><form ><input style="padding:10px" v-model=closingDate placeholder="" /></form></td>
                </tr>

                <tr style="padding:10px">
                  <td style="padding:10px">Upload an image</td>
                  <input @change="processPhoto($event)" type="file" id="myFile" name="filename">
                </tr>

              </table>


            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal"

                      v-on:click="editPetition($route.params.id)">
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



    <div class="modal fade" id="signaturesModal" tabindex="-1" role="dialog"
         aria-labelledby="signaturesModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="signaturesModalLabel">Petition Signatories</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            <table >
              <tr>
                <td style="padding:10px"></td>
                <td style="padding:10px">Name</td>
                <td style="padding:10px">City</td>
                <td style="padding:10px">Country</td>
              </tr>
              <tr style="padding:10px" v-for="signer in signatories">
                <td style="padding:10px"> <img src="./assets/logo.png" width="100" height="100"></td>
                <td style="padding:10px">{{ signer.name }}</td>
                <td v-if="signer.city != null" style="padding:10px">{{signer.city }}</td>
                <td v-else style="padding:10px"></td>
                <td v-if="signer.country != null" style="padding:10px">{{ signer.country }}</td>
                <td v-else style="padding:10px"></td>
              </tr>
            </table>


          </div>
          <div class="modal-footer">

            <button type="button" class="btn btn-secondary" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>

<script>
  import User from "./Users.vue"
  export default {
    components: {
      User
    },
    data (){
      return{
        error: "",
        errorFlag: false,
        petitions: [],
        signatories: [],
        petition: null,
        title: "",
        description: "",
        categoryId: null,
        closingDate: "",
        petitionId: null,
        authorId: null,
        petitionPhoto: null,
        uploadingPhoto:null,
        baseurl: "http://localhost:4941/api/v1/petitions/"
      }
    },
    mounted: function() {
      this.getSinglePetition(this.$route.params.id);
    },
    methods: {
      processPhoto: function(event) {
        this.uploadingPhoto = event.target.files[0];
      },
      getPetitionPhoto: function(id) {
        this.$http.get(this.baseurl + id + "/photo")
          .then((response)=> {
            this.petitionPhoto = response.data;
          }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status >= 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },

      putPetitionPhoto: function(id) {
        this.$http.put(this.baseurl + id + "/photo", {},{headers:{"X-Authorization":localStorage.getItem("X-Authorization")}})
          .then((response)=> {
            this.petitionPhoto = response.data;
          }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status >= 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },

      getSignatories: function(id) {
        this.$http.get(this.baseurl + id + "/signatures")
          .then((response)=> {
            this.signatories = response.data;
          }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status == 401 || error.response.status == 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },
      getSinglePetition: function(id) {
        this.getSignatories(id);
        this.$http.get(this.baseurl + id)
          .then((response)=> {
            this.petition = response.data;
            this.authorId = response.data.authorId;
          }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status == 401 || error.response.status == 400) {
            alert(error.response.statusText);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },

      editPetition: function(id) {
        let data = {};
        console.log(this.categoryId);
        if (this.title != "") {
          data["title"] = this.title;
        }
        if (this.description != "") {
          data["description"] = this.description;
        }
        if (this.categoryId != null) {
          data["categoryId"] = this.categoryId;
        }
        if (this.closingDate != "") {
          data["closingDate"] = this.closingDate;
        }
        if (this.uploadingPhoto != null) {
          this.putPetitionPhoto(id);
        }
        this.$http.patch(this.baseurl + id, data, {headers:{"X-Authorization":localStorage.getItem("X-Authorization")}}).then((response)=> {
          this.getSinglePetition(id);
        }).catch((error) => {
          if (error.response.status >= 400) {
            alert(error);
          }
          this.error = error;
          this.errorFlag = true;
        });
        this.title = "";
        this.description = "";
        this.categoryId = null;
        this.closingDate  = "";
      },

      deletePetition: function(id) {
        this.$http.delete(this.baseurl + id + "/signatures" , {headers:{"X-Authorization":localStorage.getItem("X-Authorization")}}).then((response)=> {
          this.getSinglePetition(id);
        }).catch((error) => {
          if (error.response.status >= 400) {
            alert(error);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },

      signPetition: function(id) {
        this.$http.post(this.baseurl + id + "/signatures", {},{headers:{"X-Authorization":localStorage.getItem("X-Authorization")}}).then((response)=> {
          this.getSinglePetition(id);}).catch((error) => {
          if (error.response.status >= 400) {
            alert(error);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },

      unsignPetition: function(id) {
        this.$http.delete(this.baseurl + id + "/signatures", {headers:{"X-Authorization":localStorage.getItem("X-Authorization")}}).then((response)=> {
          this.getSinglePetition(id);}).catch((error) => {
          if (error.response.status >= 400) {
            alert(error);
          }
          this.error = error;
          this.errorFlag = true;
        });
      },
      isLoggedin : function() {
        return localStorage.getItem("X-Authorization") != null;
      },
      isLoggedAuthor : function() {
        return localStorage.getItem("userId") ==  this.authorId;
      }
    }
  }
</script>
