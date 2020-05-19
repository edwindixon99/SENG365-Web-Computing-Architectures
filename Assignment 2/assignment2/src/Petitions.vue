<template>
  <div>
    <div v-if="errorFlag" style="color: red;">
      {{ error }}
    </div>





    <div>
      <br id="petitions">
        <h1>Petitions</h1>

        <div style="padding:70px">
          <form>
            <input v-model=q placeholder="Search" />
            <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    v-on:click="getPetitions()">
              Go
            </button>

            <button type="button" class="btn btn-primary" data-toggle="modal"
                    data-target="#filterPetitionModal">
              Filter
            </button>
          </form>
          <div>
            Sort By
            <select v-model="sortBy" v-on:click="getPetitions()">
              <option value="ALPHABETICAL_ASC">Alphabetical A-Z</option>
              <option value="ALPHABETICAL_DESC">Alphabetical Z-A</option>
              <option value="SIGNATURES_ASC">Signature count (asc)</option>
              <option value="SIGNATURES_DESC">Signature count (desc)</option>
            </select>


            Filter By Category
            <select v-model="categoryId" v-on:click="getPetitions()">
              <option value="''">None</option>
              <option v-for="category in categories" :value="category.categoryId">{{category.name}}</option>
            </select>


          </div>

          <td style="padding:10px" v-for="i in parseInt(petitions.length / 10) + 1">
            <button type="button" class="btn btn-secondary" data-dismiss="modal"
                    v-on:click="getPetitions()">
              {{i}}
          </button>
          </td>

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
              <td><router-link :to="{ name: 'petition', params: { id: petition.petitionId
}}">View</router-link></td>
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
                <td style="padding: 10px" > <select v-model="categoryId">
                  <option v-for="category in categories" :value="category.categoryId">{{category.name}}</option>
                </select></td>
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

    <div class="modal fade" id="filterPetitionModal" tabindex="-1" role="dialog"
         aria-labelledby="filterPetitionModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="filterPetitionModalLabel">Filter</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">

            <table>
              <tr>
                <td style="padding:10px" > Search Query  </td>
                <td style="padding:10px" > <form><input Title v-model=q placeholder="" />
                </form> </td>
              </tr>
              <tr style="padding:10px">
                <td style="padding:10px" >Category</td>
                <td style="padding: 10px" >
                  <select v-model="categoryId" v-on:click="getPetitions()">
                    <option value="''"  >None</option>
                    <option v-for="category in categories" :value="category.categoryId">{{category.name}}</option>
                  </select></td>
              </tr>
              <tr style="padding:10px">
                <td style="padding:10px" >Author Id</td>
                <td style="padding: 10px" > <form><input Title v-model=authorId placeholder="" /></form></td>
              </tr>
              <tr style="padding:10px">
              </tr>
            </table>



          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal"
                    v-on:click="getPetitions()">
              Search
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
        categories: [],
        petition: null,
        title: null,
        description: null,
        categoryId: null,
        closingDate: "",
        petitionId: null,
        sortBy: null,
        q: null,
        startIndex: 0,
        authorId: null,
        params:{"count":10},
        baseurl: "http://localhost:4941/api/v1/petitions"
      }
    },
    mounted: function() {
      this.getPetitions(this.params);
    },
    methods: {
      getCategories: function() {
        this.$http.get(this.baseurl + "/categories")
          .then((response)=> {
            this.categories = response.data;
          }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status == 400) {
            alert(error);
          }
          this.error = error;
          this.errorFlag = true;
        })
      },



      getPetitions: function(params) {
        console.log(this.params);
        this.getCategories();
        if (this.q == "") {
          this.q = null;
        }
        if (this.authorId == "") {
          this.authorId = null;
        }
        if (this.categoryId == "''") {
          delete this.params["categoryId"];
        } else{
          this.params["categoryId"] = this.categoryId;
        }
        this.params["q"] = this.q;
        this.params["startIndex"] = this.startIndex;
        // this.params["authorId"] = this.authorId;
        this.params["sortBy"] = this.sortBy;
        this.params["startIndex"] = this.startIndex;
        this.params["count"] = 10;
        this.$http.get(this.baseurl, {params:this.params})
          .then((response)=> {
            this.petitions = response.data;
          }).catch((error) => {
          console.log(error.response.status);
          if (error.response.status == 400) {
            alert(error);
          }
          this.error = error;
          this.errorFlag = true;
        })
        // this.params = {};
        // this.q = null;
        // this.startIndex = null;
        // this.categoryId = null;
        // this.authorId = null;;
      },
      addPetition: function() {
        let data = {
          "title": this.title,
          "description": this.description,
          "categoryId": this.categoryId,
        };
        if (this.closingDate != "") {
          data["closingDate"] = this.closingDate;
        }
          this.$http.post(this.baseurl, data, {headers:{"X-Authorization":localStorage.getItem("X-Authorization")}}).then((response)=> {
              this.petitionId = response.data.petitionId;
          }).catch((error) => {
            console.log(error.response.status);
            if (error.response.status == 401 || error.response.status == 400) {
              alert(error);
            }
            this.error = error;
            this.errorFlag = true;
        });
        this.title = null;
        this.description = null;
        this.categoryId = null;
        this.closingDate  = "";
      }
    }
  }
</script>
