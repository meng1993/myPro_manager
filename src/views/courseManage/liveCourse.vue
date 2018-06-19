<template>
    <div class="course_container" style="padding: 0 15px;">
      <!--头部功能栏-->
      <el-row class="margin_top_bottom_15" :gutter="20">
        <el-col :span="3">
          <el-button @click="addLive">新增直播课</el-button>
        </el-col>
        <el-col :span="3" :offset="10">
          <el-select  v-model="liveType" placeholder="全部">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col  :span="5">
          <el-input v-model="searchValue" placeholder="请输入课程名称关键字"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-search" @click="searchMessage(liveType,searchValue)" >搜索</el-button>
        </el-col>
      </el-row>

      <!--数据表格-->
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        ref="multipleTable"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          label="直播课程"
          width="700">
          <template slot-scope="scope">
            <el-row :gutter="100">
              <el-col :span="5" style="margin: 15px auto">
                <img  align="left"  width="150px" height="100px" :src="scope.row.smallCover"/>
              </el-col>
              <el-col :span="17" align="left">
                <el-row>
                  <el-col>
                    <h3> {{scope.row.mainTitle}}</h3>
                  </el-col>
                  <el-col>
                    {{scope.row.secondTitle}}
                  </el-col>
                  <el-col style="margin-top: 20px">
                    <el-tag type="success">直播时间</el-tag>  {{scope.row.liveStartTime | formatDate }}
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="type"
          label="类型"
          width="180">
          <template slot-scope="scope">
            <p v-if="(scope.row.liveType) == 1">语音直播</p>
            <p v-if="(scope.row.liveType) == 2">视频直播</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="价格">
          <template slot-scope="scope" ><p style="color: red">¥{{scope.row.sellPrice/100}}</p></template>
        </el-table-column>
        <el-table-column
          align="center"
          label="统计">
          <template slot-scope="scope">
            <p>预约：{{scope.row.saledNum }}</p>
            <p>学习：{{scope.row.studyNum }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-button type="success" v-if="(scope.row.liveStatus) == 0">待直播</el-button>
            <el-button type="warning" v-if="(scope.row.liveStatus) == 1">直播中</el-button>
            <el-button type="info" v-if="(scope.row.liveStatus) == 2">已结束</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="operation"
          label="操作">
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text"
                       @click="editMessage(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text"
                       @click="deleteLive(scope.$index, scope.row)">删除</el-button>
            <el-button type="text"
                       @click="">导出音频</el-button>
            <el-button type="text"
                       @click="copyUrl(scope.$index, scope.row)">复制链接</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <page-info :pageData="pageData" @currentChange="onCurrentChange"></page-info>
    </div>
</template>

<script>
import pageInfo from '../../components/courseManage/page'
import { formatDate } from '../../utils/index'
export default {
  data() {
    return {
      // 直播类型选项框
      options: [{
        value: 0,
        label: '全部'
      }, {
        value: 1,
        label: '语音直播'
      }, {
        value: 2,
        label: '视频直播'
      }],
      // 表格数据
      tableData: [{
        courseId: '',
        mainTitle: '',
        secondTitle: '',
        liveType: '',
        sellPrice: '',
        smallCover: '',
        bigCover: '',
        fileUrl: '',
        liveUrl: '',
        liveStartTime: '',
        saledNum: '',
        studyNum: '',
        liveStatus: ''
      }],
      liveType: 0,
      searchValue: '',
      pageData: {
        total: 0
      }
    }
  },
  created() {
    this.getMessage()
  },
  components: {
    'page-info': pageInfo
  },
  filters: {
    // 格式化时间戳
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    // 添加直播课程
    addLive() {
      this.$router.push({ name: 'addCourse' })
    },
    // 获取列表
    getMessage() {
      // let data = { pageNum: 1, pageSize: 5 }
      this.$api.post('live/list', { pageNum: 1, pageSize: 10 }, false, r => {
        console.log(JSON.stringify(r))
        this.tableData = r.data.list
        this.pageData.total = r.data.total
      })
    },
    // 关键字搜索
    searchMessage(type, value) {
      console.log(type)
      console.log(value)
      this.$api.post('live/getListBySearch', { liveType: this.liveType, queries: this.searchValue, pageNum: 1, pageSize: 10 }, false, r => {
        console.log(JSON.stringify(r))
        this.tableData = r.data.list
      })
    },
    // 页码发生变化时触发
    onCurrentChange: function(pageIndex) {
      console.log('接收的数据--------->' + pageIndex)
      this.searchData.pageNum = pageIndex
      this.initList()
    },
    // 删除课程
    deleteLive(index, row) {
      console.log(index)
      console.log(row)
      this.$confirm('是否确定要删除此课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$api.post('live/delete', { courseId: row.courseId }, false, r => {
          console.log(JSON.stringify(r))
          this.getMessage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 复制链接
    copyUrl(index, row) {
      // var url = row.liveUrl
      alert('已复制好，可贴粘。')
    },
    // 编辑
    editMessage(index, row) {
      console.log(row)
      this.$router.push({ name: 'addCourse', params: { dataObj: row }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .margin_top_bottom_15{
    margin: 15px 0;
  }
  .margin_bottom_15{
    position: fixed; /*or前面的是absolute就可以用*/
    bottom: 15px;
    width: 80%;
    text-align: center;
  }
</style>
