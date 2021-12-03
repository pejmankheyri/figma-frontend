<template>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mt-5">
          Login To <span class="nuxt-text">Nuxt</span> Cars<br />
          & Car Brands
        </h1>
        <form @submit.prevent="login" @keydown="form.onKeydown($event)">
          <input
            class="form-control form-control-lg font-14 fw-300 m-3"
            v-model="form.username"
            type="text"
            name="username"
            placeholder="Email Address"
          />
          <div
            v-if="form.errors.has('username')"
            v-html="form.errors.get('username')"
          />

          <input
            class="form-control form-control-lg font-14 fw-300 m-3"
            v-model="form.password"
            type="password"
            name="password"
            placeholder="Password"
          />
          <div
            v-if="form.errors.has('password')"
            v-html="form.errors.get('password')"
          />

          <button
            class="form-control form-control-lg button m-3"
            type="submit"
            :disabled="form.busy"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from "vform";

export default {
  data: () => ({
    form: new Form({
      username: "",
      password: "",
    }),
  }),

  methods: {
    async login() {
      const response = await this.form.post("/login");
      // ...
    },
  },
};
</script>