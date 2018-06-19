<template>
  <div class="course_container" style="padding: 0 15px;">
    <!--头部功能栏-->
    <el-row class="margin_top_bottom_15" :gutter="20">
      <el-col :span="2">
        <router-link to="./addVideoCourse">
          <el-button><i class="el-icon-plus"></i> 新增专栏</el-button>
        </router-link>
      </el-col>
      <el-col :span="2">
        <router-link to="./cateTag">
          <el-button @click=""><i class="el-icon-tickets"></i> 课时标签</el-button>
        </router-link>
      </el-col>
      <el-col :span="3" :offset="8">
        <el-select v-model="value" placeholder="全部" @change="saleTypeBtn">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="请输入课程名称关键字" v-model="searchData.queries"></el-input>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="el-icon-search" @click="videoCourseSearchBtn">搜索</el-button>
      </el-col>
    </el-row>

    <!--数据表格-->
    <el-table :data="tableData" tooltip-effect="dark" ref="multipleTable" border style="width: 100%" @cell-click="goToCourseCatelogpage">
      <el-table-column align="left" header-align="center" prop="specialColumn" label="专栏名称" width="700" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-row :gutter="10">
            <el-col :span="5"><img :src="scope.row.smallCover" :width="100" :height="100"/></el-col>
            <el-col :span="5">
              <el-row :gutter="20">
                {{scope.row.mainTitle}}
              </el-row>
              <el-row :gutter="20">
                <el-tag type="danger" size="mini" v-if="scope.row.courseType === 1">限免公开</el-tag>
                <el-tag type="danger" size="mini"  v-else-if="scope.row.courseType === 2">专项能力</el-tag>
                <el-tag type="danger" size="mini"  v-else>系列进阶</el-tag>
                <el-tag size="mini" v-show="scope.row.isIndexRecommend === 1" type="danger">荐</el-tag>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新课时" width="150" prop="classHourColumn">
        <template slot-scope="scope">{{scope.row.hourNum}}</template>
      </el-table-column>
      <el-table-column align="center" label="价格" width="150" prop="priceColumn">
        <template slot-scope="scope"><p style="color: red">¥{{scope.row.sellPrice/100}}</p></template>
      </el-table-column>
      <el-table-column align="center" label="统计" width="250" prop="priceColumn">
        <template slot-scope="scope">
          <p>访问量：{{scope.row.studyNum}}</p>
          <p>分享量：{{scope.row.shareNum}}</p>
          <p>购买量：{{scope.row.saledNum}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="180" prop="statusColumn">
        <template slot-scope="scope">
          <el-button type="success" v-if="(scope.row.isSale) === 1">已上架</el-button>
          <el-button type="info" v-if="(scope.row.isSale) === 0">已下架</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" prop="optionsColumn">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.isIndexRecommend === 0" @click="indexRecommendBtn(scope.row.courseId,1)">首页推荐</el-button>
          <el-button type="text" v-else  @click="indexRecommendBtn(scope.row.courseId,0)">取消推荐</el-button>
          <el-button type="text" v-if="scope.row.isSale === 0" @click="settingSaleBtn(scope.row.courseId, 1)">上架</el-button>
          <el-button type="text" v-else  @click="settingSaleBtn(scope.row.courseId, 0)">下架</el-button>
          <!--<el-button type="text" @click="">调整排序</el-button>-->
          <el-button type="text" @click="videoCourseDelete(scope.row.courseId)">删除</el-button>
          <el-button type="text" @click="editVideoBtn(scope.row.courseId)">编辑</el-button>
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
        // 直播类型选项框
        options: [{
          value: '0',
          label: '全部'
        }, {
          value: '1',
          label: '已上架'
        }, {
          value: '2',
          label: '已下架'
        }],
        value: '0',
        // 表格数据
        tableData: [],
        pageData: {
          total: 0
        },
        // 列表查询参数
        searchData: {
          pageNum: 1,
          pageSize: 10,
          saleType: 0,
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
        this.$api.post('/course/getCourseListBySearch', params, false, r => {
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            return
          }
          const data = r.data
          this.tableData = data.list
          this.pageData.total = data.total
        })
      },
      // 设置是否首页推荐
      indexRecommendBtn: function(courseId, isIndex) {
        const params = { 'courseId': courseId, 'isIndex': isIndex }
        this.$api.post('/course/saveCourseIsIndex', params, false, r => {
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            return
          }
          // 成功
          const message = isIndex === 1 ? '设置首页推荐成功' : '取消首页推荐成功'
          this.$message({ 'message': message, 'type': 'success', 'center': true })
          this.initList()
        })
      },
      // 设置是否上架
      settingSaleBtn: function(courseId, saleType) {
        const params = { 'courseId': courseId, 'isSale': saleType }
        this.$api.post('/course/saveCourseIsSale', params, false, r => {
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            return
          }
          // 成功
          const message = saleType === 1 ? '设置上架成功' : '设置下架成功'
          this.$message({ 'message': message, 'type': 'success', 'center': true })
          this.initList()
        })
      },
      // 页码发生变化时触发
      onCurrentChange: function(pageIndex) {
        // console.log('接收的数据--------->' + pageIndex)
        this.searchData.pageNum = pageIndex
        this.initList()
      },
      // 上架类型选择框
      saleTypeBtn: function(val) {
        this.searchData.saleType = val
      },
      // 搜索按钮
      videoCourseSearchBtn: function() {
        this.initList()
      },
      // 删除
      videoCourseDelete: function(courseId) {
        const params = { 'courseIds': courseId }
        this.$api.post('/course/deleteCourse', params, false, r => {
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            return
          }
          // 成功
          this.$message({ 'message': '删除成功！', 'type': 'success', 'center': true })
          this.initList()
        })
      },
      // 进入编辑页面
      editVideoBtn(courseId) {
        // console.log(courseId)
        this.$router.push({ name: 'addVideoCourse', query: { id: courseId }})
      },
      // 进入专栏详情页面
      goToCourseCatelogpage(row, column, cell, event) {
        if (column.property === 'specialColumn') {
          this.$router.push({ name: 'courseCatelog', query: { id: row.courseId }})
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .margin_top_bottom_15 {
    margin: 15px 0;
  }
</style>
