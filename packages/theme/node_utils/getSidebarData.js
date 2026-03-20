const fs = require('fs'); // File system module
const path = require('path'); // Path module
const chalk = require('chalk') // CLI output styling
const matter = require('gray-matter'); // Front matter parser
const log = console.log

let catalogueData = {}; // Catalogue page data

/**
 * Generate sidebar data
 * @param {String} sourceDir Source directory containing .md files (usually the docs directory)
 * @param {Boolean} collapsable Whether sections are collapsible
 */
function createSidebarData(sourceDir, collapsable) {
  const sidebarData = {};
  const tocs = readTocs(sourceDir);
  tocs.forEach(toc => { // toc is the absolute path of each directory

    if (toc.substr(-6) === '_posts') { // Fragmented posts

      // Note: fragmented posts do not need structured sidebar generation 2020.05.01
      // const sidebarArr = mapTocToPostSidebar(toc);
      // sidebarData[`/${path.basename(toc)}/`] = sidebarArr

    } else {
      const sidebarObj = mapTocToSidebar(toc, collapsable);
      if (!sidebarObj.sidebar.length) {
        log(chalk.yellow(`warning: the directory "${toc}" has no files or has incorrect file numbering, skipping sidebar generation`))
        return;
      }
      sidebarData[`/${path.basename(toc)}/`] = sidebarObj.sidebar
      sidebarData.catalogue = sidebarObj.catalogueData
    }
  })

  return sidebarData
}

module.exports = createSidebarData;


/**
 * Read absolute file paths in the specified directory
 * @param {String} root The specified directory
*/
function readTocs(root) {
  const result = [];
  const files = fs.readdirSync(root); // Read directory, returns array of all entries under root (including folders and files)
  files.forEach(name => {
    const file = path.resolve(root, name); // Resolve path segments into an absolute path
    if (fs.statSync(file).isDirectory() && name !== '.vuepress' && name !== '@pages') { // Check if it is a directory, excluding .vuepress folder
      result.push(file);
    }
  })
  return result;
}


/**
 * Map the fragmented posts directory (_posts) to corresponding sidebar config data
 * @param {String} root
 */
function mapTocToPostSidebar(root) {
  let postSidebar = [] // Fragmented post data
  const files = fs.readdirSync(root); // Read directory (files and folders), returns array

  files.forEach(filename => {
    const file = path.resolve(root, filename); // Resolve path segments into an absolute path
    const stat = fs.statSync(file); // File info

    const fileNameArr = filename.split('.');
    if (fileNameArr.length > 2) {
      log(chalk.yellow(`warning: the file "${file}" is in _posts folder and should not have a sequence number, and the filename should not contain '.'`))
      return
    }
    if (stat.isDirectory()) { // Is a directory
      // log(chalk.yellow(`warning: files in the directory "${file}" cannot generate sidebar, _posts folder cannot have subdirectories.`))
      return
    }

    let [title, type] = filename.split('.');
    if (type !== 'md') {
      log(chalk.yellow(`warning: the file "${file}" is not a .md file, this file type is not supported`))
      return;
    }

    const contentStr = fs.readFileSync(file, 'utf8') // Read md file content, returns string
    const { data } = matter(contentStr, {}) // Parse front matter data
    const { permalink = '', titleTag = '' } = data || {}
    if (data.title) {
      title = data.title
    }
    const item = [filename, title, permalink]
    if (titleTag) {
      item.push(titleTag)
    }
    postSidebar.push(item);  // [<path>, <title>, <permalink>, <?titleTag>]
  })

  return postSidebar
}


/**
 * Map a directory to corresponding sidebar config data
 * @param {String} root
 * @param {Boolean} collapsable
 * @param {String} prefix
 */

function mapTocToSidebar(root, collapsable, prefix = '') {
  let sidebar = []; // Structured article sidebar data
  const files = fs.readdirSync(root); // Read directory (files and folders), returns array

  files.forEach(filename => {
    const file = path.resolve(root, filename); // Resolve path segments into an absolute path
    const stat = fs.statSync(file); // File info
    if (filename === '.DS_Store') { // Filter out .DS_Store files
      return
    }
    // let [order, title, type] = filename.split('.');

    const fileNameArr = filename.split('.')
    const isDir = stat.isDirectory()
    let order = '', title = '', type = '';
    if (fileNameArr.length === 2) {
      order = fileNameArr[0];
      title = fileNameArr[1];
    } else {
      const firstDotIndex = filename.indexOf('.');
      const lastDotIndex = filename.lastIndexOf('.');
      order = filename.substring(0, firstDotIndex);
      type = filename.substring(lastDotIndex + 1);
      if (isDir) {
        title = filename.substring(firstDotIndex + 1);
      } else {
        title = filename.substring(firstDotIndex + 1, lastDotIndex);
      }
    }

    order = parseInt(order, 10);
    if (isNaN(order) || order < 0) {
      log(chalk.yellow(`warning: the file "${file}" has an invalid sequence number, please provide a correct one`))
      return;
    }
    if (sidebar[order]) { // Check if the sequence number already exists
      log(chalk.yellow(`warning: the file "${file}" has a duplicate sequence number at the same level, it will be overwritten`))
    }
    if (isDir) { // Is a directory
      sidebar[order] = {
        title,
        collapsable, // Whether collapsible, default true
        children: mapTocToSidebar(file, collapsable, prefix + filename + '/').sidebar // Add prefix to child paths
      }
    } else { // Is a file
      if (type !== 'md') {
        log(chalk.yellow(`warning: the file "${file}" is not a .md file, this file type is not supported`))
        return;
      }
      const contentStr = fs.readFileSync(file, 'utf8') // Read md file content, returns string
      const { data } = matter(contentStr, {}) // Parse front matter data
      const { permalink = '', titleTag = '' } = data || {}

      // Permalink for the catalogue page, used to provide breadcrumb links
      const { pageComponent } = data
      if (pageComponent && pageComponent.name === "Catalogue") {
        catalogueData[title] = permalink
      }

      if (data.title) {
        title = data.title
      }
      const item = [prefix + filename, title, permalink]
      if (titleTag) item.push(titleTag)
      sidebar[order] = item;  // [<path>, <title>, <permalink>, <?titleTag>]

    }
  })

  sidebar = sidebar.filter(item => item !== null && item !== undefined);
  return {
    sidebar,
    catalogueData
  };
}
