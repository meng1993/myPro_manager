<!-- 富文本编辑器 -->
<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
  export default {
    name: 'UE',
    data() {
      return {
        editor: null
      }
    },
    props: {
      defaultMsg: {
        type: String
      },
      config: {
        type: Object
      }
    },
    mounted() {
      const _this = this
      // 初始化UE
      this.editor = UE.getEditor('editor', this.config)
      this.editor.addListener("ready", function() {
        // 确保UE加载完成后，放入内容。
        _this.editor.setContent(_this.defaultMsg)
      })
    },
    methods: {
      getUEContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy()
    }
  }
</script>
<style>
</style>
