<template>
  <div class="material-theme__wrapper">
    <div class="material-theme">
      <icon v-bind="reset_color"
            @click.native="$emit('change', {prop: '--mdc-theme-primary', value: 'inherit'})">
      </icon>
      <color-picker label="Primary color"
                    icon="system/editor/color"
                    :color="primary" class="material-theme__color-picker"
                    @input="newColor => $emit('change', {prop: '--mdc-theme-primary', value: newColor})">
      </color-picker>
    </div>

    <div class="material-theme">
      <svg v-bind="reset_color"
           @click.native="$emit('change', {prop: '--mdc-theme-secondary', value: 'inherit'})">
      </svg>
      <color-picker label="Secondary color"
                    :icon="color_2"
                        :color="secondary" class="material-theme__color-picker"
                    @input="newColor => $emit('change', {prop: '--mdc-theme-secondary', value: newColor})">
      </color-picker>
    </div>

    <div class="material-theme">
      <icon v-bind="reset_color"
            @click.native="$emit('change', {prop: '--mdc-theme-background', value: 'inherit'})">
      </icon>
      <color-picker label="Background color"
                    :icon="bg"
                    :color="background" class="material-theme__color-picker"
                    @input="newColor => $emit('change', {prop: '--mdc-theme-background', value: newColor})">
      </color-picker>
    </div>
  </div>
</template>

<script>
import ColorPicker from './ColorPicker'

import assets from '@/assets'

export default {
  name: 'material-theme',
  components: { ColorPicker },
  props: {
    reset_color: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.reset_color,
        width: 22,
        height: 22
      })
    },
    primary: String,
    secondary: String,
    background: String
  },
  data: () => ({
    bg: assets.bg_color,
    color_2: assets.color_2
  })
}
</script>

<style scoped>
.material-theme__wrapper {

}

.material-theme {
  margin: 16px 20px 8px;
  user-select: none;
  display: flex;
}

.material-theme svg {
  cursor: pointer;
  margin-right: 8px;
  fill: rgba(0, 0, 0, .54);
}

.material-theme svg:hover {
  fill: rgba(0, 0, 0, .87);
}

.material-theme__color-picker {
  margin: 0;
  width: 100%;
}
</style>
