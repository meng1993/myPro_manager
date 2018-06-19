<template>
  <div class="course_container" style="padding: 0 15px;">
    <!--头部功能栏-->
    <el-row class="margin_top_bottom_15" :gutter="20">
      <el-col :span="3" :offset="8">
        <el-select v-model="value" placeholder="全部" @change="saleTypeBtn">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="请输入用户名/手机号码关键字" v-model="searchData.queries"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="el-icon-search" @click="videoCourseSearchBtn">搜索</el-button>
      </el-col>
    </el-row>

    <!--数据表格-->
    <el-table :data="tableData" tooltip-effect="dark" ref="multipleTable" border style="width: 100%">
      <el-table-column align="left" header-align="center" label="用户昵称" width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-row :gutter="20">
            <el-col :span="8"><img :src="scope.row.avatarUrl" :width="80" :height="80"/></el-col>
            <el-col :span="12">
              <el-row :gutter="20">
                {{scope.row.nickName}}
              </el-row>
              <el-row :gutter="20">
                <el-tag size="mini" v-show="scope.row.isVip === 1" type="danger">VIP</el-tag>
                <el-tag type="warning" size="mini" v-if="scope.row.registerFrom === 1">自主注册</el-tag>
                <el-tag type="warning" size="mini"  v-else>邀请注册</el-tag>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="150">
        <template slot-scope="scope">{{scope.row.username}}</template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === 1">男</span>
          <span v-else-if="scope.row.sex === 2">女</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="微信号" width="150">
        <template slot-scope="scope">
          {{scope.row.wechatId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码" width="150">
        <template slot-scope="scope">
          {{scope.row.mobile}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          {{scope.row.registerTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后登录时间">
        <template slot-scope="scope">
          {{scope.row.lastLoginTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userStatus === 1" @click="isUseBtn(scope.row.userId,0)">启用</el-button>
          <el-button v-else  @click="isUseBtn(scope.row.userId,1)">禁用</el-button>
          <el-button @click="deleteUserBtn(scope.row.userId)">删除</el-button>
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
          label: '已启用'
        }, {
          value: '2',
          label: '已禁用'
        }],
        value: '0',
        // 表格数据
        tableData: [
          // {
          //   userId: '',
          //   username: '', // 用户名
          //   nickName: '', // 用户昵称
          //   avatarUrl: '', // 用户头像
          //   sex: '', // 性别 0=未知，1=男，2=女
          //   wechatId: '', // 微信号
          //   mobile: '', // 手机号码
          //   company: '', // 公司名称
          //   department: '', // 部门
          //   country: '', // 国家
          //   province: '', // 省份
          //   city: '', // 城市
          //   position: '', // 职位
          //   isVip: '', // 是否为vip 0:非VIP;1:VIP
          //   registerFrom: '', // 用户注册来源 1=自主注册；2=邀请注册
          //   userStatus: '', // 用户状态0:正常；1为已封禁
          //   registerTime: '' // 注册时间
          //   lastLoginTime: '' // 最后登录时间
          // }
        ],
        pageData: {
          total: 0
        },
        // 列表查询参数
        searchData: {
          pageNum: 1,
          pageSize: 10,
          userStatus: 0,
          queries: ''
        }
      }
    },
    components: {
      'page-info': pageInfo
    },
    created() {
      this.initList()
    },
    filters: {
      // 格式化时间戳
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    methods: {
      // 初始化列表数据
      initList: function() {
        const params = this.searchData
        this.$api.post('/userManage/list', params, false, r => {
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            return
          }
          const data = r.data
          this.tableData = data.list
          this.pageData.total = data.total
        })
      },
      // 设置用户账号是否可以使用
      isUseBtn: function(userId, status) {
        const params = { 'userId': userId, 'userStatus': status }
        this.$api.post('/userManage/updateStatus', params, false, r => {
          let msg
          if (r.status !== 0) {
            msg = status === 1 ? '禁用用户失败' : '启用用户失败'
            return this.$message.error(msg)
          } else {
            msg = status === 1 ? '禁用用户成功' : '启用用户成功'
            this.initList()
            return this.$message.success(msg)
          }
        })
      },
      // 页码发生变化时触发
      onCurrentChange: function(pageIndex) {
        // console.log('接收的数据--------->' + pageIndex)
        this.searchData.pageNum = pageIndex
        this.initList()
      },
      // 类型选择框
      saleTypeBtn: function(val) {
        this.searchData.userStatus = val
      },
      // 搜索按钮
      videoCourseSearchBtn: function() {
        this.initList()
      },
      // 删除
      deleteUserBtn: function(userId) {
        const params = { 'userId': userId }
        this.$api.post('/userManage/deleteUser', params, false, r => {
          if (r.status !== 0) {
            return this.$message.error('删除用户失败')
          } else {
            this.initList()
            return this.$message.success('删除用户成功')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .margin_top_bottom_15 {
    margin: 15px 0;
  }
</style>
