import { VdoneThemeConfig } from 'vuepress-theme-vdone/types'

/** Insert custom HTML modules (can be used for ads, etc.)
 * {
 *   homeSidebarB: htmlString, // Homepage sidebar bottom
 *
 *   sidebarT: htmlString, // All left sidebars top
 *   sidebarB: htmlString, // All left sidebars bottom
 *
 *   pageT: htmlString, // Page top
 *   pageB: htmlString, // Page bottom
 *   pageTshowMode: string, // Page top display mode: defaults to all pages; 'article' => article pages only①; 'custom' => custom pages only①
 *   pageBshowMode: string, // Page bottom display mode: defaults to all pages; 'article' => article pages only①; 'custom' => custom pages only①
 *
 *   windowLB: htmlString, // Global window bottom-left②
 *   windowRB: htmlString, // Global window bottom-right②
 * }
 *
 * ① Note: Pages with `article: false` in .md front matter are custom pages; pages without this setting default to article pages (except the homepage).
 * ② Note: windowLB and windowRB: 1. Max display block size is 200px*400px. 2. Custom elements should not exceed 200px*400px. 3. Never displayed when screen width is less than 960px.
 */
const htmlModule: VdoneThemeConfig['htmlModules'] = {
  homeSidebarB:
    `<div style="padding: 0.95rem">
    <p style="
      color: var(--textColor);
      opacity: 0.9;
      font-size: 20px;
      font-weight: bold;
      margin: 0 0 8px 0;
    ">Telegram</p>
    <a href="https://t.me/ntuzov" target="_blank">@ntuzov</a>
    </div>`,
  // `<!-- Vertical auto-fit -->
  // <ins class="adsbygoogle"
  //     style="display:block;padding: 0.95rem;"
  //     data-ad-client="ca-pub-7828333725993554"
  //     data-ad-slot="7802654582"
  //     data-ad-format="auto"
  //     data-full-width-responsive="true"></ins>
  // <script>
  //     (adsbygoogle = window.adsbygoogle || []).push({});
  // </script>`,
  // sidebarT:
  //   `<!-- Fixed 100% * 150px displays, max-height:150px does not display -->
  //   <ins class="adsbygoogle"
  //         style="display:inline-block;width:100%;max-height:150px"
  //         data-ad-client="ca-pub-7828333725993554"
  //         data-ad-slot="6625304284"></ins>
  //     <script>
  //         (adsbygoogle = window.adsbygoogle || []).push({});
  //     </script>`,
  // sidebarB:
  //   `<!-- Square -->
  //     <ins class="adsbygoogle"
  //         style="display:block"
  //         data-ad-client="ca-pub-7828333725993554"
  //         data-ad-slot="3508773082"
  //         data-ad-format="auto"
  //         data-full-width-responsive="true"></ins>
  //     <script>
  //         (adsbygoogle = window.adsbygoogle || []).push({});
  //     </script>`,
  // pageT:
  //   `<!-- Fixed 100% * 90px displays, max-height:90px does not display -->
  //    <ins class="adsbygoogle"
  //         style="display:inline-block;width:100%;max-height:90px"
  //         data-ad-client="ca-pub-7828333725993554"
  //         data-ad-slot="6625304284"></ins>
  //     <script>
  //         (adsbygoogle = window.adsbygoogle || []).push({});
  //     </script>`,
  // pageTshowMode: 'article',
  // pageB:
  //   `<!-- Horizontal auto-fit -->
  //     <ins class="adsbygoogle"
  //         style="display:block"
  //         data-ad-client="ca-pub-7828333725993554"
  //         data-ad-slot="6620245489"
  //         data-ad-format="auto"
  //         data-full-width-responsive="true"></ins>
  //     <script>
  //         (adsbygoogle = window.adsbygoogle || []).push({});
  //     </script>`,
  // pageBshowMode: 'article',
  // windowLB: // May overlap part of the sidebar
  //   `<!-- Fixed 200*200px -->
  //     <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  //     <ins class="adsbygoogle"
  //         style="display:inline-block;width:200px;height:200px"
  //         data-ad-client="ca-pub-7828333725993554"
  //         data-ad-slot="6625304284"></ins>
  //     <script>
  //         (adsbygoogle = window.adsbygoogle || []).push({});
  //     </script>`,
  // windowRB:
  //   `<!-- Fixed 160*160px -->
  //     <ins class="adsbygoogle"
  //         style="display:inline-block;max-width:160px;max-height:160px"
  //         data-ad-client="ca-pub-7828333725993554"
  //         data-ad-slot="8377369658"></ins>
  //     <script>
  //         (adsbygoogle = window.adsbygoogle || []).push({});
  //     </script>
  //     `,
}


// const htmlModule = {
//   homeSidebarB: `<div style="width:100%;height:100px;color:#fff;background: #eee;">Custom module test</div>`,
//   sidebarT: `<div style="width:100%;height:100px;color:#fff;background: #eee;">Custom module test</div>`,
//   sidebarB: `<div style="width:100%;height:100px;color:#fff;background: #eee;">Custom module test</div>`,
//   pageT: `<div style="width:100%;height:100px;color:#fff;background: #eee;">Custom module test</div>`,
//   pageB: `<div style="width:100%;height:100px;color:#fff;background: #eee;">Custom module test</div>`,
//   windowLB: `<div style="width:100%;height:100px;color:#fff;background: #eee;">Custom module test</div>`,
//   windowRB: `<div style="width:100%;height:100px;color:#fff;background: #eee;">Custom module test</div>`,
// }


export default htmlModule
