<template>
  <div class="theme-container">
    <div class="theme-vdone-content">
      <span>404</span>
      <blockquote>{{ getMsg() }}</blockquote>
      <router-link to="/">Back to Home</router-link>
    </div>
  </div>
</template>

<script>
const msgs = [
  `Nothing here.`,
  `Who am I? Where am I?`,
  `This is a Four-Oh-Four.`,
  `Looks like our link is broken.`
]

export default {
  methods: {
    getMsg () {
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  }
}
</script>

<style lang="stylus" scoped>
.theme-vdone-content
  margin 3rem auto
  padding 1.5rem
  span
    font-size 6rem
    color $accentColor
</style>
