<template>
  <el-pagination class="margin_bottom_15" background layout="prev, pager, next" :data="pageData" :total="pageData.total" @size-change="sizeChange" @current-change="currentChange" @prev-click="prevBtn" @next-click="nextBtn">
  </el-pagination>
</template>


<script>
  export default {
    name: 'page-info',
    pageData: {
      total: 0
    },
    props: {
      pageData: {
        type: Object,
        required: true
      }
    },
    methods: {
      sizeChange: function(data) {
        console.log('size_change', data)
      },
      currentChange: function(data) {
        console.log('current_change', data)
        this.$emit('currentChange', data)
      },
      prevBtn: function(data) {
        console.log('prevBtn', data)
      },
      nextBtn: function(data) {
        console.log('nextBtn', data)
      }
    }
  }
</script>

<style scoped>
  .margin_bottom_15 {
    margin-top: 20px;
    bottom: 15px;
    width: 80%;
    text-align: center;
  }
</style>
