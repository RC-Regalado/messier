<template>
  <v-app style="background: #eeeeee">
      <!--    <div id="nav">-->
      <!--      <router-link to="/">Home</router-link> |-->
      <!--      <router-link to="/designer">Designer</router-link> |-->
      <!--      <router-link to="/about">About</router-link>-->
      <!--    </div>-->
    <router-view/>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  })
}
</script>
