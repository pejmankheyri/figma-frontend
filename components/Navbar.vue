<template>
  <div class="d-flex justify-content-start mt-2">
    <div class="">Welcome {{ $auth.user.name }}</div>
    <div class="ml-1">
      <a class="" href="#" @click.prevent="logout">
        <i class="fa fa-lock"></i>
        Logout
      </a>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ["auth"],

  methods: {
    logout() {
      this.$auth.logout();
      this.$router.push("index");
    },
  },
};
</script>
