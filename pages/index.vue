<template>
  <div class="container">
    <Navbar/>
    <div class="row d-flex justify-content-center">
      <div class="col-md-12 d-flex mt-5">
        <div class="col-md-6">
          <h2>
            Squarelovin <span class="nuxt-text">Test <br />Task</span> Nuxt
          </h2>
        </div>
        <div class="col-md-6 col-sm-6 d-flex justify-content-end">
          <form class="form-inline my-2 my-lg-0">
            <input
              class="form-control search"
              type="search"
              placeholder="Search Brands or Models ..."
              @keyup="search"
              v-model="s"
              aria-label="Search"
            />
          </form>
          <div class="form-inline my-2 my-lg-0">
            <b-dropdown id="dropdown-1" text="Add Car / Brand" class="m-md-2">
              <!-- Start Add Brand -->
              <b-dropdown-item @click.prevent="addBrandModal()"
                >Add Car</b-dropdown-item
              >
              <b-modal v-model="addBrandModalShow" hide-footer>
                <h3>Add Car</h3>
                <form
                  @submit.prevent="brandCreate()"
                  @keydown="addBrandForm.onKeydown($event)"
                >
                  <input
                    class="form-control mb-2"
                    v-model="addBrandForm.name"
                    type="text"
                    name="name"
                    placeholder="Enter Car Name"
                  />
                  <div
                    class="text-danger m-3"
                    v-if="addBrandForm.errors.has('name')"
                    v-html="addBrandForm.errors.get('name')"
                  />
                  <base-button
                    class="form-control button"
                    type="submit"
                    :disabled="addBrandForm.busy"
                  >
                    Save
                  </base-button>
                </form>
              </b-modal>
              <!-- End Add Brand -->
              <!-- Start Add Modal -->
              <b-dropdown-item @click.prevent="addModelModal()"
                >Add Model</b-dropdown-item
              >
              <b-modal v-model="addModelModalShow" hide-footer>
                <h3>Add Model</h3>
                <form
                  @submit.prevent="modelCreate()"
                  @keydown="addModelForm.onKeydown($event)"
                >
                  <input
                    class="form-control mb-2"
                    v-model="addModelForm.name"
                    type="text"
                    name="name"
                    placeholder="Enter Model Name"
                  />
                  <div
                    class="text-danger m-3"
                    v-if="addModelForm.errors.has('name')"
                    v-html="addModelForm.errors.get('name')"
                  />

                  <label for="brand_id">Choose a car:</label>
                  <select
                    id="brand_id"
                    v-model="addModelForm.brand_id"
                    class="form-control mb-3"
                  >
                    <option
                      v-for="brand in brands.data"
                      :value="brand.id"
                      :key="brand.id"
                    >
                      {{ brand.name }}
                    </option>
                  </select>
                  <div
                    class="text-danger m-3"
                    v-if="addModelForm.errors.has('brand_id')"
                    v-html="addModelForm.errors.get('brand_id')"
                  />

                  <base-button
                    class="form-control button"
                    type="submit"
                    :disabled="addModelForm.busy"
                  >
                    Save
                  </base-button>
                </form>
              </b-modal>
              <!-- End Add Brand -->
            </b-dropdown>
          </div>
        </div>
      </div>
      <div class="col-md-12 mt-5">
        <div class="row" v-if="searching">
          <base-loading>Loading brands ...</base-loading>
        </div>
        <template v-else-if="brands.data && brands.meta.total > 0">
          <div class="row">
            <table class="table table-striped">
              <thead>
                <tr>
                  <td>ID</td>
                  <td>BRANDS</td>
                  <td class="text-center">DATE</td>
                  <td class="text-right">ACTIONS</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="brand in brands.data" :key="brand.id">
                  <td>
                    {{ brand.id }}
                  </td>
                  <td>{{ brand.name }}</td>
                  <td class="text-center">
                    <span>
                      {{ brand.create_dates.created_at_human }}
                    </span>
                  </td>
                  <td class="text-right">
                    <b-button
                      title="Show Brand Models"
                      @click.prevent="show_models(brand.id, brand.name)"
                      ><i class="fas fa-search"></i
                    ></b-button>
                    <!-- Start Show Brand Models in Modal -->
                    <b-modal v-model="modalShow" hide-footer>
                      <div class="row" v-if="searching_models">
                        <base-loading>Loading brands ...</base-loading>
                      </div>
                      <template
                        v-else-if="models.data && models.data.length > 0"
                      >
                        <div class="row p-3">
                          <h4>{{ model_name }}</h4>
                          <table class="table table-striped">
                            <thead>
                              <tr>
                                <td>ID</td>
                                <td>CAR</td>
                                <td class="text-center">DATE</td>
                                <td class="text-right">ACTIONS</td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="model in models.data" :key="model.id">
                                <td>
                                  {{ model.id }}
                                </td>
                                <td>
                                  {{ model.name }}
                                </td>
                                <td>
                                  {{ model.create_dates.created_at_human }}
                                </td>
                                <td class="text-right">
                                  <b-button
                                    @click.prevent="
                                      edit_model(model.id, model.name)
                                    "
                                    ><i class="far fa-edit"></i
                                  ></b-button>
                                  <b-modal v-model="editModelShow" hide-footer>
                                    <h3>Edit Model</h3>
                                    <form
                                      @submit.prevent="
                                        editModelUpdate(
                                          currentModelId,
                                          currentBrandId,
                                          currentBrandName
                                        )
                                      "
                                      @keydown="editModelForm.onKeydown($event)"
                                    >
                                      <input
                                        class="form-control mb-2"
                                        v-model="currentModelName"
                                        type="text"
                                        name="name"
                                      />
                                      <div
                                        class="text-danger m-3"
                                        v-if="editModelForm.errors.has('name')"
                                        v-html="
                                          editModelForm.errors.get('name')
                                        "
                                      />
                                      <base-button
                                        class="form-control button"
                                        type="submit"
                                        :disabled="editModelForm.busy"
                                      >
                                        Save
                                      </base-button>
                                    </form>
                                  </b-modal>
                                  <b-button
                                    class="text-danger"
                                    @click.prevent="
                                      confirm_destroy_model(
                                        model.id,
                                        model.name
                                      )
                                    "
                                    ><i class="fas fa-trash"></i
                                  ></b-button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </template>
                      <template v-else>
                        <div class="p-4 w-100">
                          <div class="container">
                            <h6 class="text-center">
                              There is no Models for this Brand ! <br />
                              <b-button
                                class="mt-2"
                                @click.prevent="addModelModal()"
                              >
                                Add Model</b-button
                              >
                            </h6>
                          </div>
                        </div>
                      </template>
                    </b-modal>
                    <!-- End Show Brand Models in Modal -->
                    <b-button
                      title="Add Model"
                      @click.prevent="addModelModal()"
                    >
                      <i class="fas fa-plus"></i
                    ></b-button>
                    <!-- Start Edit Brand Models -->
                    <b-button
                      title="Edit Brand Name"
                      @click.prevent="showBrandModal(brand.id, brand.name)"
                    >
                      <i class="far fa-edit"></i>
                    </b-button>
                    <b-modal v-model="editBrandModalShow" hide-footer>
                      <h3>Edit Brand</h3>
                      <form
                        @submit.prevent="editBrandUpdate(currentBrandId)"
                        @keydown="editBrandForm.onKeydown($event)"
                      >
                        <input
                          class="form-control mb-2"
                          v-model="currentBrandName"
                          type="text"
                          name="name"
                        />
                        <div
                          class="text-danger m-3"
                          v-if="editBrandForm.errors.has('name')"
                          v-html="editBrandForm.errors.get('name')"
                        />
                        <base-button
                          class="form-control button"
                          type="submit"
                          :disabled="editBrandForm.busy"
                        >
                          Save
                        </base-button>
                      </form>
                    </b-modal>
                    <!-- End Edit Brand Models -->
                    <b-button
                      title="Delete Brand"
                      class="text-danger"
                      @click.prevent="
                        confirm_destroy_brand(brand.id, brand.name)
                      "
                    >
                      <i class="fas fa-trash"></i
                    ></b-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Start Pagination For Brands -->
          <div class="pagin row d-block mt-2 mb-2">
            <pagination
              :limit="2"
              align="center"
              size="small"
              :data="brands"
              @pagination-change-page="fetchBrands"
              ><span slot="prev-nav">previous</span>
              <span slot="next-nav">next</span></pagination
            >
          </div>
          <!-- End Pagination For Brands -->
        </template>
        <template v-else>
          <div class="p-4 w-100">
            <div class="container">
              <h6 class="text-center">There is no brands yet !</h6>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "vform";
import Navbar from '~/components/Navbar.vue';

export default {
  components: { Navbar },
  middleware: ["auth"],
  data: () => ({
    modalShow: false,
    editModelShow: false,
    editBrandModalShow: false,
    addBrandModalShow: false,
    addModelModalShow: false,
    models: {},
    brands: {},
    model_name: {},
    currentModelName: {},
    currentModelId: {},
    currentBrandName: {},
    currentBrandId: {},
    s: "",
    searching: false,
    searching_models: false,
    editBrandForm: new Form({
      name: "",
    }),
    editModelForm: new Form({
      name: "",
    }),
    addBrandForm: new Form({
      name: "",
    }),
    addModelForm: new Form({
      name: "",
    }),
  }),

  head() {
    return {
      title: "Squarelovin Test",
      meta: [
        {
          hid: "Squarelovin Test",
          name: "Squarelovin Test",
          content: "Squarelovin Test",
        },
      ],
    };
  },
  created() {
    this.fetchBrands();
  },
  methods: {
    // This method gets all the brands by pagination user should login to see this method
    async fetchBrands(page = 1) {
      this.searching = true;
      await this.$axios
        .get(`/brands?page=${page}`)
        .then((res) => (this.brands = res.data))
        .catch((error) => {
          if (error.response.status === 401) {
            this.$auth.logout();
          }
        })
        .finally(() => (this.searching = false));
    },

    // This method asks the user for deleting brand confirmation
    confirm_destroy_brand(id, name) {
      this.$bvModal
        .msgBoxConfirm("Are you sure about deleting " + name + " brand?", {
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "Yes",
          cancelTitle: "Cancel",
          footerClass: "p-2 bg-light",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value === true) {
            this.destroy_brand(id);
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    // This method is deleting a brand and then fetches the brands again
    async destroy_brand(id) {
      const { data } = await this.$axios.$delete(`/brand/${id}`);
      this.makeToast("success", "success", "Brand deleted successfully!");
      this.fetchBrands();
    },

    // This method shows brand models in the table user should login to see this method
    async show_models(id, name) {
      this.searching_models = true;
      this.modalShow = true;
      this.currentBrandName = name;
      this.currentBrandId = id;
      this.models = "";
      await this.$axios
        .get(`/brand/${id}/models`)
        .then((res) => {
          this.model_name = name;
          this.models = res.data;
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.$auth.logout();
          }
        })
        .finally(() => (this.searching_models = false));
    },
    // This method changes the brand modal flag to True 
    showBrandModal(id, name) {
      this.editBrandModalShow = true;
      this.currentBrandId = id;
      this.currentBrandName = name;
    },
    // This method is editing the brand name
    editBrandUpdate(id) {
      this.editBrandForm.name = this.currentBrandName;
      this.editBrandForm
        .put(`/brand/${id}`)
        .then((res) => {
          this.editBrandModalShow = false;
          this.fetchBrands();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // This method changes the add a new brand modal flag to True  
    addBrandModal() {
      this.addBrandModalShow = true;
    },
    // This method changes the add a new model modal flag to True  
    addModelModal() {
      this.addModelModalShow = true;
    },
    // This method creates the new brand
    brandCreate() {
      this.addBrandForm
        .post(`/brand`)
        .then((res) => {
          this.addBrandForm.reset();
          this.addBrandModalShow = false;
          this.fetchBrands();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // This method creates the new model
    modelCreate() {
      this.addModelForm
        .post(`/model`)
        .then((res) => {
          this.addModelForm.reset();
          this.addModelModalShow = false;
          this.fetchBrands();
          this.show_models(res.data.data.brand.id, res.data.data.brand.name);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // This method changes the edit new model modal flag to True 
    edit_model(id, name) {
      this.editModelShow = true;
      this.currentModelName = name;
      this.currentModelId = id;
    },
    // This method updates the model
    editModelUpdate(modelId, brandId, brandName) {
      this.editModelForm.name = this.currentModelName;
      this.editModelForm
        .put(`/model/${modelId}`)
        .then((res) => {
          this.editModelShow = false;
          this.show_models(brandId, brandName);
          // this.editModelForm.reset();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // This method asks the user for deleting model confirmation
    confirm_destroy_model(id, name) {
      this.$bvModal
        .msgBoxConfirm("Are you sure about deleting " + name + " model?", {
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "Yes",
          cancelTitle: "Cancel",
          footerClass: "p-2 bg-light",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value === true) {
            this.destroy_model(id);
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    // This method is deleting a model and then shows the models modal again
    async destroy_model(id) {
      await this.$axios.$delete(`/model/${id}`).then((res) => {
        this.makeToast("success", "success", "Model deleted successfully!");
        this.modalShow = false;
        this.show_models(res.data.brand.id, res.data.brand.name);
      });
    },

    // This method is for searching the brands and models
    async search() {
      await this.$axios.get(`/search?s=${this.s}`).then((res) => {
        this.brands = res.data;
      });
    },

    // This method is for displaying the taosts
    makeToast(title, type = "info", message) {
      this.$bvToast.toast(message, {
        variant: type,
        toaster: "b-toaster-top-center",
        solid: true,
      });
    },
  },
};
</script>
