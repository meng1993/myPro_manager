<template>
  <div class="course_container" style="padding: 0 15px;">
    <!--头部功能栏-->
    <el-row class="margin_top_bottom_15" :gutter="20">
      <el-col :span="2">
        <router-link to="./accountManageAdd">
          <el-button><i class="el-icon-plus"></i> 新增管理账号</el-button>
        </router-link>
      </el-col>
      <el-col :span="3" :offset="8">
        <el-select v-model="value" placeholder="全部" @change="promoteTypeBtn">
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
      <el-table-column align="left" header-align="center" label="用户名" width="500" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-col :span="5"><img :src="scope.row.headImg" width="100" height="100"/></el-col>
            <el-col :span="5" :offset="1">{{scope.row.realName}}</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码" width="150">
        <template slot-scope="scope">{{scope.row.moblie}}</template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="150">
        <template slot-scope="scope">{{scope.row.userName}}</template>
      </el-table-column>
      <el-table-column align="center" label="用户状态" width="250">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userStatus === 0">已启用</el-tag>
          <el-tag type="info" v-else>已禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button @click="editSettingBtn(scope.row.userId)">编辑</el-button>
          <el-button @click="userCloseBtn(scope.row.userId, 1)" v-if="scope.row.userStatus === 0">禁用</el-button>
          <el-button @click="userCloseBtn(scope.row.userId, 0)" v-else>启用</el-button>
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

  export default {
    data() {
      return {
        // 类型选项框
        options: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '启用'
        }, {
          value: '2',
          label: '禁用'
        }],
        value: '0',
        // 表格数据
        tableData: [{
          // userId: '',
          // userName: '',
          // realName: '',
          // headImg: '',
          // moblie: '',
          // userStatus: ''
        }],
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
    methods: {
      // 初始化列表数据
      initList: function() {
        const params = this.searchData
        this.$api.post('/accountManage/list', params, false, r => {
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
      // 上架类型选择框
      promoteTypeBtn: function(val) {
        this.searchData.userStatus = val
      },
      // 搜索按钮
      videoCourseSearchBtn: function() {
        this.initList()
      },
      // 编辑
      editSettingBtn(userId) {
        const self = this
        const params = { 'id': userId }
        self.$router.push({ name: 'accountManageAdd', query: params })
      },
      // 设置是否启用
      userCloseBtn(userId, status) {
        const params = { 'userId': userId, 'userStatus': status }
        this.$api.post('/accountManage/updateStatue', params, false, r => {
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
      // 删除用户
      deleteUserBtn(userId) {
        const params = { 'userId': userId }
        this.$api.post('/accountManage/deleteUser', params, false, r => {
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
