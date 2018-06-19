<template>
  <div class="course_container" style="padding: 0 15px;">
    <!--头部功能栏-->
    <el-row class="margin_top_bottom_15" :gutter="20">
      <el-col :span="4" :offset="13">
        <el-date-picker v-model="searchData.payTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="交易时间"></el-date-picker>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="推广人昵称/手机号" v-model="searchData.queries"></el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" icon="el-icon-search" @click="videoCourseSearchBtn">搜索</el-button>
      </el-col>
    </el-row>

    <!--数据表格-->
    <el-table :data="tableData" tooltip-effect="dark" ref="multipleTable" border style="width: 100%">
      <el-table-column align="left" header-align="center" prop="specialColumn" label="交易时间" width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.payTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="课程名称" width="500" prop="classHourColumn">
        <template slot-scope="scope">{{scope.row.mainTitle}}</template>
      </el-table-column>
      <el-table-column align="center" label="推广人昵称" width="150" prop="priceColumn">
        <template slot-scope="scope">{{scope.row.nickName}}</template>
      </el-table-column>
      <el-table-column align="center" label="交易金额" width="250" prop="priceColumn">
        <template slot-scope="scope">
          ¥{{scope.row.coursePrice | minuteToCircle}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="佣金" prop="optionsColumn">
        <template slot-scope="scope">
          ¥{{scope.row.distributMoney | minuteToCircle}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="optionsColumn">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status === 1">待付款</el-tag>
          <el-tag type="info" v-else-if="scope.row.status === 2">已付款</el-tag>
          <el-tag type="info" v-else-if="scope.row.status === 3">代退款</el-tag>
          <el-tag type="info" v-else-if="scope.row.status === 4">退款中</el-tag>
          <el-tag type="info" v-else-if="scope.row.status === 5">已退款</el-tag>
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
        // 类型选项框
        options: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '进行中'
        }, {
          value: '2',
          label: '停止'
        }, {
          value: '3',
          label: '未开始'
        }],
        value: '0',
        // 表格数据
        tableData: [{
          payTime: '',
          mainTitle: '',
          nickName: '',
          coursePrice: '',
          distributMoney: '',
          status: '' // 状态（1 =待付款 2=已付款 3=代退款 4=退款中 5 =已退款）
        }],
        pageData: {
          total: 0
        },
        // 列表查询参数
        searchData: {
          pageNum: 1,
          pageSize: 10,
          payTime: '',
          queries: ''
        }
      }
    },
    filters: {
      // 格式化金额
      minuteToCircle(money) {
        return money === null || money === '' ? 0 : money
      },
      // 格式化时间戳
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      'page-info': pageInfo
    },
    created() {
      this.initList()
    },
    methods: {
      // 初始化列表数据
      initList: function() {
        const params = this.searchData
        this.$api.post('/distribut/getRecordList', params, false, r => {
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            return
          }
          const data = r.data
          this.tableData = data.list
          this.pageData.total = data.total
        })
      },
      // 页码发生变化时触发
      onCurrentChange: function(pageIndex) {
        // console.log('接收的数据--------->' + pageIndex)
        this.searchData.pageNum = pageIndex
        this.initList()
      },
      // 搜索按钮
      videoCourseSearchBtn: function() {
        this.initList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .margin_top_bottom_15 {
    margin: 15px 0;
  }
</style>
