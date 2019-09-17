<template>
  <div id="app">
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <!--<menu-card></menu-card>-->
    <router-view></router-view>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import menuCard from './components/menu'
export default {
  name: 'app',
  components: {
      // menuCard
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
