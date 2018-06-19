<template>
  <div class="course_container" style="padding: 0 15px;">
    <el-row class="margin_top_bottom_course" :gutter="20">
      <el-col :span="4" :offset="2">
        <img :src="courseDetail.bigCover" width="200" height="200">
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20"><h3>{{courseDetail.mainTitle}}</h3></el-row>
        <el-row :gutter="20" class="row-bg">{{courseDetail.secondTitle}}</el-row>
        <el-row :gutter="20" class="row-bg">
          <el-col :span="4">已更新：<label>{{courseDetail.hourNum}}</label> 课时</el-col>
          <el-col :span="4">访问量：<label>{{courseDetail.studyNum}}</label></el-col>
          <el-col :span="4">购买量：<label>{{courseDetail.saledNum}}</label></el-col>
        </el-row>
      </el-col>
    </el-row>

    <el-row class="margin_top_bottom_15" :gutter="20">
      <el-col :span="2">
        <router-link :to="{ name: 'addCourseCatelog', query: { id: courseDetail.courseId }}">
          <el-button><i class="el-icon-plus"></i> 新增课时</el-button>
        </router-link>
      </el-col>
      <el-col :span="3" :offset="12">
        <el-select v-model="classTypeValue" placeholder="全部">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="请输入课时名称关键字" v-model="searchData.queries"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="el-icon-search" @click="catelogSearchBtn">搜索</el-button>
      </el-col>
    </el-row>

    <!--数据表格-->
    <el-table :data="catelogListData" tooltip-effect="dark" ref="multipleTable" border style="width: 100%">
      <el-table-column align="left" header-align="center" label="课程目录" show-overflow-tooltip width="600">
        <template slot-scope="scope">
          <el-col :span="1">
            <span v-if="scope.row.cateType === 0"><i class="el-icon-service"></i></span>
            <span v-else><i class="el-icon-caret-right"></i></span>
          </el-col>
          <el-col :span="6">
            <el-row>
              {{scope.row.cateName}}
              <el-tag size="mini" v-show="scope.row.isFree === 1" type="danger">试听</el-tag>
            </el-row>
            <el-row>时长：{{scope.row.duration}}秒 / {{scope.row.playNum}}次学习</el-row>
          </el-col>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="type" label="完播率">
        <template slot-scope="scope">13%</template>
      </el-table-column>
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">{{scope.row.updateTime | formatDate}}</template>
      </el-table-column>
      <el-table-column align="center" label="音频大小">
        <template slot-scope="scope">
          <p>音频大小</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editCatelogBtn(scope.row.cateId)">编辑</el-button>
          <el-button type="text" v-if="scope.row.isFree === 0" @click="settingFreeBtn(scope.row.cateId, 1)">试听</el-button>
          <el-button type="text" v-else  @click="settingFreeBtn(scope.row.cateId, 0)">取消试听</el-button>
          <!--<el-button type="text" @click="">排序</el-button>-->
          <el-button type="text" @click="catelogDeleteBtn(scope.row.cateId)">移出专栏</el-button>
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
        // 课时类型选项框
        options: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '音频课程'
        }, {
          value: '2',
          label: '视频课程'
        }],
        classTypeValue: '',
        // 课程详情
        courseDetail: {
          courseId: '',
          bigCover: '',
          secondTitle: '',
          mainTitle: '',
          isSale: '',
          hourNum: '',
          saledNum: '',
          studyNum: ''
        },
        // 课时列表数据
        catelogListData: [
        //   {
        //   cateId: '',
        //   cateName: '',
        //   cateType: '',
        //   duration: '',
        //   isFree: '',
        //   playNum: '',
        //   updateTime: ''
        // }
        ],
        // 列表查询参数
        searchData: {
          courseId: '',
          pageNum: 1,
          pageSize: 10,
          classType: 0,
          queries: ''
        },
        pageData: {
          total: 0
        }
      }
    },
    components: {
      'page-info': pageInfo
    },
    mounted() {
      const self = this
      self.getCourseIdByInit()
      if (self.searchData.courseId !== '') {
        self.initLoadingDetail()
        self.initLoadingList()
      }
    },
    filters: {
      // 格式化时间戳
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    methods: {
      // 初始化获取课程Id
      getCourseIdByInit() {
        const self = this
        const courseId = self.$route.query.id
        if (courseId !== undefined) {
          self.searchData.courseId = courseId
        }
      },
      // 初始化详情数据
      initLoadingDetail() {
        const self = this
        const params = { 'courseId': self.searchData.courseId }
        self.$api.post('/course/getCourseDetail', params, false, r => {
          if (r.status !== 0) {
            return self.$message.success('详情查询失败')
          }
          const result = r.data
          result.sellPrice = result.sellPrice / 100
          // console.log('data', datas)
          self.courseDetail = result
        })
      },
      // 初始化列表数据
      initLoadingList() {
        const params = this.searchData
        this.$api.post('/course/getCourseCateLogListBySearch', params, false, r => {
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            return
          }
          const data = r.data
          this.catelogListData = data.list
          this.pageData.total = data.total
        })
      },
      // 页码发生变化时触发
      onCurrentChange(pageIndex) {
        // console.log('接收的数据--------->' + pageIndex)
        this.searchData.pageNum = pageIndex
        this.initLoadingList()
      },
      // 搜索按钮
      catelogSearchBtn: function() {
        this.initLoadingList()
      },
      // 编辑按钮
      editCatelogBtn(cateId) {
        const self = this
        const params = { 'did': cateId, 'id': self.searchData.courseId }
        self.$router.push({ name: 'addCourseCatelog', query: params })
      },
      // 设置是否试听
      settingFreeBtn(cateId, isFree) {
        const params = { 'cateId': cateId, 'isFree': isFree }
        this.$api.post('/course/saveIsFreeAudition', params, false, r => {
          let msg
          if (r.status !== 0) {
            msg = isFree === 1 ? '设置试听失败' : '取消试听失败'
            return this.$message.error(msg)
          } else {
            msg = isFree === 1 ? '设置试听成功' : '取消试听成功'
            this.initLoadingList()
            return this.$message.success(msg)
          }
        })
      },
      // 移出专栏按钮
      catelogDeleteBtn(cateId) {
        const params = { 'cateId': cateId }
        this.$api.post('/course/saveCatelogDeleted', params, false, r => {
          if (r.status !== 0) {
            return this.$message.error('移出专栏失败')
          } else {
            this.initLoadingList()
            return this.$message.success('移出专栏成功')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .margin_top_bottom_30 {
    margin: 30px 0;
  }
  .margin_top_bottom_15 {
    margin: 15px 0;
  }
  .row-bg {
    padding: 10px 0;
  }
  .margin_top_bottom_course {
    margin-top: 15px;
    border-style: dashed;
    border-width: 1px;
    border-color: #b8c1c5;
  }
</style>
