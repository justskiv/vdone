import { filterPosts, sortPosts, sortPostsByDate, groupPosts, categoriesAndTags } from '../util/postData'

export default {
  computed: {
    $filterPosts () { // Post data with non-article and home pages filtered out
      return filterPosts(this.$site.pages)
    },
    $sortPosts () { // Post data sorted by sticky priority and date
      return sortPosts(this.$filterPosts)
    },
    $sortPostsByDate () { // Post data sorted by date only
      return sortPostsByDate(this.$filterPosts)
    },
    $groupPosts () { // Post data grouped by categories and tags
      return groupPosts(this.$sortPosts)
    },
    $categoriesAndTags () { // All categories and tags data
      return categoriesAndTags(this.$groupPosts)
    }
  }
}
