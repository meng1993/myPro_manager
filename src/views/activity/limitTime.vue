<template>
    <div class="course_container" style="padding: 0 15px;">
      <!--头部功能栏-->
      <el-row class="margin_top_bottom_15" :gutter="20">
        <el-col :span="3">
          <el-button @click="addLive">创建优惠</el-button>
        </el-col>
        <el-col :span="3" :offset="10">
          <el-select  v-model="status" placeholder="全部">
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
          <el-button type="primary" icon="el-icon-search" @click="searchMessage(status,searchValue)" >搜索</el-button>
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
          label="优惠课程"
          width="500">
          <template slot-scope="scope">
            <el-row :gutter="100">
              <el-col :span="5" style="margin: 15px auto">
                <img  align="left"  width="150px" height="100px" :src="scope.row.smallCover"/>
              </el-col>
              <el-col :span="17" align="left">
                <div style="padding-left: 50px;">
                <h3> {{scope.row.mainTitle}}</h3>
              <!--  <p>{{scope.row.secondTitle}}</p>
                <p>直播时间：{{scope.row.liveStartTime}}</p>-->
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="type"
          label="原价"
          width="180">
         <!-- <template slot-scope="scope">
            <p v-if="(scope.row.liveType) == 1">语音直播</p>
            <p v-if="(scope.row.liveType) == 2">视频直播</p>
          </template>-->
          <template slot-scope="scope" ><p style="color: red">¥{{scope.row.sellPrice/100}}</p></template>
        </el-table-column>
        <el-table-column
          align="center"
          label="优惠价">
          <template slot-scope="scope" ><p style="color: red">¥{{scope.row.seckillPrice/100}}</p></template>
        </el-table-column>
        <el-table-column
          align="center"
          label="优惠时间">
          <template slot-scope="scope">
            <p>起：{{scope.row.seckillBeginTime  | formatDate }}</p>
            <p>止：{{scope.row.seckillEndTime  | formatDate }}</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-button type="warning" v-if="(scope.row.status) == 2">已结束</el-button>
            <el-button type="success" v-if="(scope.row.status) == 1">进行中</el-button>
            <el-button type="info" v-if="(scope.row.status) == 3">未开始</el-button>
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
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
        value: 3,
        label: '未开始'
      }, {
        value: 1,
        label: '进行中'
      }, {
        value: 2,
        label: '已结束'
      }],
      // 表格数据
      tableData: [{
        courseId: '',
        mainTitle: '',
        secondTitle: '',
        liveType: '',
        sellPrice: '',
        smallCover: '',
        liveUrl: '',
        seckillBeginTime: '',
        seckillEndTime: '',
        seckillPrice: '',
        liveStatus: ''
      }],
      status: 0,
      searchValue: '',
      pageNum: 1,
      pageData: {
        total: 0
      }
    }
  },
  created() {
    this.getMessage()
  },
  filters: {
    // 格式化时间戳
    formatDate(time) {
      if (!time) return ''
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  components: {
    'page-info': pageInfo
  },
  methods: {
    // 添加限时优惠
    addLive() {
      this.$router.push({ name: 'addLimitTime' })
    },
    // 获取列表
    getMessage() {
      // let data = { pageNum: 1, pageSize: 5 }
      this.$api.post('limitTime/qryList', { pageNum: 1, pageSize: 10 }, false, r => {
        console.log(JSON.stringify(r))
        this.tableData = r.data.list
        this.pageData.total = r.data.total
      })
    },
    // 关键字搜索
    searchMessage(type, value) {
      console.log(type)
      console.log(value)
      this.$api.post('limitTime/qryList', { status: this.status, name: this.searchValue, pageNum: this.pageNum, pageSize: 10 }, false, r => {
        console.log(JSON.stringify(r))
        this.tableData = r.data.list
      })
    },
    // 页码发生变化时触发
    onCurrentChange: function(pageIndex) {
      console.log('接收的数据--------->' + pageIndex)
      this.pageNum = pageIndex
      this.searchMessage()
    },
    // 编辑
    editMessage(index, row) {
      console.log(row)
      this.$router.push({ name: 'addLimitTime', params: { id: row.seckillId }})
    },
    // 删除课程
    deleteLive(index, row) {
      console.log(index)
      console.log(row)
      this.$confirm('是否确定要删除此活动?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$api.post('limitTime/delete', { id: row.seckillId }, false, r => {
          console.log(JSON.stringify(r))
          this.getMessage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
