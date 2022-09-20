<template>
  <div class="action-bar__wrapper">
    <button v-tooltip.right="'zoom in'" class="action-btn" @click="zoomIn" :disabled="!canZoomIn">
      <icon v-bind="zoom_in"
        :color="canZoomIn ? '#fff' : 'rgba(255,255,255,.5)'">
      </icon>
    </button>

    <div class="zoom-value">{{Math.round(zoom * 100) + '%'}}</div>

    <button v-tooltip.right="'zoom out'" class="action-btn" @click="zoomOut" :disabled="!canZoomOut">
      <icon v-bind="zoom_out"
        :color="canZoomOut ? '#fff' : 'rgba(255,255,255,.5)'">
      </icon>
    </button>
  </div>
</template>

<script>
import assets from '@/assets'

const MAX_ZOOM = 2.5
const MIN_ZOOM = 0.5

export default {
  name: 'zoom-menu',
  props: {
    zoom: {
      type: Number
    },
    zoom_in: {
      type: Object,
      default: () => ({
        data: assets.zoom_in,
        width: 24,
        height: 24
      })
    },
    zoom_out: {
      default: () => ({
        data: assets.zoom_out,
        width: 24,
        height: 24
      })
    }
  },
  computed: {
    canZoomIn () { return this.zoom < MAX_ZOOM },
    canZoomOut () { return this.zoom > MIN_ZOOM }
  },
  methods: {
    zoomIn () { this.$emit('zoomChange', Math.round((this.zoom + 0.1) * 10) / 10) },
    zoomOut () { this.$emit('zoomChange', Math.round((this.zoom - 0.1) * 10) / 10) }
  }
}
</script>

<style scoped>
.action-bar__wrapper {
  width: 48px;
  z-index: 1000;
  display: block;
  align-items: center;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.78);
  border-radius: 50px;
  opacity: 0.25;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.action-bar__wrapper:hover {
  opacity: 1;
}

.action-btn {
  height: 36px;
  width: 36px;
  min-width: 28px;
  min-height: 28px;
  padding: 1px;
  margin: 6px 0;
  border-radius: 100%;

  background-color: transparent;
  border: 0px none;
  user-select: none;
  outline: none;
}
.action-btn:hover {
  background-color: rgba(238, 238, 238, 0.038);
}
.action-btn:active {
  background-color: rgba(238, 238, 238, 0.38);
}
.action-btn * {
  vertical-align: middle;
}

.zoom-value {
  text-align: center;
  color: #fff;
  font-size: small;
}
</style>
