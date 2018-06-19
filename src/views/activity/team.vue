<template>
    <div class="course_container" style="padding: 0 15px;">
      <!--头部功能栏-->
      <el-row class="margin_top_bottom_15" :gutter="20">

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
          <el-input v-model="searchValue" placeholder="请输入团长名称"></el-input>
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
          label="团长名称"
          width="500">
          <template slot-scope="scope">
            <el-row :gutter="100">
              <el-col :span="5" style="margin: 15px auto">
                <img  align="left"  width="50px" height="50px" style="border-radius:50px;" :src="scope.row.headImg"/>
              </el-col>
              <el-col :span="17" align="left">
                <div style="padding-left: 50px;">
                <h3> {{scope.row.username}}</h3>
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
          label="开团时间"
          width="180">
          <template slot-scope="scope" ><p >{{scope.row.beginTime | formatDate }}</p></template>
        </el-table-column>
        <el-table-column
          align="center"
          label="拼成时间">
          <template slot-scope="scope" ><p >{{scope.row.finishedTime | formatDate }}</p></template>
        </el-table-column>

        <el-table-column
          align="center"
          label="拼团情况">
          <template slot-scope="scope" ><p >{{scope.row.joinNum}}/{{scope.row.peopleLimit}}</p></template>
        </el-table-column>

        <el-table-column
          align="center"
          label="状态">
          <template slot-scope="scope">
            <el-button type="success" v-if="(scope.row.groupStatus) == 2">成功</el-button>
            <el-button type="warning" v-if="(scope.row.groupStatus) == 1">进行中</el-button>
            <el-button type="info" v-if="(scope.row.groupStatus) == 3">失败</el-button>
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
        value: 1,
        label: '进行中'
      }, {
        value: 2,
        label: '成功'
      }, {
        value: 3,
        label: '失败'
      }],
      // 表格数据
      tableData: [{
        courseId: '',
        username: '',
        headImg: '0',
        groupId: '',
        joinNum: '0',
        peopleLimit: '',
        beginTime: '',
        finishedTime: '',
        groupStatus: ''
      }],
      status: 0,
      pageNum: 1,
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
      if (!time) return ''
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  methods: {
    // 获取列表
    getMessage() {
      // let data = { pageNum: 1, pageSize: 5 }
      this.$api.post('group/qryTeamList', { pageNum: this.pageNum, pageSize: 10 }, false, r => {
        console.log(JSON.stringify(r))
        this.tableData = r.data.list
        this.pageData.total = r.data.total
      })
    },
    // 关键字搜索
    searchMessage(type, value) {
      console.log(type)
      console.log(value)
      this.$api.post('group/qryTeamList', { status: this.status, name: this.searchValue, pageNum: this.pageNum, pageSize: 10 }, false, r => {
        console.log(JSON.stringify(r))
        this.tableData = r.data.list
        this.pageData.total = r.data.total
      })
    },
    // 页码发生变化时触发
    onCurrentChange: function(pageIndex) {
      console.log('接收的数据--------->' + pageIndex)
      this.pageNum = pageIndex
      this.searchMessage()
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
