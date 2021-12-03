<template>
  <div class="col-md-8 ml-auto mr-auto">
    <div class="col-md-12 d-flex flex-row align-items-center mb-3 mt-3">
      <div>
        <img :src="designer.avatar" alt="" class="avatar w-75" />
      </div>
      <div class="d-flex justify-content-between align-content-start w-100">
        <div>
          <h4 class="">{{ designer.name }}</h4>

          <h6 class="">{{ designer.tagline }}</h6>
        </div>

        <div v-if="designer.available_to_hire">
          <p class="text-success">
            <small>
              Ready to hire <i class="far fa-check-square"></i>
            </small>
          </p>
        </div>
        <div v-else>
          <p class="text-danger">
            <small>
              Not ready to hire <i class="far fa-window-close"></i>
            </small>
          </p>
        </div>
      </div>
    </div>

    <div class="designers-card d-flex justify-content-start">
      <template v-if="!designer.designs.length > 0">
        <div class="p-4 w-100">
          <div class="container">
            <h6 class="text-center">No designs for designer !</h6>
            <div
              v-if="$auth.loggedIn && $auth.user.id === designer.id"
              class="m-2"
            >
              <nuxt-link :to="{ name: 'designs.create' }">
                <base-button :block="true" size="sm"
                  >Upload New Design</base-button
                >
              </nuxt-link>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
          <base-design
            v-for="(design, index) in designer.designs.slice(0, 3)"
            :key="index"
            :design="design"
            column="col-md-4 col-sm-4 col-xs-12"
          ></base-design>
      </template>
    </div>
  </div>
  <!-- CARD -->
</template>

<script>
export default {
  props: {
    designer: {
      type: Object,
      required: true,
    },
  },
}
</script>
