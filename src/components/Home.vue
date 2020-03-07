<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      window.localStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
