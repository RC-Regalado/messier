<template>
  <label>
    <textarea style="width: 100%; height: 100%" ref="edit"></textarea>
  </label>
</template>

<script>
import CodeMirror from 'codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/idea.css'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/mode/javascript/javascript.js'

export default {
  name: 'e-main101',
  data: () => ({
    mode: 'javascript',
    code: 'function hello () {\n' +
      '\tconsole.log(\'Hello world!\\n\')\n' +
      '}',
    options: {
      // Indentation format
      tabSize: 4,
      // Subject, corresponding subject library JS needs to be introduced in advance
      // theme: 'idea',
      // set number
      lineNumbers: true,
      line: true,
      extraKeys: { Ctrl: 'autocomplete' }
    },
    editor: null
  }),
  props: {
    value: String,
    language: {
      type: String,
      default: null
    }
  },
  mounted () {
    this.editor = CodeMirror.fromTextArea(this.$refs.edit, this.options)
    this.editor.setValue(this.code)
  },
  methods: {}
}
</script>

<style scoped>

</style>
