<template>
  <div data-mr-el="true"
       class="mr-el"
       :style="style"
       @mousedown.exact="e => $emit('activated', e)"
       @mousedown.meta.capture="e => $emit('activated', e)"
       @mousedown.ctrl.capture="e => $emit('activated', e)"
  >
    <!-- IMPORTANT! KEEP SLOT AS FIRST CHILD -->
    <slot></slot>
    <!-- IMPORTANT! KEEP SLOT AS FIRST CHILD -->

    <div v-if="resizable">
      <div data-mr-handle="true"
           v-for="handle in handles"
           :key="handle"
           class="handle" :class="handle"
           :style="{ display: active ? 'block' : 'none'}">
      </div>
    </div>
    <div v-if="!resizable"
         class="selection-box"
         :style="{ display: active ? 'block' : 'none'}">
    </div>
  </div>
</template>

<script>
export default {
  name: 'mr-el',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 'auto',
      validator: function (val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    height: {
      type: [String, Number],
      default: 'auto',
      validator: function (val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    minWidth: {
      type: Number,
      default: 20,
      validator: function (val) {
        return val > 0
      }
    },
    minHeight: {
      type: Number,
      default: 20,
      validator: function (val) {
        return val > 0
      }
    },
    top: {
      type: [String, Number],
      default: 0,
      validator: function (val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    bottom: {
      type: [String, Number],
      default: 'auto',
      validator: function (val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    left: {
      type: [String, Number],
      default: 0,
      validator: function (val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    right: {
      type: [String, Number],
      default: 'auto',
      validator: function (val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    zIndex: {
      type: [String, Number],
      default: 'auto',
      validator: function (val) {
        return ((typeof val === 'string') ? val === 'auto' : val >= 0)
      }
    },
    handles: {
      type: Array,
      default: function () {
        return ['mt', 'mr', 'mb', 'ml', 'tl', 'tr', 'br', 'bl']
      }
    }
  },
  computed: {
    resizable () {
      return ((this.handles !== null) && (this.handles.length > 0))
    },

    style () {
      return {
        zIndex: this.zIndex,
        minWidth: this.minWidth + 'px',
        minHeight: this.minHeight + 'px',
        top: (typeof this.top === 'number') ? (this.top + 'px') : this.top,
        left: (typeof this.left === 'number') ? (this.left + 'px') : this.left,
        bottom: (typeof this.bottom === 'number') ? (this.bottom + 'px') : this.bottom,
        right: (typeof this.right === 'number') ? (this.right + 'px') : this.right,
        width: (typeof this.width === 'number') ? (this.width + 'px') : this.width,
        height: (typeof this.height === 'number') ? (this.height + 'px') : this.height
      }
    }
  }
}
</script>

<style scoped>
.mr-el {
  position: absolute;
  box-sizing: border-box;
}

.mr-el:hover {
  cursor: move;
}

.mr-el > * {
  margin: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
}

.selection-box {
  border: 2px solid #03a9f4;
}

.handle {
  box-sizing: border-box;
  display: none;
  position: absolute;
  width: 10px;
  height: 10px;
  font-size: 1px;
  border-radius: 50%;
  border: 1px solid #fff;
}

</style>
