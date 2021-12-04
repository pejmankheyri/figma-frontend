<template>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <a class="" href="#" @click.prevent="logout">
        <i class="fa fa-lock"></i>
        Logout
      </a>
      <div class="col-md-12 d-flex mt-5">
        <div class="col-md-6">
          <h2>Squarelovin <span class="nuxt-text">Test Task</span> Nuxt</h2>
        </div>
        <div class="col-md-6 d-flex justify-content-end">
          <form class="form-inline my-2 my-lg-0">
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </form>
          <div class="form-inline my-2 my-lg-0">
            <b-dropdown id="dropdown-1" text="Add Car / Brand" class="m-md-2">
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
                  />
                  <div
                    class="text-danger m-3"
                    v-if="addBrandForm.errors.has('name')"
                    v-html="addBrandForm.errors.get('name')"
                  />
                  <button
                    class="form-control button"
                    type="submit"
                    :disabled="addBrandForm.busy"
                  >
                    Save
                  </button>
                </form>
              </b-modal>
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

                  <button
                    class="form-control button"
                    type="submit"
                    :disabled="addModelForm.busy"
                  >
                    Save
                  </button>
                </form>
              </b-modal>
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
                    <b-button @click.prevent="show_models(brand.id, brand.name)"
                      ><i class="fas fa-search"></i
                    ></b-button>

                    <b-modal v-model="modalShow" ok-only>
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
                                          model.id,
                                          brand.id,
                                          brand.name,
                                          model.name
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
                                      <button
                                        class="form-control button"
                                        type="submit"
                                        :disabled="editModelForm.busy"
                                      >
                                        Save
                                      </button>
                                    </form>
                                  </b-modal>
                                  <b-button
                                    class="text-danger"
                                    @click.prevent="
                                      confirm_destroy_model(model.id)
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
                              There is no Models for this Brand !
                            </h6>
                          </div>
                        </div>
                      </template>
                    </b-modal>

                    <base-button type="info" size="sm">
                      <i class="far fa-edit"></i>
                    </base-button>

                    <a
                      href="#"
                      class="text-danger"
                      @click.prevent="confirm_destroy(brand.id)"
                      ><base-button type="danger" size="sm">
                        <i class="fas fa-trash"></i> </base-button
                    ></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pagin row d-block mt-2 mb-2 d-flex justify-content-end">
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

export default {
  middleware: ["auth"],
  data: () => ({
    modalShow: false,
    editModelShow: false,
    addBrandModalShow: false,
    addModelModalShow: false,
    models: {},
    brands: {},
    model_name: {},
    currentModelName: {},
    searching: false,
    searching_models: false,
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
      title: "Figma Brands",
      meta: [
        {
          hid: "Figma Brands",
          name: "Figma Brands",
          content: "Figma Brands",
        },
      ],
    };
  },
  created() {
    this.fetchBrands();
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
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
    save() {
      this.form
        .post(`/brand`)
        .then((res) => {
          this.form.reset();
          this.fetchBrands();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.$auth.logout();
          }
        });
    },
    confirm_destroy(id) {
      this.$bvModal
        .msgBoxConfirm("Are you sure about deleting brand?", {
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "yes",
          cancelTitle: "cancel",
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
    async destroy_brand(id) {
      console.log(id);
      const { data } = await this.$axios.$delete(`/brand/${id}`);
      this.makeToast("success", "success", "Brand deleted successfully!");
      this.fetchBrands();
    },
    makeToast(title, type = "info", message) {
      this.$bvToast.toast(message, {
        variant: type,
        toaster: "b-toaster-top-center",
        solid: true,
      });
    },
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
    async show_models(id, name) {
      this.searching_models = true;
      this.modalShow = true;
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
    addBrandModal() {
      this.addBrandModalShow = true;
    },
    addModelModal() {
      this.addModelModalShow = true;
    },
    async edit_model(id, name) {
      this.editModelShow = true;
      this.currentModelName = name;
    },
    editModelUpdate(id, brandId, brandName, name) {
      console.log(brandId);
      this.editModelForm.name = this.currentModelName;
      this.editModelForm
        .put(`/model/${id}`)
        .then((res) => {
          this.editModelShow = false;
          this.show_models(brandId, brandName);
          console.log(res);
          // this.editModelForm.reset();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    confirm_destroy_model(id) {
      this.$bvModal
        .msgBoxConfirm("Are you sure about deleting model?", {
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "yes",
          cancelTitle: "cancel",
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
    async destroy_model(id) {
      await this.$axios.$delete(`/model/${id}`).then((res) => {
        this.makeToast("success", "success", "Model deleted successfully!");
        this.modalShow = false;
        this.show_models(res.data.brand.id, res.data.brand.name);
      });
    },
  },
};
</script>
