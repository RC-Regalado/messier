<template>
  <div class="icon-bar">
    <v-row>
      <v-btn text @click.native="onToggleProp('font-weight', 'bold', isBold)">
        <icon v-bind="bold"
              :color="isBold ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
        </icon>
      </v-btn>
      <v-btn text @click.native="onToggleProp('font-style', 'italic', isItalic)">
        <icon v-bind="italic"
              :color="isItalic ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
        </icon>
      </v-btn>
    </v-row>
    <v-row>
      <v-btn text @click.native="onToggleProp('text-decoration', 'underline', isUnderlined)">
        <icon v-bind="underline"
              :color="isUnderlined ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"></icon>
      </v-btn>
      <v-btn text @click.native="onToggleProp('text-decoration', 'line-through', isStriked)">
        <icon v-bind="strikethrough"
              :color="isStriked ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'">
        </icon>
      </v-btn>
    </v-row>
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
      this.$emit('change', {
        prop,
        value: (isOn ? 'inherit' : val)
      })
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
