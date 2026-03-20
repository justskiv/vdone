/**
 * VDone theme configuration
 * Based on vuepress-theme-vdone (hard fork of vdoing)
 */
import { resolve } from 'path'
import { defineConfig4CustomTheme, UserPlugins } from 'vuepress/config'
import { VdoneThemeConfig } from 'vuepress-theme-vdone/types'
import dayjs from 'dayjs'
import htmlModules from './config/htmlModules' // custom html blocks

const DOMAIN_NAME = 'justskiv.github.io/vdone' // domain (without https)
const WEB_SITE = `https://${DOMAIN_NAME}` // website url

export default defineConfig4CustomTheme<VdoneThemeConfig>({
  theme: 'vdone', // use npm theme package
  // theme: resolve(__dirname, '../../packages/theme'), // use local theme package

  locales: {
    '/': {
      lang: 'en-US',
      title: "VDone Demo",
      description: 'A live demo of the VDone theme for VuePress. Knowledge base, documentation and blog.',
    }
  },
  base: '/vdone/', // Required for GitHub Pages project site (justskiv.github.io/vdone)

  // Theme configuration
  themeConfig: {
    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Frontend',
        link: '/web/', // directory page link, vdone theme config item for two-level nav
        items: [
          // Note: all link values below are defined as permalinks in md file frontmatter
          {
            text: 'Articles',
            items: [
              { text: 'JavaScript', link: '/pages/8143cc480faf9a11/' },
            ],
          },
          {
            text: 'Study Notes',
            items: [
              { text: 'JavaScript Tutorial', link: '/note/javascript/' },
              { text: 'Professional JavaScript', link: '/note/js/' },
              { text: 'ES6 Tutorial', link: '/note/es6/' },
              { text: 'Vue', link: '/note/vue/' },
              { text: 'React', link: '/note/react/' },
              {
                text: 'TypeScript: Build Axios from Scratch',
                link: '/note/typescript-axios/',
              },
              {
                text: 'Git',
                link: '/note/git/',
              },
              {
                text: 'TypeScript',
                link: '/pages/51afd6/',
              },
              {
                text: 'JS Design Patterns',
                link: '/pages/4643cd/',
              },
            ],
          },
        ],
      },
      {
        text: 'UI & Layout',
        link: '/ui/',
        items: [
          { text: 'HTML', link: '/pages/8309a5b876fc95e3/' },
          { text: 'CSS', link: '/pages/0a83b083bdf257cb/' },
        ],
      },
      {
        text: 'Technology',
        link: '/technology/',
        items: [
          { text: 'Technical Docs', link: '/pages/9a7ee40fc232253e/' },
          { text: 'GitHub Tips', link: '/pages/4c778760be26d8b3/' },
          { text: 'Node.js', link: '/pages/117708e0af7f0bd9/' },
          { text: 'Blog Setup', link: '/pages/41f87d890d0a02af/' },
        ],
      },
      {
        text: 'More',
        link: '/more/',
        items: [
          { text: 'Learning', link: '/pages/f2a556/' },
          { text: 'Interviews', link: '/pages/aea6571b7a8bae86/' },
          { text: 'Miscellaneous', link: '/pages/2d615df9a36a98ed/' },
          { text: 'Practical Tips', link: '/pages/baaa02/' },
          { text: 'Friends', link: '/friends/' },
        ],
      },
      { text: 'About', link: '/about/' },
      {
        text: 'Bookmarks',
        link: '/pages/beb6c0bd8a66cea6/',
      },
      {
        text: 'Index',
        link: '/archives/',
        items: [
          { text: 'Categories', link: '/categories/' },
          { text: 'Tags', link: '/tags/' },
          { text: 'Archives', link: '/archives/' },
        ],
      },
    ],
    sidebarDepth: 2, // sidebar depth, default 1, max 2 (shows h3)
    logo: '/img/logo.png', // navbar logo
    repo: 'justskiv/vdone', // navbar right side Github link
    searchMaxSuggestions: 10, // max search results
    lastUpdated: 'Last Updated', // enable update time with prefix text
    docsDir: 'docs', // editable folder
    // docsBranch: 'main', // branch for edit links
    editLinks: true, // enable edit links
    editLinkText: 'Edit',

    //*** VDone theme specific configuration ***//

    // category: false, // enable category, default true
    // tag: false, // enable tags, default true
    // archive: false, // enable archives, default true
    // categoryText: '随笔', // default category for fragmented articles (_posts), default '随笔'

    // pageStyle: 'line', // page style: 'card' | 'line' (only works without bodyBgImg), default 'card'

    // bodyBgImg: [
    //   'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200507175828.jpeg',
    //   'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200507175845.jpeg',
    //   'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store/blog/20200507175846.jpeg'
    // ], // body background images. Single String | multiple Array
    // bodyBgImgOpacity: 0.5, // body bg image opacity, 0.1~1.0, default 0.5
    // bodyBgImgInterval: 15, // body bg image switch interval, default 15s
    // titleBadge: false, // show icon before article title, default true
    // contentBgStyle: 1, // article content bg style, default none. 1 grid | 2 hlines | 3 vlines | 4 left-slant | 5 right-slant | 6 dots

    // updateBar: { // recent updates bar
    //   showToArticle: true, // show at bottom of article, default true
    //   moreArticle: '/archives' // "more articles" page, default '/archives'
    // },
    // rightMenuBar: false, // show right-side article outline, default true (hidden below 1300px)
    // sidebarOpen: false, // initial sidebar state, default true
    // pageButton: false, // show quick page flip buttons, default true

    // defaultMode: 'auto', // default appearance: 'auto' | 'light' | 'dark' | 'read', default 'auto'

    // Sidebar: 'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | custom
    // Note: directory page data depends on structured sidebar
    sidebar: 'structuring',

    // Default author info (can be overridden per md file)
    author: {
      name: 'Nikolay Tuzov',
      link: 'https://github.com/justskiv',
    },

    // Blogger info (displayed in homepage sidebar)
    blogger: {
      avatar: 'https://github.com/justskiv.png',
      name: 'Nikolay Tuzov',
      slogan: 'Backend Developer',
    },

    // Social icons (displayed in blogger info and footer)
    social: {
      icons: [
        {
          iconClass: 'icon-youjian',
          title: 'Email',
          link: 'mailto:tuzov.n@gmail.com',
        },
        {
          iconClass: 'icon-github',
          title: 'GitHub',
          link: 'https://github.com/justskiv',
        },
      ],
    },

    // Footer
    footer: {
      createYear: 2026,
      copyrightInfo:
        'Nikolay Tuzov | <a href="https://github.com/justskiv/vdone/blob/main/LICENSE" target="_blank">MIT License</a> | <a href="https://t.me/ntuzov" target="_blank">Telegram</a>',
    },

    // Auto-generate frontmatter defaults (adds fields when missing, does not overwrite)
    extendFrontmatter: {
      author: {
        name: 'Nikolay Tuzov',
        link: 'https://github.com/justskiv'
      }
    },

    // Custom html modules
    htmlModules
  },

  // Tags injected into page <head>
  head: [
    ['link', { rel: 'icon', href: '/img/favicon.ico' }],
    [
      'meta',
      {
        name: 'keywords',
        content: '前端博客,个人技术博客,前端,前端开发,前端框架,web前端,前端面试题,技术文档,学习,面试,JavaScript,js,ES6,TypeScript,vue,React,python,css3,html5,Node,git,github,markdown',
      },
    ],
    ['meta', { name: 'theme-color', content: '#11a8cd' }], // mobile browser theme color
  ],


  // Plugins
  plugins: <UserPlugins>[
    [
      "sitemap",
      {
        hostname: WEB_SITE,
      },
    ],

    // Third-party search box (inherits default search box config)
    [
      'thirdparty-search',
      {
        thirdparty: [
          {
            title: '在MDN中搜索',
            frontUrl: 'https://developer.mozilla.org/zh-CN/search?q=',
            behindUrl: '',
          },
          {
            title: '在Runoob中搜索',
            frontUrl: 'https://www.runoob.com/?s=',
          },
          {
            title: '在Vue API中搜索',
            frontUrl: 'https://cn.vuejs.org/v2/api/#',
          },
          {
            title: '在Bing中搜索',
            frontUrl: 'https://cn.bing.com/search?q=',
          },
        ],
      }
    ],

    [
      'one-click-copy', // code block copy button
      {
        copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'],
        copyMessage: '复制成功',
        duration: 1000,
        showInMobile: false,
      },
    ],

    [
      'demo-block', // demo showcase module
      {
        settings: {
          jsfiddle: false,
          codepen: true,
          horizontal: false,
        },
      },
    ],
    [
      'vuepress-plugin-zooming', // image zoom
      {
        selector: '.theme-vdone-content img:not(.no-zoom)',
        options: {
          bgColor: 'rgba(0,0,0,0.6)',
        },
      },
    ],
    // TODO: enable comments — see tasks/setup-gitalk.md
    // [
    //   'vuepress-plugin-comment',
    //   {
    //     choosen: 'gitalk',
    //     options: {
    //       clientID: process.env.GITALK_CLIENT_ID || '',
    //       clientSecret: process.env.GITALK_CLIENT_SECRET || '',
    //       repo: 'vdone', // GitHub repo for comments
    //       owner: 'justskiv',
    //       admin: ['justskiv'],
    //       pagerDirection: 'last',
    //       id: '<%- (frontmatter.permalink || frontmatter.to.path).slice(-16) %>',
    //       title: '<%- frontmatter.title %>',
    //       labels: ['Gitalk', 'Comment'],
    //       body: '<%- window.location.origin + (frontmatter.to.path || window.location.pathname) %>',
    //     },
    //   },
    // ],
    [
      '@vuepress/last-updated', // "last updated" time format
      {
        transformer: (timestamp, lang) => {
          return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
        },
      },
    ],
  ],

  markdown: {
    lineNumbers: true,
    extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6'], // extract headers to sidebar
  },

  // Watch files for rebuild
  extraWatchFiles: [
    '.vuepress/config.ts',
    '.vuepress/config/htmlModules.ts',
  ]
})