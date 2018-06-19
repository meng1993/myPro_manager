<template>
  <div class="coupon_container" style="padding: 0 15px;">
    <!--头部功能栏-->
    <el-row class="margin_top_bottom_15" :gutter="20">
      <el-col :span="3">
        <el-button @click="addCoupon">新增优惠券</el-button>
      </el-col>
      <el-col :span="2" :offset="5">
        <el-select  v-model="couponStatus" placeholder="状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-date-picker
            v-model="dateRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col  :span="5" >
        <el-input v-model="nameOrPhone" placeholder="推广人昵称/手机号"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="el-icon-search" @click="searchMessage(couponStatus,dateRange,nameOrPhone)" >搜索</el-button>
      </el-col>
    </el-row>

    <!--数据表格-->
    <el-table :data="tableData" tooltip-effect="dark" ref="multipleTable" border style="width: 100%">
      <el-table-column
        prop="couponName"
        align="center"
        label="优惠券名称"
        width="250">
      </el-table-column>
      <el-table-column
        align="center"
        label="面额"
        width="180">
        <template slot-scope="scope">
          <p>¥{{scope.row.couponMoney/100}}</p>
          <p>{{scope.row.couponScope}}</p>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="有效期"
        width="250">
        <template slot-scope="scope">
          <p>起：{{scope.row.validBeginTime | formatDate }}</p>
          <p>止：{{scope.row.validEndTime | formatDate }}</p>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="限领"
        width="180">
        <template slot-scope="scope">
          <p>1张/人</p>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="发行量"
        width="180">
        <template slot-scope="scope" ><p>{{scope.row.sendNum}}</p></template>
      </el-table-column>
      <el-table-column
        align="center"
        label="统计">
        <template slot-scope="scope">
          <p>已领：{{scope.row.receiveNum }}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <el-button type="success" v-if="scope.row.status === 0">领取中</el-button>
          <el-button type="danger" v-else-if="scope.row.status === 1">已领完</el-button>
          <el-button type="info" v-else="scope.row.status === 2">已结束</el-button>
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
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <!--<el-button type="text"-->
                     <!--@click="copyUrl(scope.$index, scope.row)">复制链接</el-button>-->
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
      // 数据源
      tableData: [
      //   {
      //   couponDesc: '',
      //   couponId: 0,
      //   couponMoney: 0,
      //   couponName: '',
      //   couponType: 0,
      //   receiveNum: 0,
      //   sendNum: 0,
      //   spendMoney: 0,
      //   status: 0,
      //   useLimit: 0,
      //   validBeginTime: '',
      //   validEndTime: ''
      // }
      ],
      // 搜索条件
      couponStatus: 3,
      dateRange: '',
      nameOrPhone: '',
      // 搜索开始时间，结束时间
      searchObj: {
        type: 3,
        searchStartDate: '',
        searchEndDate: '',
        queries: '',
        pageNum: 1,
        pageSize: 20
      },
      options: [{
        value: 0,
        label: '领取中'
      }, {
        value: 1,
        label: '已领完'
      }, {
        value: 2,
        label: '已结束'
      }, {
        value: 3,
        label: '全部'
      }],
      couponScope: '',
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
    // 添加优惠券
    addCoupon() {
      this.$router.push({ name: 'addCoupon' })
    },
    getMessage() {
      const self = this;
      self.$api.post('coupon/list', { pageNum: 1, pageSize: 20 }, false, r => {
        if (r.status !== 0) {
          self.$alert(r.msg, '错误提示', null)
          return
        }
        self.tableData = r.data.list
        this.scopeMessage(self.tableData)
        self.pageData.total = r.data.total
        console.log(self.tableData)
        console.log(r.data.total)
      })
    },
    scopeMessage(tableData) {
      tableData.forEach(row => {
        const type = row.couponType
        const limit = row.useLimit
        if (limit === 0) {
          row.couponScope = type === 0 ? '所有课程无门槛使用' : '所有课程满' + row.spendMoney / 100 + '使用'
        } else {
          row.couponScope = type === 0 ? '指定课程无门槛使用' : '指定课程满' + row.spendMoney / 100 + '使用'
        }
      })
    },
    // 页码发生变化时触发
    onCurrentChange: function(pageIndex) {
      console.log('接收的数据--------->' + pageIndex)
      this.searchData.pageNum = pageIndex
      this.initList()
    },
    // 复制链接
    copyUrl(index, row) {
      // var url = row.liveUrl
      alert('已复制好，可贴粘。')
    },
    // 编辑
    editMessage(index, row) {
      console.log(row)
      this.$router.push({ name: 'addCoupon', params: { dataObj: row }})
    },
    handleDelete(index, row) {
      console.log(row.couponId)
      this.$api.post('coupon/delete', { couponId: row.couponId }, false, r => {
        console.log(JSON.stringify(r))
        if (r.status !== 0) {
          this.$alert(r.msg, '错误提示', null)
          return
        }
        this.getMessage()
      })
    },
    // 搜索
    searchMessage(couponStatus, dateRange, nameOrPhone) {
      this.searchObj.type = couponStatus
      this.searchObj.searchStartDate = dateRange[0]
      this.searchObj.searchEndDate = dateRange[1]
      this.searchObj.queries = nameOrPhone
      console.log(this.searchStartDate)
      this.$api.post('coupon/search', this.searchObj, true, r => {
        if (r.status !== 0) {
          this.$alert(r.msg, '错误提示', null)
          return
        }
        this.tableData = r.data.list
        console.log(this.tableData)
        this.pageData.total = r.data.total
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
