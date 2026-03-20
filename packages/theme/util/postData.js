import { type, compareDate } from './index'

/**
 * Filter out non-article pages
 * @param {Array} posts All post data
 */
export function filterPosts (posts) {
  posts = posts.filter(item => {
    const { frontmatter: { pageComponent, article, home } } = item
    return !(pageComponent || article === false || home === true) // Exclude page components, pages with article=false, and home page
  })
  return posts
}

/**
 * Sort by sticky priority and date
 * @param {Array} posts Filtered post data (non-article pages excluded)
 */
export function sortPosts (posts) {
  posts.sort((prev, next) => {
    const prevSticky = prev.frontmatter.sticky
    const nextSticky = next.frontmatter.sticky
    if (prevSticky && nextSticky) {
      return prevSticky == nextSticky ? compareDate(prev, next) : (prevSticky - nextSticky)
    } else if (prevSticky && !nextSticky) {
      return -1
    } else if (!prevSticky && nextSticky) {
      return 1
    }
    return compareDate(prev, next)
  })
  return posts
}

/**
 * Sort by date
 * @param {Array} posts Filtered post data (non-article pages excluded)
 */
export function sortPostsByDate (posts) {
  posts.sort((prev, next) => {
    return compareDate(prev, next)
  })
  return posts
}

/**
 * Group posts by categories and tags
 * @param {Array} posts Post data sorted by date
 */
export function groupPosts (posts) {
  const categoriesObj = {}
  const tagsObj = {}

  for (let i = 0, postsL = posts.length; i < postsL; i++) {
    const { frontmatter: { categories, tags } } = posts[i]
    if (type(categories) === 'array') {
      categories.forEach(item => {
        if (item) { // Category value is valid
          if (!categoriesObj[item]) {
            categoriesObj[item] = []
          }
          categoriesObj[item].push(posts[i])
        }
      })
    }
    if (type(tags) === 'array') {
      tags.forEach(item => {
        if (item) { // Tag value is valid
          if (!tagsObj[item]) {
            tagsObj[item] = []
          }
          tagsObj[item].push(posts[i])
        }
      })
    }
  }
  return {
    categories: categoriesObj,
    tags: tagsObj
  }
}

/**
 * Get all categories and tags
 * @param {Object} groupPosts Post data grouped by categories and tags
 */
export function categoriesAndTags (groupPosts) {
  const categoriesArr = []
  const tagsArr = []

  for (let key in groupPosts.categories) {
    categoriesArr.push({
      key,
      length: groupPosts.categories[key].length
    })
  }

  for (let key in groupPosts.tags) {
    tagsArr.push({
      key,
      length: groupPosts.tags[key].length
    })
  }
  return {
    categories: categoriesArr,
    tags: tagsArr
  }
}
