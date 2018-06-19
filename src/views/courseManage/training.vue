<template>
  <div class="banner_container" style="padding: 0 15px;">

    <el-row class="margin_top_bottom_15">
      <el-button @click="cleanMessage()">新增内训课程</el-button>
    </el-row>

    <!--表格-->
    <el-table
      class="banner_margin_bottom"
      border
      ref="multipleTable"
      :data="trainingData"
      tooltip-effect="dark"
      style="width: 100%"
      >
      <el-table-column
        prop="trainId"
        type="selection"
        width="55" :hidden="true">
      </el-table-column>
      <el-table-column
        align="center"
        label="内训课程图片"
      >
        <template slot-scope="scope"><img :src="scope.row.coverUrl" :width="60"/></template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="trainName"
        label="内训课程名称"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text"
                     @click="openDialog(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    created() {
      this.getMessage()
    },
    data() {
      return {
        trainingData: [{
          trainId: '',
          trainName: '',
          coverUrl: '',
          orderNum: ''
        }
        ]
      }
    },
    methods: {
      getMessage() {
        this.$api.post('train/list', { pageNum: 1, pageSize: 20 }, false, r => {
          console.log(JSON.stringify(r))
          if (r.status !== 0) {
            return this.$message.error('服务器错误')
          }
          this.trainingData = r.data.list
        })
      }
    }
  }
</script>

<style scoped>
  img{
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
</style>
