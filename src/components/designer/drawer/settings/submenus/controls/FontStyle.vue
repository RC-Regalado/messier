<template>
  <div class="icon-bar">
    <icon v-bind="bold"
             @click.native="onToggleProp('font-weight', 'bold', isBold)"
             :color="isBold ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
    </icon>
    <icon v-bind="italic"
             @click.native="onToggleProp('font-style', 'italic', isItalic)"
             :color="isItalic ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
    </icon>
    <icon v-bind="underline"
             @click.native="onToggleProp('text-decoration', 'underline', isUnderlined)"
             :color="isUnderlined ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
    </icon>
    <icon v-bind="strikethrough"
             @click.native="onToggleProp('text-decoration', 'line-through', isStriked)"
             :color="isStriked ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
    </icon>
  </div>
</template>

<script>
import assets from '@/assets'

export default {
  name: 'text-align',
  props: {
    fontWeight: String,
    fontStyle: String,
    textDecoration: String,
    bold: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.bold,
        width: 22,
        height: 22
      })
    },
    italic: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.italic,
        width: 22,
        height: 22
      })
    },
    underline: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.underline,
        width: 22,
        height: 22
      })
    },
    strikethrough: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.strikethrough,
        width: 22,
        height: 22
      })
    }
  },
  computed: {
    isBold () {
      return (this.fontWeight === 'bold')
    },
    isItalic () {
      return (this.fontStyle === 'italic')
    },
    isUnderlined () {
      return (this.textDecoration === 'underline')
    },
    isStriked () {
      return (this.textDecoration === 'line-through')
    }
  },
  methods: {
    onToggleProp (prop, val, isOn) {
      this.$emit('change', { prop, value: (isOn ? 'inherit' : val) })
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
