<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />

    <div class="sidebar-mask" @click="toggleSidebar(false)"></div>

    <div
      v-if="$themeConfig.sidebarHoverTriggerOpen !== false"
      class="sidebar-hover-trigger"
    ></div>

    <Sidebar
      :items="sidebarItems"
      @toggle-sidebar="toggleSidebar"
      v-show="showSidebar"
    >
      <template #top v-if="sidebarSlotTop">
        <div
          class="sidebar-slot sidebar-slot-top"
          v-html="sidebarSlotTop"
        ></div>
      </template>
      <template #bottom v-if="sidebarSlotBottom">
        <div
          class="sidebar-slot sidebar-slot-bottom"
          v-html="sidebarSlotBottom"
        ></div>
      </template>
      <!-- <slot name="sidebar-top" #top />
      <slot name="sidebar-bottom" #bottom /> -->
    </Sidebar>

    <!-- Home page -->
    <Home v-if="$page.frontmatter.home" />

    <!-- Categories page -->
    <CategoriesPage v-else-if="$page.frontmatter.categoriesPage" />

    <!-- Tags page -->
    <TagsPage v-else-if="$page.frontmatter.tagsPage" />

    <!-- Archives page -->
    <ArchivesPage v-else-if="$page.frontmatter.archivesPage" />

    <!-- Article page or other pages -->
    <Page v-else :sidebar-items="sidebarItems">
      <template #top v-if="pageSlotTop">
        <div class="page-slot page-slot-top" v-html="pageSlotTop"></div>
      </template>
      <template #bottom v-if="pageSlotBottom">
        <div class="page-slot page-slot-bottom" v-html="pageSlotBottom"></div>
      </template>
      <!-- <slot
        name="page-top"
        #top
      />
      <slot
        name="page-bottom"
        #bottom
      /> -->
    </Page>

    <Footer />

    <Buttons ref="buttons" @toggle-theme-mode="toggleThemeMode" />

    <BodyBgImg v-if="$themeConfig.bodyBgImg" />

    <!-- Custom HTML windows in bottom-left and bottom-right corners -->
    <div
      class="custom-html-window custom-html-window-lb"
      v-if="windowLB"
      v-show="showWindowLB"
    >
      <div class="custom-wrapper">
        <span class="close-but" @click="showWindowLB = false">×</span>
        <div v-html="windowLB" />
      </div>
    </div>
    <div
      class="custom-html-window custom-html-window-rb"
      v-if="windowRB"
      v-show="showWindowRB"
    >
      <div class="custom-wrapper">
        <span class="close-but" @click="showWindowRB = false">×</span>
        <div v-html="windowRB" />
      </div>
    </div>
  </div>
</template>

<script>
import Home from '@theme/components/Home.vue'
import Navbar from '@theme/components/Navbar.vue'
import Page from '@theme/components/Page.vue'
import CategoriesPage from '@theme/components/CategoriesPage.vue'
import TagsPage from '@theme/components/TagsPage.vue'
import ArchivesPage from '@theme/components/ArchivesPage.vue'
import Sidebar from '@theme/components/Sidebar.vue'
import Buttons from '@theme/components/Buttons.vue'
import Footer from '@theme/components/Footer'
import BodyBgImg from '@theme/components/BodyBgImg'
import { resolveSidebarItems } from '../util'
import storage from 'good-storage' // Local storage
import _ from 'lodash'

const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl
const NAVBAR_HEIGHT = 58 // Navbar height

export default {
  components: { Home, Navbar, Page, CategoriesPage, TagsPage, ArchivesPage, Sidebar, Footer, Buttons, BodyBgImg },

  data() {
    return {
      hideNavbar: false,
      isSidebarOpen: true,
      showSidebar: false,
      themeMode: 'auto',
      showWindowLB: true,
      showWindowRB: true
    }
  },
  computed: {
    sidebarSlotTop() {
      return this.getHtmlStr('sidebarT')
    },
    sidebarSlotBottom() {
      return this.getHtmlStr('sidebarB')
    },
    pageSlotTop() {
      return this.getHtmlStr('pageT')
    },
    pageSlotBottom() {
      return this.getHtmlStr('pageB')
    },
    windowLB() {
      return this.getHtmlStr('windowLB')
    },
    windowRB() {
      return this.getHtmlStr('windowRB')
    },
    showRightMenu() {
      const { headers } = this.$page
      return (
        !this.$frontmatter.home
        && this.$themeConfig.rightMenuBar !== false
        && headers
        && headers.length
        && this.$frontmatter.sidebar !== false
      )
    },
    shouldShowNavbar() {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false
        || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title
        || themeConfig.logo
        || themeConfig.repo
        || themeConfig.nav
        || this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page
      return (
        !frontmatter.home
        && frontmatter.sidebar !== false
        && this.sidebarItems.length
        && frontmatter.showSidebar !== false
      )
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'hide-navbar': this.hideNavbar, // Hide navbar on scroll down
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar,
          'have-rightmenu': this.showRightMenu,
          'have-body-img': this.$themeConfig.bodyBgImg,
          'only-sidebarItem': this.sidebarItems.length === 1 && this.sidebarItems[0].type === 'page', // When left sidebar has only one item
        },
        userPageClass
      ]
    }
  },
  created() {
    const sidebarOpen = this.$themeConfig.sidebarOpen
    if (sidebarOpen === false) {
      this.isSidebarOpen = sidebarOpen
    }
  },
  beforeMount() {
    this.isSidebarOpenOfclientWidth()
    const mode = storage.get('mode') // Not in created() because VuePress cannot access browser APIs (e.g. window) during SSR
    const { defaultMode } = this.$themeConfig

    if (defaultMode && defaultMode !== 'auto' && !mode ) {
      this.themeMode = defaultMode
    } else if(!mode || mode === 'auto' || defaultMode === 'auto') { // When mode has not been switched, or mode is 'Follow System'
      this._autoMode()
    } else {
      this.themeMode = mode
    }
    this.setBodyClass()

    // Import icon library
    const social = this.$themeConfig.social
    if (social && social.iconfontCssFile) {
      let linkElm = document.createElement("link")
      linkElm.setAttribute('rel', 'stylesheet');
      linkElm.setAttribute("type", "text/css")
      linkElm.setAttribute("href", social.iconfontCssFile)
      document.head.appendChild(linkElm)
    }
  },
  mounted() {
    // Fix: anchor links not scrolling to the target id on initial page load
    const hash = document.location.hash;
    if (hash.length > 1) {
      const id = decodeURIComponent(hash.substring(1))
      const element = document.getElementById(id)
      if (element) element.scrollIntoView()
    }

    // Fix: sidebar flashing on mobile during initial page load
    this.showSidebar = true
    this.$router.afterEach(() => {
      this.isSidebarOpenOfclientWidth()
    })

    // Collapse navbar on scroll down
    let p = 0, t = 0;
    window.addEventListener('scroll', _.throttle(() => {
      if (!this.isSidebarOpen) { // When sidebar is closed
        p = this.getScrollTop()
        if (t < p && p > NAVBAR_HEIGHT) { // Scrolling down
          this.hideNavbar = true
        } else { // Scrolling up
          this.hideNavbar = false
        }
        setTimeout(() => { t = p }, 0)
      }
    }, 300))
  },
  watch: {
    isSidebarOpen() {
      if (this.isSidebarOpen) {  // When sidebar is open, restore navbar visibility
        this.hideNavbar = false
      }
    },
    themeMode() {
      this.setBodyClass()
    }
  },
  methods: {
    getHtmlStr(module) {
      const { htmlModules } = this.$themeConfig
      return htmlModules ? htmlModules[module] : ''
    },
    setBodyClass() {
      let { pageStyle = 'card', bodyBgImg } = this.$themeConfig
      if (pageStyle !== 'card' && pageStyle !== 'line' || bodyBgImg) { pageStyle = 'card' }
      document.body.className = `theme-mode-${this.themeMode} theme-style-${pageStyle}`
    },
    getScrollTop() {
      return window.pageYOffset
        || document.documentElement.scrollTop
        || document.body.scrollTop || 0
    },
    isSidebarOpenOfclientWidth() {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.isSidebarOpen = false
      }
    },
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      this.$emit('toggle-sidebar', this.isSidebarOpen)
    },
    _autoMode() {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) { // System is in dark mode
        this.themeMode = 'dark'
      } else {
        this.themeMode = 'light'
      }
    },
    toggleThemeMode(key) {
      if (key === 'auto') {
        this._autoMode()
      } else {
        this.themeMode = key
      }
      storage.set('mode', key)
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.custom-html-window
  position fixed
  bottom 0
  display flex
  overflow hidden
  font-weight 350
  @media (max-width 960px)
    display none
  .custom-wrapper
    position relative
    max-width 200px
    max-height 400px
    .close-but
      cursor pointer
      position absolute
      right 0
      top 0
      font-size 1.5rem
      line-height 1.5rem
      width 1.5rem
      height 1.5rem
      opacity 0
      transition all 0.2s
      &:hover
        opacity 0.9
    &:hover
      .close-but
        opacity 0.7
  &.custom-html-window-lb
    left 0
    z-index 99
    &>*
      align-self flex-end
  &.custom-html-window-rb
    right 80px
    z-index 10
    justify-content flex-end
    &>*
      align-self flex-end
</style>
