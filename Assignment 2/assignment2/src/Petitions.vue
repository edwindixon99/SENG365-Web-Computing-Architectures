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
            <td style="padding:10px"> Number of signatures </td>
            <td style="padding:10px">{{petition.signatureCount}}</td>
          </tr>
          <br /><br />
          <tr>
            <td style="padding:10px"> Number of signatures </td>
            <td style="padding:10px">{{petition.signatureCount}}</td>
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


        </table>
        <div v-if="token != null">
          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#deletepetitionModal">
            Delete
          </button>

          <button type="button" class="btn btn-primary" data-toggle="modal"
                  data-target="#editpetitionModal">
            Edit
          </button>
        </div>
        <div v-else-if="token == null">

          <button type="button" class="btn btn-primary" data-toggle="modal">
            Sign
          </button>


        </div>
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
                      v-on:click="deletepetition($route.params.petitionId)">
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
              Enter new petitionname
              <form>
                <input v-model=title placeholder="" />
              </form>
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



    <div v-else>
      <br id="petitions">
        <h1>Petitions</h1>

        <div style="padding:70px">
          <form>
            <input v-model=q placeholder="Search" />
              <router-link :to="{ name: 'petitions'}"><button type="button" class="btn btn-secondary" data-toggle="modal">
                Go
              </button></router-link>

          </form>
        </div>

        <br><br/>

        <table>
          <tr>
            <td style="padding:10px" > Title </td>
            <td style="padding:10px" > Category </td>
            <td style="padding:10px" > Author </td>
            <td style="padding:10px" > Signature Count </td>
          </tr>
            <tr style="padding:10px" v-for="petition in petitions">
            <td style="padding:10px" >{{ petition.title }}</td>
            <td style="padding:10px" >{{ petition.category }}</td>
            <td style="padding:10px" >{{ petition.authorName }}</td>
            <td style="padding:10px" >{{ petition.signatureCount }}</td>
            <td style="padding:50px" ><router-link :to="{ name: 'petition', params: { id: petition.petitionId
}}"><button>View</button></router-link></td>
          </tr>
        </table>


      <button type="button" class="btn btn-primary" data-toggle="modal"
              data-target="#addPetitionModal">
        Add New petition
      </button>

    </div>
    <div class="modal fade" id="addPetitionModal" tabindex="-1" role="dialog"
         aria-labelledby="addpetitionModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addpetitionModalLabel">Add petition</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            <table>
              <tr>
                <td style="padding:10px" > Title </td>
                <td style="padding:10px" > <form><input Title v-model=title placeholder="" />
                </form> </td>
              </tr>
              <tr style="padding:10px">
                <td style="padding:10px" >Description</td>
                <td style="padding:10px" ><form><input Title v-model=description placeholder="" /></form></td>
              </tr>
              <tr style="padding:10px">
                <td style="padding:10px" >Category Id</td>
                <td style="padding: 10px" > <form><input Title v-model=categoryId placeholder="" /></form></td>
              </tr>
              <tr style="padding:10px">
                <td style="padding:10px" >Closing Date</td>
                <td style="padding: 10px" > <form><input Title v-model=closingDate placeholder="" /></form></td>
              </tr>
              <tr style="padding:10px">
              </tr>
            </table>



          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="addPetition()">
              Add
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
        petitions: [],
        petition: null,
        title: null,
        description: null,
        categoryId: null,
        closingDate: null,
        petitionId: null,
        token: null,
        q: null,
        params:{},
        baseurl: "http://localhost:4941/api/v1/petitions"
      }
    },
    mounted: function() {
      //this.getSinglePetition(this.$route.params.id);
      this.getPetitions();
    },
    methods: {
      getPetitions: function() {
        //if (this.q != null) {
        this.params["q"] = this.q;
        //}
        this.$http.get(this.baseurl, {params:this.params})
          .then((response)=> {
            this.petitions = response.data;
          }, function(error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      getSinglePetition: function(id) {
        this.$http.get(this.baseurl +"/" + id)
          .then((response)=> {
            this.petition = response.data;
          }, function(error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      addPetition: function() {
        let data = {
          "title": this.title,
          "description": this.description,
          "categoryId": this.categoryId,
          "closingDate": this.closingDate
        }
          this.$http.post(this.baseurl, data, {header: {"X-Authorization":this.token}}).then((response)=> {
            if (response.status == 400) {
              alert("invalid registration!");
            } else if (response.status == 401) {
              this.error = response.status;
              this.errorFlag = true;
            }else {
              this.petitionId = response.data.petitionId;
            }}, function(error) {
            this.error = error;
            this.errorFlag = true;
          });
      },
      editPetition: function(id) {
        if (this.newpetitionname === "") {
          alert("Please enter an petitionname !");
        } else {
          this.$http.put('http://localhost:8080/api/petitions/' + id, {
            "petitionname": this.newpetitionname
          });
          this.newpetitionname = "";
          this.getpetitions();
          this.getSinglePetition(id);
        }
      },
      deletePetition: function(petition_id) {
        this.$http.delete('http://localhost:8080/api/petitions/' + petition_id)
          .then((response) => {
            for(var i = 0; i < this.petitions.length; i++){
              if(petition_id == this.petitions[i].petition_id){
                this.petitions.splice(i, 1);
              }
            }
            this.$router.push('/petitions').catch((err) => {});
          })
          .catch((error) => {
            this.error = error;
            this.errorFlag = true;
          });
      }

    }
  }
</script>
