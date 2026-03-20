const fs = require('fs'); // File system module
const matter = require('gray-matter'); // FrontMatter parser https://github.com/jonschlinkert/gray-matter
const jsonToYaml = require('json2yaml')
const chalk = require('chalk') // CLI output styling
// const arg = process.argv.splice(2)[0]; // Get argument passed via command line
const readFileList = require('./modules/readFileList');
const { type, repairDate, dateFormat } = require('./modules/fn');
const log = console.log
const path = require('path');
const os = require('os');

const PREFIX = '/pages/'

/**
 * Set frontmatter (title, date, permalink, etc.) for .md files
 */
function setFrontmatter(sourceDir, themeConfig) {
  const { category: isCategory, tag: isTag, categoryText = 'Essay', extendFrontmatter } = themeConfig
  const files = readFileList(sourceDir) // Read all md file data
  // Extend custom-generated frontmatter
  const extendFrontmatterStr = extendFrontmatter ?
    jsonToYaml.stringify(extendFrontmatter)
      .replace(/\n\s{2}/g, "\n")
      .replace(/"|---\n/g, "")
    : '';

  files.forEach(file => {
    let dataStr = fs.readFileSync(file.filePath, 'utf8'); // Read each md file content

    // fileMatterObj => {content:'file content string without frontmatter', data:{<frontmatter object>}, ...}
    const fileMatterObj = matter(dataStr, {});

    if (Object.keys(fileMatterObj.data).length === 0) { // No FrontMatter data defined
      const stat = fs.statSync(file.filePath);
      const dateStr = dateFormat(
        getBirthtime(stat)
      ); // File creation time
      const categories = getCategories(
        file,
        categoryText
      );

      let cateLabelStr = '';
      categories.forEach(item => {
        cateLabelStr += os.EOL + '  - ' + item
      });

      let cateStr = '';
      if (!(isCategory === false)) {
        cateStr = os.EOL + 'categories:' + cateLabelStr
      };

      // Note: the formatting of the template literals below maps directly to the file
      const tagsStr = isTag === false ? '' : `
tags:
  - `;

      const fmData = `---
title: ${file.name}
date: ${dateStr}
permalink: ${getPermalink()}${file.filePath.indexOf('_posts') > -1 ? os.EOL + 'sidebar: auto' : ''}${cateStr}${tagsStr}
${extendFrontmatterStr}---`;

      fs.writeFileSync(file.filePath, `${fmData}${os.EOL}${fileMatterObj.content}`); // Write to file
      log(chalk.blue('tip ') + chalk.green(`write frontmatter: ${file.filePath} `))

    } else { // FrontMatter already exists
      let matterData = fileMatterObj.data;
      let hasChange = false;

      // FrontMatter exists but missing title, date, permalink, categories, or tags
      if (!matterData.hasOwnProperty('title')) { // Title
        matterData.title = file.name;
        hasChange = true;
      }

      if (!matterData.hasOwnProperty('date')) { // Date
        const stat = fs.statSync(file.filePath);
        matterData.date = dateFormat(getBirthtime(stat));
        hasChange = true;
      }

      if (!matterData.hasOwnProperty('permalink')) { // Permalink
        matterData.permalink = getPermalink();
        hasChange = true;
      }

      if (file.filePath.indexOf('_posts') > -1 && !matterData.hasOwnProperty('sidebar')) { // Auto sidebar, specific to _posts folder
        matterData.sidebar = "auto";
        hasChange = true;
      }

      if (!matterData.hasOwnProperty('pageComponent') && matterData.article !== false) { // Only add categories and tags for article pages
        if (isCategory !== false && !matterData.hasOwnProperty('categories')) { // Categories
          matterData.categories = getCategories(file, categoryText)
          hasChange = true;
        }
        if (isTag !== false && !matterData.hasOwnProperty('tags')) { // Tags
          matterData.tags = [''];
          hasChange = true;
        }
      }

      // Extend auto-generated frontmatter fields
      if (type(extendFrontmatter) === 'object') {
        Object.keys(extendFrontmatter).forEach(keyName => {
          if (!matterData.hasOwnProperty(keyName)) {
            matterData[keyName] = extendFrontmatter[keyName]
            hasChange = true;
          }
        })
      }

      if (hasChange) {
        if (matterData.date && type(matterData.date) === 'date') {
          matterData.date = repairDate(matterData.date) // Fix date format
        }
        const newData = jsonToYaml.stringify(matterData).replace(/\n\s{2}/g, "\n").replace(/"/g, "") + '---' + os.EOL + fileMatterObj.content;
        fs.writeFileSync(file.filePath, newData); // Write to file
        log(chalk.blue('tip ') + chalk.green(`write frontmatter: ${file.filePath} `))
      }

    }
  })
}

// Get category data
function getCategories(file, categoryText) {
  let categories = []

  if (file.filePath.indexOf('_posts') === -1) {
    // Not in _posts folder
    let filePathArr = file.filePath.split(path.sep) // path.sep for cross-platform path separator compatibility
    filePathArr.pop()

    let ind = filePathArr.indexOf('docs')
    if (ind !== -1) {
      while (filePathArr[++ind] !== undefined) {
        const item = filePathArr[ind]
        const firstDotIndex = item.indexOf('.');
        categories.push(item.substring(firstDotIndex + 1) || '') // Get category
        // categories.push(filePathArr[ind].split('.').pop()) // Get category
      }
    }
  } else {
    // Generate categories for fragmented posts
    const matchResult = file.filePath.match(/_posts\/(\S*)\//);
    const resultStr = matchResult ? matchResult[1] : ''
    const resultArr = resultStr.split('/').filter(Boolean)

    if (resultArr.length) {
      categories.push(...resultArr)
    } else {
      categories.push(categoryText)
    }
  }
  return categories
}

// Get file creation time
function getBirthtime(stat) {
  // On some systems birthtime is not available correctly, use atime as fallback
  return stat.birthtime.getFullYear() != 1970 ? stat.birthtime : stat.atime
}

// Generate permalink data
function getPermalink() {
  return `${PREFIX + (Math.random() + Math.random()).toString(16).slice(2, 8)}/`
}


module.exports = setFrontmatter;
