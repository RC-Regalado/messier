<template>
  <div class="icon-bar">
    <icon v-bind="align_left"
             @click.native="onToggleProp('left', isAlignedLeft)"
             :color="isAlignedLeft ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
    </icon>
    <icon v-bind="align_right"
             @click.native="onToggleProp('right', isAlignedRight)"
             :color="isAlignedRight ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
    </icon>
    <icon v-bind="align_center"
             @click.native="onToggleProp('center', isCentered)"
             :color="isCentered ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
    </icon>
    <icon v-bind="align_justify"
             @click.native="onToggleProp('justify', isJustified)"
             :color="isJustified ?'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
    </icon>
  </div>
</template>

<script>
import assets from '@/assets'

export default {
  name: 'text-align',
  props: {
    align_left: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.align_left,
        width: 22,
        height: 22
      })
    },
    align_right: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.align_right,
        width: 22,
        height: 22
      })
    },
    align_center: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.align_center,
        width: 22,
        height: 22
      })
    },
    align_justify: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.align_justify,
        width: 22,
        height: 22
      })
    },
    textAlign: {
      type: String
    }
  },
  computed: {
    isAlignedLeft () {
      return (this.textAlign === 'left')
    },
    isAlignedRight () {
      return (this.textAlign === 'right')
    },
    isCentered () {
      return (this.textAlign === 'center')
    },
    isJustified () {
      return (this.textAlign === 'justify')
    }
  },
  methods: {
    onToggleProp (val, isOn) {
      this.$emit('change', isOn ? 'inherit' : val)
    }
  }
}
</script>

<style scoped>
.icon-bar {
  margin: 16px 20px 8px;
  user-select: none;
  text-align: center;
  display: flex;
  justify-content: space-between;
}

.icon-bar svg {
  cursor: pointer;
}
</style>
