<template>
  <div class="course_container" style="padding: 0 15px;">
    <!--头部功能栏-->
    <el-row class="margin_top_bottom_15" :gutter="20">
      <el-col :span="2">
        <router-link to="./distributPromoteEdit">
          <el-button><i class="el-icon-plus"></i> 设置分销</el-button>
        </router-link>
      </el-col>
      <el-col :span="2">
        <router-link to="./distributRecord">
          <el-button @click=""><i class="el-icon-tickets"></i> 推广记录</el-button>
        </router-link>
      </el-col>
      <el-col :span="3" :offset="8">
        <el-select v-model="value" placeholder="全部" @change="promoteTypeBtn">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="请输入课程名称关键字" v-model="searchData.name"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="el-icon-search" @click="videoCourseSearchBtn">搜索</el-button>
      </el-col>
    </el-row>

    <!--数据表格-->
    <el-table :data="tableData" tooltip-effect="dark" ref="multipleTable" border style="width: 100%">
      <el-table-column align="left" header-align="center" prop="specialColumn" label="分销课程" width="800" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-col :span="5"><img :src="scope.row.smallCover" :width="100" :height="100"/></el-col>
            <el-col :span="5">
              <el-row :gutter="20">
                {{scope.row.mainTitle}}
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="售价" width="150" prop="classHourColumn">
        <template slot-scope="scope">¥{{scope.row.sellPrice | minuteToCircle}}</template>
      </el-table-column>
      <el-table-column align="center" label="佣金比例" width="150" prop="priceColumn">
        <template slot-scope="scope">
          <el-row><el-tag type="danger" size="mini">1级</el-tag>  {{scope.row.stairDistRate | nullToCircle}}%</el-row>
          <el-row><el-tag type="warning" size="mini">2级</el-tag>  {{scope.row.secondDistRate | nullToCircle}}%</el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="佣金" width="250" prop="priceColumn">
        <template slot-scope="scope">
          <el-row><el-tag type="danger" size="mini">1级</el-tag>  ¥{{scope.row.stairDistMoney | minuteToCircle}}</el-row>
          <el-row><el-tag type="warning" size="mini">2级</el-tag>  ¥{{scope.row.secondDistMoney | minuteToCircle}}</el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="推广海报" width="250" prop="priceColumn">
        <template slot-scope="scope">
          <img :src="scope.row.distPosterUrl" :width="100" :height="100"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" prop="optionsColumn">
        <template slot-scope="scope">
          <el-button type="text" @click="editSettingBtn(scope.row.distId)">编辑</el-button>
          <el-button type="text" v-show="false" @click="stopGeneralizeBtn(scope.row.distId)">停止推广</el-button>
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
          distId: '',
          courseId: '',
          mainTitle: '',
          smallCover: '',
          status: '',
          distPosterUrl: '',
          stairDistRate: 0,
          stairDistMoney: 0,
          secondDistRate: 0,
          secondDistMoney: 0,
          sellPrice: ''
        }],
        pageData: {
          total: 0
        },
        // 列表查询参数
        searchData: {
          pageNum: 1,
          pageSize: 10,
          status: 0,
          name: ''
        }
      }
    },
    filters: {
      // 空转0
      nullToCircle(rate) {
        return rate === null || rate === '' ? 0 : rate
      },
      // 格式化金额
      minuteToCircle(money) {
        return money === null || money === '' ? 0.00 : money / 100
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
        this.$api.post('/distribut/qryList', params, false, r => {
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
        this.searchData.status = val
      },
      // 搜索按钮
      videoCourseSearchBtn: function() {
        this.initList()
      },
      // 编辑
      editSettingBtn(distId) {
        const self = this
        const params = { 'id': distId }
        self.$router.push({ name: 'distributPromoteEdit', query: params })
      },
      // 停止推广
      stopGeneralizeBtn() {
        this.$message.info('暂不可用')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .margin_top_bottom_15 {
    margin: 15px 0;
  }
</style>
