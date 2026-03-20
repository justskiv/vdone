// Fix code tab loading issue
import Vue from 'vue'
import CodeBlock from "@theme/global-components/CodeBlock.vue"
import CodeGroup from "@theme/global-components/CodeGroup.vue"
// Register the Vue global component
Vue.component(CodeBlock)
Vue.component(CodeGroup)

// Note: this file runs on the browser side
import postsMixin from '@theme/mixins/posts'
export default ({
  Vue, // The Vue constructor used by VuePress
  options, // Options attached to the root instance
  router, // The router instance of the current app
  siteData // Site metadata
}) => {
  // Convert ISO8601 date format to standard format, and add author info
  siteData.pages.map(item => {
    const { frontmatter: { date, author } } = item
    if (typeof date === 'string' && date.charAt(date.length - 1) === 'Z') {
      item.frontmatter.date = repairUTCDate(date)
    }
    if (author) {
      item.author = author
    } else {
      if (siteData.themeConfig.author) {
        item.author = siteData.themeConfig.author
      }
    }
  })

  // Mix the processed post data into the Vue instance
  Vue.mixin(postsMixin)
}


// Convert ISO8601 date format to standard date format
function repairUTCDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  return `${date.getUTCFullYear()}-${zero(date.getUTCMonth() + 1)}-${zero(date.getUTCDate())} ${zero(date.getUTCHours())}:${zero(date.getUTCMinutes())}:${zero(date.getUTCSeconds())}`;
}
// Pad with leading zero if less than 10
function zero(d) {
  return d.toString().padStart(2, '0')
}
