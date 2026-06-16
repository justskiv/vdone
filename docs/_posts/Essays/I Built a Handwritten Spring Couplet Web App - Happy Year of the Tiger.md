---
title: I Built a Handwritten Spring Couplet Web App — Happy Year of the Tiger!
date: 2022-01-28 14:59:51
permalink: /pages/829589/
titleTag: Original
sidebar: auto
categories:
  - Essays
tags:
  - null
author:
  name: xugaoyi
  link: https://github.com/xugaoyi
---


Handwritten Spring Couplets: <https://cl.xugaoyi.com/>

### Introduction
The Year of the Tiger is almost here! First of all, happy New Year to everyone — may you get rich effortlessly.
I've been seeing articles about generating spring couplets all over the web lately. But most of these little demos are either too bare-bones or have that typical "built by a programmer" look, which doesn't satisfy my picky taste. So I decided to build one myself, while also getting a quick taste of Vite + Vue 3. (Since the page is relatively simple, I stuck with the Options API for the Vue component style — the main goal was to ship the product quickly.)

<!-- more -->


<p align="center"><img src="https://img-blog.csdnimg.cn/img_convert/185c88180b87ac7277072280a0c144ce.png" width="500" style="cursor: zoom-in;"></p>

### Product Design
The app has two main features: **Handwriting Mode** and **Generator Mode**:
- **Handwriting Mode**
  - Simulates pen-stroke handwriting
  - Choose brush color
  - Adjust brush size
  - Clear the canvas
  - Undo strokes
  - Switch between upper couplet, lower couplet, horizontal scroll, and "fortune" character
  - Randomly cycle through couplet prompts
  - Preview and download images
  - Create and download couplet poster

- **Generator Mode**
  - Choose brush color
  - Pick from pre-made couplets
  - Type in custom couplets
  - Randomly cycle through couplets
  - Create and download couplet poster

- **Other**
  - Quick mode-switch button
  - Controllable background music
  - WeChat page sharing

### Design
![222.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/392f2036c0ce4c97b8562e6f17606491~tplv-k3u1fbpfcp-watermark.image?)

### Development
- **Tech Stack**
  - Vite (bundling & building)
  - Vue 3 (page development)
  - Vant (UI)
  - Sass (CSS)
  - [smooth-signature.js (pen-stroke handwriting library)](https://github.com/linjc/smooth-signature)


``` js
<template>
  <div class="wrap" :class="'mode-' + mode" @touchstart="handleTouchstart">
    <!-- Mode toggle button -->
    <div class="toggle-mode-btn" @click="toggleMode">
      {{ mode === 1 ? 'Handwrite' : 'Generate' }}
      <i class="iconfont icon-qiehuan"></i>
    </div>

    <!-- Toolbar -->
    <div
      class="actions"
      :style="{ borderTopRightRadius: colorListVisibility ? '0' : '5px' }"
    >
      <!-- Shown in handwriting mode -->
      <template v-if="mode === 1">
        <!-- Palette -->
        <div class="palette btn-block">
          <div
            class="cur-color"
            @click="togglePalette"
            :style="{ background: colorList[curColorIndex] }"
          ></div>
          <ul class="colorList" v-show="colorListVisibility">
            <li
              v-for="(item, index) in colorList"
              :key="item"
              :style="{ background: item }"
              @click="selectColor(index)"
            ></li>
          </ul>
        </div>

        <!-- Slider -->
        <div class="slider-box btn-block">
          <van-slider
            v-model="progress"
            vertical
            @change="changeProgress"
            bar-height="28"
            active-color="transparent"
            :min="50"
            :max="150"
          >
            <template #button>
              <div class="custom-button"></div>
            </template>
          </van-slider>
        </div>

        <!-- Clear -->
        <div class="btn" @click="handleClear">
          <i class="iconfont icon-lajitong"></i>
        </div>

        <!-- Undo -->
        <div class="btn" @click="handleUndo">
          <i class="iconfont icon-fanhui"></i>
        </div>

        <div class="line"></div>

        <!-- Canvas switch buttons -->
        <div
          class="btn"
          :class="{ 'cur-active': curCanvasIndex === index }"
          v-for="(item, index) in canvasList"
          :key="item.name"
          @click="changeCanvas(index)"
        >
          {{ item.name }}
        </div>

        <div class="line"></div>

        <div class="btn prominent" @click="handlePreview">Preview</div>
        <div class="btn prominent" @click="openPosters">Poster</div>
      </template>

      <!-- Shown in generator mode -->
      <template v-else>
        <!-- Color picker -->
        <div
          class="color-list-quick"
          :class="{ active: curColorIndex === index }"
          v-for="(item, index) in colorList"
          :key="item"
          :style="{ background: item }"
          @click="selectColor(index)"
        ></div>
        <div class="line"></div>
        <div class="btn" @click="showPickBox = true">Pick</div>
        <div class="btn" @click="showInputBox = true">Type</div>

        <!-- Couplet picker popup -->
        <van-action-sheet v-model:show="showPickBox" title="Pick a couplet">
          <ul class="duilian-list">
            <li
              v-for="(item, index) in duilianList"
              :key="index"
              @click="handlePickDuilian(item)"
            >
              <span>{{ item.shang }}</span
              >， <span>{{ item.xia }}</span
              >。
              <span>{{ item.heng }}</span>
            </li>
          </ul>
        </van-action-sheet>

        <!-- Couplet input popup -->
        <van-action-sheet v-model:show="showInputBox" title="Enter a couplet">
          <van-form @submit="handleSubmitInput">
            <van-cell-group inset>
              <van-field
                v-model="shanglian"
                name="shang"
                label="Upper couplet"
                placeholder="Upper couplet"
                :rules="[
                  {
                    required: true,
                    message: 'Please enter a 7-character upper couplet',
                    pattern: /^[\u4e00-\u9fa5]{7}$/
                  }
                ]"
                clearable
              />
              <van-field
                v-model="xialian"
                name="xia"
                label="Lower couplet"
                placeholder="Lower couplet"
                :rules="[
                  {
                    required: true,
                    message: 'Please enter a 7-character lower couplet',
                    pattern: /^[\u4e00-\u9fa5]{7}$/
                  }
                ]"
                clearable
              />
              <van-field
                v-model="hengpi"
                name="heng"
                label="Horizontal scroll"
                placeholder="Horizontal scroll"
                :rules="[
                  {
                    required: true,
                    message: 'Please enter a 4-character horizontal scroll',
                    pattern: /^[\u4e00-\u9fa5]{4}$/
                  }
                ]"
                clearable
              />
            </van-cell-group>
            <div style="margin: 16px">
              <van-button
                round
                block
                type="primary"
                native-type="submit"
                color="linear-gradient(to right, #ff6034, #c33825)"
              >
                Done
              </van-button>
            </div>
          </van-form>
        </van-action-sheet>
      </template>
    </div>

    <!-- Mode 1 - couplet canvas -->
    <div
      v-show="mode === 1"
      v-for="(item, index) in canvasList"
      :key="item.name"
    >
      <canvas
        class="canvas"
        :class="item.className"
        v-show="curCanvasIndex === index"
        :style="{
          marginTop:
            item.height < clientHeight
              ? `${(clientHeight - item.height) / 2}px`
              : 0,
          marginLeft:
            item.width < clientWidth ? `${(clientWidth - item.width) / 2}px` : 0
        }"
      />
    </div>

    <!-- Mode 2 - couplet canvas -->
    <div v-show="mode === 2" class="canvas-mode-2">
      <div class="row">
        <canvas id="canvas-top" :width="200 * scale" :height="60 * scale" />
      </div>
      <div class="row">
        <canvas id="canvas-left" :width="60 * scale" :height="364 * scale" />
        <canvas id="canvas-right" :width="60 * scale" :height="364 * scale" />
      </div>
    </div>

    <!-- Paste couplet button -->
    <Button class="btn-posters" @click="openPosters" />

    <!-- footer - current couplet hint -->
    <footer v-if="duilian.shang">
      <div class="refresh-btn" @click="handleRefresh(true)">
        <i class="iconfont icon-shuaxin" :class="{ rotate: isRotate }"></i>
      </div>
      <dl class="duilian">
        <dt>Couplet</dt>
        <dd>
          <div>{{ duilian.shang }}</div>
          <div>{{ duilian.xia }}</div>
        </dd>
      </dl>
      <dl>
        <dt>Horizontal scroll</dt>
        <dd>{{ duilian.heng }}</dd>
      </dl>
    </footer>

    <!-- Share button -->
    <div class="share-btn" v-if="isShowShareBtn" @click="isShowShareTip = true">
      <i class="iconfont icon-fenxiang"></i>
    </div>
    <!-- WeChat share hint -->
    <div
      class="share-tip"
      v-if="isShowShareTip"
      @click="isShowShareTip = false"
    >
      Tap the top-right corner to share this tool with friends
      <div class="hand">👆</div>
    </div>

    <!-- Save tip -->
    <p v-if="isShowTip" class="download-tip">*Long-press the image to save or forward</p>

    <!-- Copyright -->
    <div class="copyright">WeChat account "Fun Research Society" ©All rights reserved</div>

    <!-- Load image elements for quick stamping; note crossorigin="anonymous" is set to handle CORS -->
    <div v-if="isReadImages">
      <img
        crossorigin="anonymous"
        v-for="(item, index) in bgList"
        :src="item"
        :key="item"
        class="hide-img"
        :id="`bg-img-` + index"
      />
      <img
        crossorigin="anonymous"
        class="hide-img"
        id="qrcode"
        src="https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store2@master/img/qrcode.zul0pldsuao.png"
      />
    </div>

    <!-- Background music -->
    <audio
      src="https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store2@master/cjxq.mp3"
      id="bgm"
      ref="bgm"
      loop
    />
    <div
      class="play-btn"
      :class="{ paused: !isPlay }"
      ref="playBtn"
      @click="handlePlay"
    >
      <i class="iconfont icon-yinle"></i>
    </div>
  </div>

  <div class="body-bg-img"></div>
</template>

<script>
import { ImagePreview, Notify } from 'vant'
import { isWX, isMobile } from '@/utils'
import Button from '@/components/Button.vue'
import dl from '@/assets/img/yh/dl.jpeg'
import hp from '@/assets/img/yh/hp.jpeg'
import fz from '@/assets/img/yh/fz.png'

// Couplet data
import duilianList from '@/mock/duilian'

const PROPORTION = 0.37 // Image scale-down ratio
const INSTANTIATE_NAME = 'signature' // Instance name
const MIN_WIDTH = 3 // Min brush width
const MAX_WIDTH = 12 // Max brush width

// Poster background size
const BG_WIDTH = 750
const BG_HEIGHT = 1448

// Stamp position and size
const POSITION = [
  { left: 57, top: 510, width: 90, height: 546 }, // Upper couplet
  { left: 600, top: 510, width: 90, height: 546 }, // Lower couplet
  { left: 225, top: 345, width: 300, height: 90 }, // Horizontal banner
  { left: 460, top: 450, width: 130, height: 130 }, // "Fortune" character
]

export default {
  name: "Home",
  components: {
    Button
  },
  data() {
    return {
      duilianList,
      mode: Number(localStorage.getItem('mode')) || 1, // 1 handwrite, 2 generate
      curCanvasIndex: 0, // Which canvas to show
      progress: 100, // Brush size scale
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
      canvasList: [
        {
          name: 'Upper',
          className: 'canvas-a',
          bgImage: dl,
          width: 600 * PROPORTION,
          height: 3640 * PROPORTION,
        },
        {
          name: 'Lower',
          className: 'canvas-b',
          bgImage: dl,
          width: 600 * PROPORTION,
          height: 3640 * PROPORTION,
        },
        {
          name: 'Header',
          className: 'canvas-c',
          bgImage: hp,
          width: 2000 * PROPORTION,
          height: 600 * PROPORTION,
        },
        {
          name: 'Fortune',
          className: 'canvas-d',
          bgImage: fz,
          width: 366,
          height: 366,
        }
      ],
      colorList: ['#000000', '#ffd800', '#e8bd48', '#ddc08c',],
      curColorIndex: 0,
      colorListVisibility: false, // Visibility of canvas color list
      isShowTip: false, // Whether to show bottom hint
      duilian: {}, // Current couplet text object
      isRotate: false, // Refresh icon rotation
      bgList: [
        'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store@master/1.4j8qpdnq80i0.jpeg',
        'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store@master/4.4460an8ag5o0.jpeg',
        'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store@master/5.3axtl4xpvy00.jpeg',
        'https://jsd.cdn.zzko.cn/gh/xugaoyi/image_store@master/6.2lnbphdqjaq0.jpeg',
      ],
      isReadImages: false, // For lazy-loading images
      isShowShareBtn: false, // Whether to show share button
      isShowShareTip: false, // Whether to show share hint
      isPlay: false, // Whether playing

      // Mode 2
      canvasTop: null, // Horizontal scroll
      canvasLeft: null, // Upper couplet
      canvasRight: null, // Lower couplet
      imgObj1: null, // Horizontal scroll image object
      imgObj2: null, // Couplet image object
      scale: Math.max(window.devicePixelRatio || 1, 2), // Used to increase canvas sharpness
      showPickBox: false, // Couplet picker dialog
      showInputBox: false, // Couplet input dialog
      shanglian: '', // Entered upper couplet
      xialian: '', // Entered lower couplet
      hengpi: '', // Entered horizontal scroll
    };
  },
  computed: {
    // Mode 1 - current canvas instance
    curCanvasInstantiate() {
      return this[INSTANTIATE_NAME + this.curCanvasIndex]
    }
  },
  created() {
    // Show share button in WeChat browser
    this.isShowShareBtn = isWX()
  },
  mounted() {
    if (!isMobile()) {
      Notify({ type: 'warning', message: 'Open on a mobile device for the best experience', duration: 6000, });
    }

    this.initMode1();

    // Initialize couplet hint
    this.handleRefresh();

    this.initMode2();

    // Add glow-on-active class to buttons
    const btnEl = document.querySelectorAll('.btn,.btn-block');
    btnEl.forEach((item) => {
      item.addEventListener('touchstart', () => {
        item.classList.add('btn-active')
      })
      item.addEventListener('touchend', () => {
        setTimeout(() => {
          item.classList.remove('btn-active')
        }, 100)
      })
    })

    // Lazy-load stamp backgrounds
    setTimeout(() => {
      this.isReadImages = true
    }, 1000)
  },

  watch: {
    // Switch brush color
    curColorIndex() {
      this.curCanvasInstantiate.color = this.colorList[this.curColorIndex]
      if (this.mode === 2) {
        this.refreshDuilian()
      }
    },
    // Apply current brush color and size when switching canvas
    curCanvasIndex() {
      this.curCanvasInstantiate.color = this.colorList[this.curColorIndex]
      this.handleChangeSize()
      window.scrollTo(0, 0)
    }
  },

  methods: {
    initMode1() {
      const { colorList, curColorIndex } = this
      this.canvasList.forEach((item, index) => {
        const options = {
          width: item.width,
          height: item.height,
          minWidth: MIN_WIDTH, // Min brush width (px)
          maxWidth: MAX_WIDTH, // Max brush width
          minSpeed: 1.8, // Min speed for the brush to reach min width (px/ms), range 1.0-10.0
          color: colorList[curColorIndex],
          // New config
          bgImage: item.bgImage,
        };

        this[INSTANTIATE_NAME + index] = new SmoothSignature(document.querySelector('.' + item.className), options);
      })
    },

    initMode2() {
      this.canvasTop = document.getElementById('canvas-top').getContext('2d')
      this.canvasLeft = document.getElementById('canvas-left').getContext('2d')
      this.canvasRight = document.getElementById('canvas-right').getContext('2d')

      // Set font style
      const font = "36px xs, cursive"
      this.canvasTop.font = font
      this.canvasLeft.font = font
      this.canvasRight.font = font

      // Enhance sharpness
      const { scale } = this
      this.canvasTop.scale(scale, scale);
      this.canvasLeft.scale(scale, scale);
      this.canvasRight.scale(scale, scale);

      // Set background image
      this.imgObj1 = new Image()
      this.imgObj2 = new Image()
      this.imgObj1.src = hp
      this.imgObj2.src = dl
      this.imgObj1.onload = () => {
        // Draw background
        this.canvasTop.drawImage(this.imgObj1, 0, 0, 200, 60)

        // After font loads
        document.fonts.ready.then(() => {
          this.handleTopFillText()
        });
      }
      this.imgObj2.onload = () => {
        // Draw background
        this.canvasLeft.drawImage(this.imgObj2, 0, 0, 60, 364)
        this.canvasRight.drawImage(this.imgObj2, 0, 0, 60, 364)

        // After font loads
        document.fonts.ready.then(() => {
          this.handleLRFillText(this.canvasLeft, this.duilian.shang)
          this.handleLRFillText(this.canvasRight, this.duilian.xia)
        });
      }
    },

    // Mode 2 - refresh couplet
    refreshDuilian() {
      this.canvasTop.drawImage(this.imgObj1, 0, 0, 200, 60)
      this.canvasLeft.drawImage(this.imgObj2, 0, 0, 60, 364)
      this.canvasRight.drawImage(this.imgObj2, 0, 0, 60, 364)
      this.handleTopFillText()
      this.handleLRFillText(this.canvasLeft, this.duilian.shang)
      this.handleLRFillText(this.canvasRight, this.duilian.xia)
    },

    // Mode 2 - draw horizontal scroll
    handleTopFillText() {
      // Draw text
      this.canvasTop.fillStyle = this.colorList[this.curColorIndex]
      if (this.duilian.heng) {
        this.duilian.heng.split('').forEach((item, index) => {
          const left = 42 * (index + 1) - 22
          this.canvasTop.fillText(item, left, 40)
        })
      }
    },

    // Mode 2 - draw upper/lower couplet
    handleLRFillText(ctx, text) {
      ctx.fillStyle = this.colorList[this.curColorIndex]
      if (text) {
        text.split('').forEach((item, index) => {
          const top = 50 * (index + 1) - 8
          ctx.fillText(item, 13, top)
        })
      }
    },

    // Toggle mode
    toggleMode() {
      if (this.mode === 1) {
        this.mode = 2
        this.refreshDuilian()
      } else {
        this.mode = 1
      }
      localStorage.setItem('mode', this.mode);
    },

    // Open palette
    togglePalette() {
      this.colorListVisibility = !this.colorListVisibility
    },

    // Close palette
    handleTouchstart(e) {
      // When not clicking to select a color
      if (e.path[1]?.classList?.value !== 'colorList' && e.target.classList?.value !== 'cur-color') {
        this.colorListVisibility = false
      }
    },

    // Select color
    selectColor(index) {
      this.curColorIndex = index
      this.colorListVisibility = false
    },

    // Switch canvas
    changeCanvas(index) {
      this.curCanvasIndex = index
    },

    // Clear canvas
    handleClear() {
      this.curCanvasInstantiate.clear();
    },

    // Undo stroke
    handleUndo() {
      this.curCanvasInstantiate.undo();
    },

    // Preview
    handlePreview() {
      this.showTopTip();
      this.isShowTip = true
      const _this = this
      ImagePreview({
        images: this.getImageList(),
        closeable: true,
        startPosition: this.curCanvasIndex,
        onClose() {
          _this.isShowTip = false
        },
      });
    },

    // Open poster preview
    openPosters() {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = BG_WIDTH
      canvas.height = BG_HEIGHT
      const ctx = canvas.getContext('2d');
      const resultImageList = [];

      // Whether to hide the fortune character
      const isHideFu = this[INSTANTIATE_NAME + 3].isEmpty()
      this.bgList.forEach((item, index) => {
        // Draw background image
        ctx.drawImage(document.getElementById('bg-img-' + index), 0, 0, BG_WIDTH, BG_HEIGHT)

        // Draw couplet
        if (this.mode === 1) {
          this.canvasList.forEach((item, index) => {
            if (index === 3 && isHideFu) return;
            const dlCanvas = document.querySelector('.' + item.className)
            const { left, top, width, height } = POSITION[index]
            ctx.drawImage(dlCanvas, left, top, width, height)
          })
        } else {
          ['canvas-left', 'canvas-right', 'canvas-top'].forEach((item, index) => {
            const dlCanvas = document.getElementById(item)
            const { left, top, width, height } = POSITION[index]
            ctx.drawImage(dlCanvas, left, top, width, height)
          })
        }

        // Draw QR code
        ctx.drawImage(document.getElementById("qrcode"), 40, 1280, 580, 136)

        // Draw text
        ctx.font = "18px sans-serif"
        ctx.fillStyle = "#666666"
        ctx.fillText('©WeChat account "Fun Research Society"', 550, 1420)

        // Export image
        resultImageList.push(canvas.toDataURL('image/jpeg', 0.8))
      })

      // Open image preview
      this.isShowTip = true
      const _this = this
      ImagePreview({
        images: resultImageList,
        closeable: true,
        onClose() {
          _this.isShowTip = false
        },
      });
      this.showTopTip();
    },

    // Show top hint
    showTopTip() {
      if (!sessionStorage.getItem('showTip')) {
        sessionStorage.setItem('showTip', 'true');
        Notify({
          message: 'Long-press the image to save it to your device',
          color: '#c33825',
          background: '#eed3ae',
        });
      }
    },

    // Get the couplet image list
    getImageList(type = 'image/png') {
      const imageList = []
      this.canvasList.forEach((item, index) => {
        if (index === 3) {
          // The "fortune" character must be PNG
          type = 'image/png'
        }
        imageList.push(this[INSTANTIATE_NAME + index].toDataURL(type, 0.8))
      })
      return imageList
    },

    // On progress change
    changeProgress(progress) {
      this.progress = progress
      this.handleChangeSize()
    },

    // Adjust brush size
    handleChangeSize() {
      const { progress } = this
      this.curCanvasInstantiate.minWidth = MIN_WIDTH * progress / 100
      this.curCanvasInstantiate.maxWidth = MAX_WIDTH * progress / 100
    },

    // Refresh couplet
    handleRefresh(rotate) {
      this.duilian = duilianList[Math.floor(Math.random() * duilianList.length)]

      if (rotate) {
        if (this.mode === 2) {
          this.refreshDuilian()
        }
        // Rotate the icon
        this.isRotate = true
        setTimeout(() => {
          this.isRotate = false
        }, 300)
      }
    },

    // Play background music
    handlePlay() {
      const { bgm } = this.$refs
      if (bgm.paused) {
        bgm.play()
        this.isPlay = true
      } else {
        bgm.pause()
        this.isPlay = false
      }
    },

    // Finish entering couplet
    handleSubmitInput(values) {
      this.duilian = values
      this.showInputBox = false
      this.refreshDuilian()
    },

    // Finish picking couplet
    handlePickDuilian(item) {
      this.duilian = item
      this.showPickBox = false
      this.refreshDuilian()
    }
  },
};
</script>

```


More fun web apps — follow the WeChat account `Fun Research Society`:
> [Handwritten Spring Couplets](https://cl.xugaoyi.com/)</br>
> [FC Online Emulator](https://game.xugaoyi.com/)</br>
> [Patriotic Avatar Generator](https://avatar.xugaoyi.com/)</br>
> [Payment Voice Generator](https://zfb.xugaoyi.com/)
