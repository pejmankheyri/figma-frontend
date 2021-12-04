<template>
  <div class="container">
    <div class="row d-flex justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mt-5">
          Login To <span class="nuxt-text">Nuxt</span> Cars<br />
          & Car Brands
        </h1>
        <form @submit.prevent="login" @keydown="loginData.onKeydown($event)">
          <input
            class="form-control form-control-lg font-14 fw-300 m-3"
            v-model="loginData.email"
            type="text"
            name="email"
            placeholder="Email Address"
          />
          <div
            class="text-danger m-3"
            v-if="loginData.errors.has('email')"
            v-html="loginData.errors.get('email')"
          />

          <input
            class="form-control form-control-lg font-14 fw-300 m-3"
            v-model="loginData.password"
            type="password"
            name="password"
            placeholder="Password"
          />
          <div
            class="text-danger m-3"
            v-if="loginData.errors.has('password')"
            v-html="loginData.errors.get('password')"
          />

          <button
            class="form-control form-control-lg button m-3"
            type="submit"
            :disabled="loginData.busy"
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
  middleware: ["guest"],
  data: () => ({
    loginData: new Form({
      email: "",
      password: "",
    }),
  }),

  methods: {
    login() {
      this.loading = true;
      this.$auth
        .loginWith("local", {
          data: this.loginData,
        })
        .then((res) => {
          console.log(res);
          this.loading = false;
        })
        .catch((e) => {
          this.form.errors.set(e.response.data.errors);
          this.loading = false;
        });
    },
  },
};
</script>