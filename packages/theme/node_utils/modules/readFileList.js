/**
 * Read all md file data
 */
const fs = require('fs'); // File system module
const path = require('path'); // Path module
const chalk = require('chalk') // CLI output styling
const log = console.log

function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    let filePath = path.join(dir, item);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && item !== '.vuepress' && item !== '@pages') {
      readFileList(path.join(dir, item), filesList);  // Recursively read files
    } else {
      if (path.basename(dir) !== 'docs') { // Filter out files at the docs directory level

        const filename = path.basename(filePath)
        const fileNameArr = filename.split('.')
        const firstDotIndex = filename.indexOf('.');
        const lastDotIndex = filename.lastIndexOf('.');

        let name = null, type = null;
        if (fileNameArr.length === 2) { // File without a sequence number
          name = fileNameArr[0]
          type = fileNameArr[1]
        } else if (fileNameArr.length >= 3) { // File with a sequence number (or filename contains '.')
          name = filename.substring(firstDotIndex + 1, lastDotIndex)
          type = filename.substring(lastDotIndex + 1)
        }

        if (type === 'md') { // Filter out non-md files
          filesList.push({
            name,
            filePath
          });
        }
      }
    }
  });
  return filesList;
}

module.exports = readFileList;
