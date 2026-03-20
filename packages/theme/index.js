const path = require('path')
const setFrontmatter = require('./node_utils/setFrontmatter')
const getSidebarData = require('./node_utils/getSidebarData')
const { createPage, deletePage } = require('./node_utils/handlePage')
const chalk = require('chalk') // CLI output styling
const yaml = require('js-yaml') // YAML to JS conversion
const log = console.log

// Markdown container names
const CARD_LIST = 'cardList'
const CARD_IMG_LIST = 'cardImgList'

// siteConfig base setting
let base = ''


// Theme API.
module.exports = (options, ctx) => {
  const { sourceDir, themeConfig, siteConfig } = ctx

  // Base path
  base = siteConfig.base || ''

  // Automatically set front matter
  setFrontmatter(sourceDir, themeConfig)

  // Auto-generate structured sidebar
  const sidebar = themeConfig.sidebar
  if (sidebar === 'structuring' || sidebar && sidebar.mode === 'structuring') {
    const collapsable = themeConfig.sidebar.collapsable === false ? false : true
    const sidebarData = getSidebarData(sourceDir, collapsable)
    if (sidebarData) {
      themeConfig.sidebar = sidebarData
      log(chalk.blue('tip ') + chalk.green('Successfully generated sidebar data.'))
    } else {
      themeConfig.sidebar = 'auto'
      log(chalk.yellow('Warning: Failed to generate sidebar data, switching to “auto”.'))
    }
  }

  // Categories page
  if (themeConfig.category !== false) {
    createPage(sourceDir, 'categoriesPage')
  } else {
    deletePage(sourceDir, 'categoriesPage')
  }

  // Tags page
  if (themeConfig.tag !== false) {
    createPage(sourceDir, 'tagsPage')
  } else {
    deletePage(sourceDir, 'tagsPage')
  }

  // Archives page
  if (themeConfig.archive !== false) {
    createPage(sourceDir, 'archivesPage')
  } else {
    deletePage(sourceDir, 'archivesPage')
  }

  // resolve algolia
  const isAlgoliaSearch = (
    themeConfig.algolia
    || Object
      .keys(siteConfig.locales && themeConfig.locales || {})
      .some(base => themeConfig.locales[base].algolia)
  )

  const enableSmoothScroll = themeConfig.smoothScroll === true

  return {
    alias() {
      return {
        '@AlgoliaSearchBox': isAlgoliaSearch
          ? path.resolve(__dirname, 'components/AlgoliaSearchBox.vue')
          : path.resolve(__dirname, 'noopModule.js')
      }
    },

    plugins: [
      ['@vuepress/active-header-links', options.activeHeaderLinks],
      '@vuepress/search',
      '@vuepress/plugin-nprogress',
      ['smooth-scroll', enableSmoothScroll],

      ['container', {
        type: 'note',
        defaultTitle: {
          '/': 'Note',
          '/en/': 'NOTE'
        }
      }],
      ['container', {
        type: 'tip',
        defaultTitle: {
          '/': 'Tip',
          '/en/': 'TIP'
        }
      }],
      ['container', {
        type: 'warning',
        defaultTitle: {
          '/': 'Warning',
          '/en/': 'WARNING'
        }
      }],
      ['container', {
        type: 'danger',
        defaultTitle: {
          '/': 'Danger',
          '/en/': 'WARNING'
        }
      }],
      ['container', {
        type: 'right',
        defaultTitle: ''
      }],
      ['container', {
        type: 'theorem',
        before: info => `<div class="custom-block theorem"><p class="title">${info}</p>`,
        after: '</div>'
      }],
      ['container', {
        type: 'details',
        before: info => `<details class="custom-block details">${info ? `<summary>${info}</summary>` : ''}\n`,
        after: () => '</details>\n',
        defaultTitle: {
          '/': 'Details',
          '/en/': 'DETAILS'
        }
      }],

      // Center-aligned content container
      ['container', {
        type: 'center',
        before: info => `<div class="center-container">`,
        after: () => '</div>'
      }],

      // Card list
      [
        'container',
        {
          type: CARD_LIST,
          render: (tokens, idx) => {
            // tokens is the virtual DOM structure array for the entire md file
            // idx is the index of ':::' in tokens for the current specified type, occurring twice for opening and closing
            // if (tokens[idx].nesting === 1) { // opening ':::' marker
            // } else { // closing ':::' marker
            // }
            // Note: after modifying code here, you need to save the md file to trigger re-rendering
            return renderCardList(tokens, idx, CARD_LIST)
          }
        },
      ],

      // Image card list
      [
        'container',
        {
          type: CARD_IMG_LIST,
          render: (tokens, idx) => {
            return renderCardList(tokens, idx, CARD_IMG_LIST)
          }
        },
      ],


    ]
  }
}


// Render the card list for the md container
function renderCardList(tokens, idx, type) {
  const END_TYPE = `container_${type}_close`,
    _tokens$idx = tokens[idx],
    nesting = _tokens$idx.nesting,
    info = _tokens$idx.info;

  if (nesting === 1) { // Render the opening ':::' marker
    let yamlStr = '';

    for (let i = idx; i < tokens.length; i++) {
      let _tokens$i = tokens[i],
        type = _tokens$i.type,
        content = _tokens$i.content,
        _info = _tokens$i.info;
      if (type === END_TYPE) break; // When encountering the closing ':::'
      if (!content) continue;
      if (type === 'fence' && _info === 'yaml') { // Is a code block of yaml type
        yamlStr = content
      }
    }

    if (yamlStr) { // After successfully parsing the yaml string
      const dataObj = yaml.safeLoad(yamlStr) // Parse yaml string into JS object
      let dataList = []
      let config = {}

      if (dataObj) { // Successfully parsed the data object
        if (Array.isArray(dataObj)) {
          dataList = dataObj
        } else {
          config = dataObj.config
          dataList = dataObj.data
        }
      }

      if (dataList && dataList.length) { // Has list data

        // Number of items to display per row
        let row = Number(info.split(' ').pop())
        if (!row || row > 4 || row < 1) {
          row = 3 // Default 3
        }

        let listDOM = ''
        if (type === CARD_LIST) { // Standard card list
          listDOM = getCardListDOM(dataList, row, config)
        } else if (type === CARD_IMG_LIST) { // Image card list
          listDOM = getCardImgListDOM(dataList, row, config)
        }

        return `<div class="${type}Container"><div class="card-list">${listDOM}</div>`
      }
    }
  } else { // Render the closing ':::'
    return '</div>'
  }
}


// Parse data into DOM structure - standard card list
function getCardListDOM(dataList, row, config) {
  const { target = '_blank' } = config
  let listDOM = ''
  dataList.forEach(item => {
    listDOM += `
      <${item.link ? 'a href="' + withBase(item.link) + '" target="' + target + '"' : 'span'} class="card-item ${row ? 'row-' + row : ''}"
         style="${item.bgColor ? 'background-color:' + item.bgColor + ';--randomColor:' + item.bgColor + ';' : '--randomColor: var(--bodyBg);'}${item.textColor ? 'color:' + item.textColor + ';' : ''}"
      >
        ${item.avatar ? '<img src="' + withBase(item.avatar) + '" class="no-zoom">' : ''}
        <div>
          <p class="name">${item.name}</p>
          <p class="desc">${item.desc}</p>
        </div>
      </${item.link ? 'a' : 'span'}>
    `
  })
  return listDOM
}


// Parse data into DOM structure - image card list
function getCardImgListDOM(dataList, row, config) {
  const { imgHeight = 'auto', objectFit = 'cover', lineClamp = 1, target = '_blank' } = config

  let listDOM = ''
  dataList.forEach(item => {
    listDOM += `
      <div class="card-item ${row ? 'row-' + row : ''}" >
        <a href="${withBase(item.link)}" target="${target}">
          <div class="box-img" style="height: ${imgHeight}">
              <img src="${withBase(item.img)}" class="no-zoom" style="object-fit: ${objectFit}">
          </div>
          <div class="box-info">
              <p class="name">${item.name}</p>
              ${item.desc ? `<p class="desc" style="-webkit-line-clamp: ${lineClamp}">${item.desc}</p>` : ''}
          </div>

          ${item.avatar || item.author ? `<div class="box-footer">
              ${item.avatar ? `<img src="${withBase(item.avatar)}" class="no-zoom">` : ''}
              ${item.author ? `<span>${item.author}</span>` : ''}
          </div>`: ''}
        </a>
      </div>
    `
  })
  return listDOM
}

// Prepend base path
function withBase(path) {
  if (!path) return '';
  if (base && path.charAt(0) === '/') {
    return base + path.slice(1);
  } else {
    return path;
  }
}
