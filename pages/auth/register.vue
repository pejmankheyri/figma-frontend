<template>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mt-5">
          Sign Up To <span class="nuxt-text">Nuxt</span> Cars<br />
          & Car Brands
        </h1>
        <form @submit.prevent="register" @keydown="form.onKeydown($event)">
          <input
            class="form-control form-control-lg font-14 fw-300 m-3"
            v-model="form.name"
            type="text"
            name="name"
            placeholder="Name"
          />
          <div
            class="text-danger m-3"
            v-if="form.errors.has('name')"
            v-html="form.errors.get('name')"
          />

          <input
            class="form-control form-control-lg font-14 fw-300 m-3"
            v-model="form.email"
            type="text"
            name="email"
            placeholder="Email Address"
          />
          <div
            class="text-danger m-3"
            v-if="form.errors.has('email')"
            v-html="form.errors.get('email')"
          />

          <input
            class="form-control form-control-lg font-14 fw-300 m-3"
            v-model="form.password"
            type="password"
            name="password"
            placeholder="Password"
          />
          <div
            class="text-danger m-3"
            v-if="form.errors.has('password')"
            v-html="form.errors.get('password')"
          />

          <input
            class="form-control form-control-lg font-14 fw-300 m-3"
            v-model="form.password_confirmation"
            type="password"
            name="password_confirmation"
            placeholder="Password Confirmation"
          />
          <div
            class="text-danger m-3"
            v-if="form.errors.has('password_confirmation')"
            v-html="form.errors.get('password_confirmation')"
          />

          <button
            class="form-control form-control-lg button m-3"
            type="submit"
            :disabled="form.busy"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "vform";

export default {
  middleware: ["guest"],
  data: () => ({
    form: new Form({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    }),
  }),

  methods: {
    register() {
      this.form
        .post(`/register`)
        .then((res) => {
          this.form.reset();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>