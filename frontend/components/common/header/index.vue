<template>
  <div :style="{'margin-left': margin}" class="header theme--dark" :class="{'not-scrolled': scroll0}">
    <a class="home-btn" href="#" target="_blank">
      <!--    <svgicon icon="product/vuegg"></svgicon>-->
    </a>

    <input v-model="tmpProjectTitle" class="title-input" @blur="onTitleBlur" title="Project title" placeholder="Title">
    <div class="spacer"></div>
    <action-bar></action-bar>

    <user-menu></user-menu>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ActionBar from './ActionBar'
import { updateProject } from '@/store/types'
import UserMenu from '@/components/common/header/UserMenu'

export default {
  name: 'MainHeader',
  components: {
    ActionBar,
    UserMenu
  },
  props: {
    scroll0: {
      type: Boolean
    },
    margin: {
      type: String,
      default: '250px'
    }
  },
  data: function () {
    return {
      tmpProjectTitle: ''
    }
  },
  computed: mapState({
    project: state => state ? state.project : {},
    projectTitle: state => state ? state.project.title : ''
  }),
  methods: {
    onTitleBlur () {
      if (this.tmpProjectTitle && this.tmpProjectTitle !== this.projectTitle) {
        return 0
      }
    },
    ...mapMutations([updateProject])
  },
  created: function () {
    this.tmpProjectTitle = this.projectTitle
  },
  watch: {
    projectTitle: function (val) {
      this.tmpProjectTitle = val
    }
  }
}

</script>

<style scoped>
.header {
  z-index: 1000;
  height: 64px;
  width: calc(100% - 240px);
  color: rgba(0, 0, 0, 0.66);
  padding: 0 25px 0 25px;
  border: none;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-self: stretch;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
  0 1px 5px 0 rgba(0, 0, 0, 0.12),
  0 3px 1px -2px rgba(0, 0, 0, 0.2);

  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  transition-property: max-height, box-shadow;
}

.not-scrolled {
  box-shadow: none;
}

/* IN DEVICES SMALLER THAN 1024px -> NO DRAWER (so remove margins) */
@media screen and (max-width: 1024px) {
  .header {
    margin: 0;
    width: 100%;
  }
}

.home-btn {
  margin-right: 25px;
  border: none;
  border-radius: 50%;
  padding: 0;
  background-color: transparent;
  outline: none;
}

.spacer {
  width: 12px;
}

.title-input {
  flex-grow: 1;
  border: 0;
  height: 56px;
  background: transparent;
  outline: none;
}
</style>
