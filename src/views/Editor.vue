<template>
  <div class="layout-container">
    <div class="edit-view">
      <header101 margin="0" :scroll0="notScrolled"></header101>
      <main role="main" id="main">
        <e-main101></e-main101>
      </main>
    </div>
  </div>
</template>

<script>
import Header101 from '@/components/common/header'
import EMain101 from '@/components/editor/main'

export default {
  name: 'Editor',
  components: { EMain101, Header101 },
  data: () => ({
    notScrolled: true
  }),
  methods: {
  },
  computed: {
  }
}
</script>

<style scoped>
.layout-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.edit-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  /*overflow-x: hidden;*/
}

#main {
  height: 100%;
  position: relative;
  display: inline-block;
  overflow-y: auto;
  overflow-x: auto;
  flex-grow: 1;
  margin-right: 0;
}

/* IN DEVICES SMALLER THAN 1024px -> NO DRAWER (so remove margins) */
/*@media screen and (max-width: 1024px) {*/
/*  #main {*/
/*    margin: 0;*/
/*  }*/
/*}*/

dialog {
  width: 320px !important;
  border: none !important;
  box-shadow: 0 9px 46px 8px rgba(0, 0, 0, .14),
  0 11px 15px -7px rgba(0, 0, 0, .12),
  0 24px 38px 3px rgba(0, 0, 0, .2);
}

dialog, dialog::backdrop {
  animation-name: anim-open;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

@keyframes anim-open {
  0% {
    opacity: 0;
    transform: scale3d(1.1, 1.1, 1);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
</style>
