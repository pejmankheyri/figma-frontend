<template>
  <div class="col-md-12 d-flex flex-row align-items-center mb-3 mt-3">
    <div>
      <nuxt-link :to="{ name: 'teams.show', params: { slug: team.slug } }">
        <img
          :src="team.logo"
          alt=""
          class="avatar w-50"
        />
        <div>
          <h4 class="">{{ team.name }}</h4>
          <h6 class="">{{ team.total_members }} member</h6>
        </div></nuxt-link
      >
    </div>
    <div class="d-flex justify-content-start align-content-start w-100">
      <template v-if="!team.designs.length > 0">
        <div class="p-4 w-100">
          <div class="container">
            <h6 class="text-center">Team still not has design !</h6>
          </div>
        </div>
      </template>
      <template v-else>
        <base-design
          v-for="(design, index) in team.designs.slice(0, 3)"
          :key="index"
          :design="design"
          class="col-md-4"
        ></base-design>
      </template>
    </div>
  </div>
  <!-- CARD -->
</template>

<script>
export default {
  props: {
    team: {
      type: Object,
      required: true,
    },
  },
}
</script>
