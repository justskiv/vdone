// Create or delete pages (categories page, tags page, archives page...)

const fs = require('fs'); // File system module
const path = require('path'); // Path module
const chalk = require('chalk') // CLI output styling
const { type } = require('./modules/fn');
const log = console.log

function createPage (sourceDir, page) {
  const dirPath = path.join(sourceDir, '@pages') // Generated folder path

  // When the folder does not exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath) // Create folder
  }

  const pagePath = path.join(dirPath, `${page}.md`) // Generated file path

  // Skip if the file already exists
  if (fs.existsSync(pagePath)) {
    return
  }

  // Note: the formatting of template literals maps directly to the file
  let content = ''
  if (page.indexOf('categories') > -1) {
    content = `---
categoriesPage: true
title: Categories
permalink: /categories/
article: false
---`
  } else if (page.indexOf('tags') > -1) {
    content = `---
tagsPage: true
title: Tags
permalink: /tags/
article: false
---`
  } else if (page.indexOf('archives') > -1) {
    content = `---
archivesPage: true
title: Archives
permalink: /archives/
article: false
---`
  }

  if (content) {
    fs.writeFileSync(pagePath, content)
    log(chalk.blue('tip ') + chalk.green(`create page: ${pagePath}`))
  }
}

// Delete page file
function deletePage (sourceDir, page) {
  const dirPath = path.join(sourceDir, '@pages') // Folder path
  const pagePath = path.join(dirPath, `${page}.md`) // File path

  // Check if the file exists
  if (fs.existsSync(pagePath)) {
    fs.unlinkSync(pagePath)
    log(chalk.blue('tip ') + chalk.green(`delete page: ${pagePath}`))
  }
  deleteDir(dirPath)
}

// Delete directory
function deleteDir (dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath)
    if (type(files) === 'array' && files.length === 0) {
      fs.rmdirSync(dirPath)
      log(chalk.blue('tip ') + chalk.green(`delete dir: ${dirPath}`))
    }
  }
}

module.exports = {
  createPage,
  deletePage
}
