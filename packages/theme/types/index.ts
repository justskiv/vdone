import { DefaultThemeConfig } from '@vuepress/types'

type NoSidebar4DefaultThemeConfig = Omit<DefaultThemeConfig, 'sidebar'> // Omit the sidebar property

/**
 * VDone theme configuration type
 * @see https://github.com/justskiv/vdone
 */
export interface VdoneThemeConfig extends NoSidebar4DefaultThemeConfig {
  /**
   * Whether to enable the category feature
   * @default true
   */
  category?: boolean;

  /**
   * Whether to enable the tag feature
   * @default true
   */
  tag?: boolean;

  /**
   * Whether to enable the archive feature
   * @default true
   */
  archive?: boolean;

  /**
   * Default category value for fragmented posts (articles in _posts folder)
   * @default 'Random Notes'
   */
  categoryText?: string;

  /**
   * Page style
   * @default 'card'
   */
  pageStyle?: 'card' | 'line';

  /**
   * Body background image URL. Single image: string | Multiple images: string[], rotates every 15 seconds.
   * @default ''
   */
  bodyBgImg?: string | string[];

  /**
   * Body background image opacity, range 0.1 ~ 1.0
   * @default 0.5
   */
  bodyBgImgOpacity?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;


  /**
   * Transition interval (in seconds) when multiple body background images are set, default 15s
   * @default 15
   */
  bodyBgImgInterval?: number;

  /**
   * Whether to show the icon before article titles
   * @default true
   */
  titleBadge?: boolean;

  /**
   * URLs for icons displayed before article titles
   * @default <built-in icons>
   */
  titleBadgeIcons?: string[];

  /**
   * Background pattern style for article content block. 1 grid | 2 horizontal lines | 3 vertical lines | 4 left diagonal | 5 right diagonal | 6 dots
   * @default <none>
   */
  contentBgStyle?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Recent updates bar. showToArticle: whether to display at the bottom of article pages (default true). moreArticle: target page for “more articles” link (default '/archives')
   * @default {showToArticle: true, moreArticle: '/archives'}
   */
  updateBar?: {
    showToArticle: boolean,
    moreArticle?: '/archives' | string
  };

  /**
   * Whether to show the right-side article outline bar on wide screens (never shown when screen width < 1300px)
   * @default true
   */
  rightMenuBar?: boolean;

  /**
   * Whether the left sidebar is open by default (Note: this only controls collapsed/expanded state)
   * @default true
   */
  sidebarOpen?: boolean;

  /**
   * Whether to show quick page navigation buttons
   * @default true
   */
  pageButton?: boolean;

  /**
   * Default appearance mode
   * @default 'auto'
   */
  defaultMode?: 'auto' | 'light' | 'dark' | 'read';

  /**
   * Sidebar configuration
   */
  sidebar?:
  | 'structuring'
  | { mode: 'structuring', collapsable: Boolean }
  | DefaultThemeConfig['sidebar']

  /**
   * Default author information for articles
   */
  author?: string | { name: string, link?: string }

  /**
   * Blogger information (displayed in the home page sidebar)
   */
  blogger?: {
    avatar: string,
    name: string,
    slogan?: string,
  }

  /**
   * Social icons (displayed in the blogger info bar and footer)
   * @built-in-icons-see: https://doc.xugaoyi.com/pages/a20ce8/#social
   */
  social?: {
    iconfontCssFile?: string,
    icons: {
      iconClass: string,
      title: string,
      link: string,
    }[]
  }

  /**
   * Footer information
   */
  footer?: {
    createYear: number,
    copyrightInfo: string
  }

  /**
   * Extend auto-generated frontmatter.
   * When a field does not exist in the md file's frontmatter, it will be added automatically. Existing data will not be overwritten.
   */
  extendFrontmatter?: {
    [key: string]: any
  }

  /**
   * Custom HTML (ad) modules
   * @see: https://doc.xugaoyi.com/pages/a20ce8/#htmlmodules
   */
  htmlModules?: {
    homeSidebarB?: string,
    sidebarT?: string,
    sidebarB?: string,
    pageT?: string,
    pageB?: string,
    pageTshowMode?: 'article' | 'custom',
    pageBshowMode?: 'article' | 'custom',
    windowLB?: string,
    windowRB?: string,
  }

  /**
   * Catch-all for other unlisted configuration options
   */
  [key: string]: any;
}
