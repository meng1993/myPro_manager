<template>
  <div class="addVideo_container" style="padding: 0 15px;">
    <el-form :model="distributForm" :rules="distributRules" ref="distributForm" label-width="80px" >
      <el-form-item label="选择课程">
        <el-button type="primary" plain v-show="isAdd" @click="showChooseTagBtn"><i class="el-icon-plus"></i> 选择课程</el-button>
        <el-row :gutter="16">
          <el-dialog title="选择课程" :visible.sync="dialogTableVisible" :center="true" top="8vh">
            <el-table :data="initCourseData" ref="multipleTagData" border tooltip-effect="dark" :highlight-current-row="true" @row-dblclick="dbClickCourseBtn">
              <el-table-column label="课程名称" width="800">
                <template slot-scope="scope">
                  <el-row :gutter="12">
                    <el-col :span="4"><img :src="scope.row.smallCover" :width="80" :height="80"/></el-col>
                    <el-col :span="4">{{scope.row.mainTitle}}</el-col>
                  </el-row>
                </template>
              </el-table-column>
              <el-table-column label="售价">
                <template slot-scope="scope">{{scope.row.sellPrice | sellPriceTransition}}</template>
              </el-table-column>
            </el-table>
            <page-info :pageData="pageData" @currentChange="onCurrentChange"></page-info>
          </el-dialog>
        </el-row>

        <el-row class="row-bg-course" :gutter="16" v-show="distributForm.course.courseId">
          <el-col :span="4"><img :src="distributForm.course.smallCover" :width="100" :height="100"/></el-col>
          <el-col :span="20">
              <el-row>{{distributForm.course.mainTitle}}</el-row>
            <el-row>{{distributForm.course.secondTitle}}</el-row>
            <el-row>{{distributForm.course.sellPrice}}元</el-row>
          </el-col>
        </el-row>

      </el-form-item>
      <el-form-item label="佣金比例">
        <el-row :gutter="12">
          <el-col :span="4">
            <el-input placeholder="请输入比例" v-model="distributForm.stairDistRate">
              <template slot="prepend">一级分成</template>
              <template slot="append">%</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="请输入比例" v-model="distributForm.secondDistRate">
              <template slot="prepend">二级分成</template>
              <template slot="append">%</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="海报设置" prop="distPosterUrl">
        <el-upload class="avatar-uploader" :action="uploadUrl" :limit="1" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="distributForm.distPosterUrl" :src="distributForm.distPosterUrl" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon-big"></i>
        </el-upload>
      </el-form-item>
      <el-button class="submitCla" type="primary" @click="submitBtn()">保存</el-button>
    </el-form>
  </div>
</template>

<script>
  import pageInfo from '../../components/courseManage/page'

  export default {
    data() {
      return {
        isAdd: true, // 是否新增，默认是
        uploadUrl: '', // 拼接路径
        // 分销详情
        distributForm: {
          distId: '',
          courseId: '',
          distPosterUrl: '',
          stairDistRate: '',
          secondDistRate: '',
          course: {
            courseId: '',
            mainTitle: '',
            secondTitle: '',
            sellPrice: '',
            smallCover: ''
          }
        },
        // 选择课程页面
        initCourseData: [{
          courseId: '',
          mainTitle: '',
          secondTitle: '',
          smallCover: '',
          sellPrice: ''
        }],
        // 分页参数
        pageData: {
          total: 0
        },
        // 分页查询桉树
        searchData: {
          pageNum: 1,
          pageSize: 5
        },
        // 校验规则
        distributRules: {
          distPosterUrl: [{ required: true, message: '请上传海报图片', trigger: 'blur' }]
        },
        // dialog弹窗是否显示
        dialogTableVisible: false
      }
    },
    filters: {
      sellPriceTransition(money) {
        return money / 100
      }
    },
    components: {
      'page-info': pageInfo
    },
    mounted() {
      const self = this
      self.uploadUrl = self.WORKPATH + '/common/uploadFile/image'
    },
    created() {
      const self = this
      self.getRouterDetail()
      if (self.distributForm.distId !== '') {
        self.isAdd = false
        self.initLoadingData()
      }
    },
    methods: {
      // 通过路由获取上个页面传递过来的courseId
      getRouterDetail() {
        const self = this
        const params = self.$route.query
        const id = params['id']
        if (id !== undefined) {
          self.distributForm.distId = id
        }
      },
      // 初始化加载数据
      initLoadingData() {
        const self = this
        const params = { 'id': self.distributForm.distId }
        self.$api.post('/distribut/getDetail', params, false, r => {
          if (r.status !== 0) {
            return self.$message.error('详情查询失败')
          }
          self.distributForm = r.data
        })
      },
      // 上传限制
      beforeAvatarUpload(file) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
        return isLt5M
      },
      // 图片上传成功
      handleAvatarSuccess(res, file) {
        const resp = file.response
        if (resp.status !== 0) {
          return this.$message.error('上传文件失败')
        }
        const data = file.response.data
        this.distributForm.distPosterUrl = data.url
      },
      // 显示弹窗，初始化分页数据
      showChooseTagBtn() {
        this.getCourseListData()
        this.dialogTableVisible = true
      },
      getCourseListData() {
        const self = this
        const params = self.searchData
        self.$api.post('/course/getCourseList', params, false, r => {
          if (r.status !== 0) {
            return self.$message.error('详情查询失败')
          }
          const datas = r.data
          self.initCourseData = datas.list
          this.pageData.total = datas.total
        })
      },
      // 页码发生变化时触发
      onCurrentChange: function(pageIndex) {
        this.searchData.pageNum = pageIndex
        this.getCourseListData()
      },
      // 双击选择数据
      dbClickCourseBtn(row, event) {
        const self = this
        const course = self.distributForm.course
        course.courseId = row.courseId
        course.mainTitle = row.mainTitle
        course.secondTitle = row.secondTitle
        course.smallCover = row.smallCover
        course.sellPrice = row.sellPrice / 100
        this.dialogTableVisible = false
      },
      // 保存文件
      submitBtn() {
        const self = this
        // 新增
        if (self.isAdd) {
          const params = {
            'courseId': self.distributForm.course.courseId,
            'distPosterUrl': self.distributForm.distPosterUrl,
            'stairDistRate': self.distributForm.stairDistRate,
            'secondDistRate': self.distributForm.secondDistRate
          }
          if (params.courseId.length === 0) {
            return self.$message.error('请选择需要设置的课程')
          }
          if (params.stairDistRate.length === 0) {
            return self.$message.error('请输入一级佣金比例')
          }
          this.$refs.distributForm.validate(valid => {
            if (valid) {
              self.$api.post('/distribut/save', params, false, r => {
                if (r.status === 0) {
                  this.$router.go(-1)
                  return self.$message.success('保存成功')
                } else {
                  return self.$message.error('保存失败')
                }
              })
            }
          })
        } else {
          // 修改
          const params = {
            'distId': self.distributForm.distId,
            'courseId': self.distributForm.course.courseId,
            'distPosterUrl': self.distributForm.distPosterUrl,
            'stairDistRate': self.distributForm.stairDistRate,
            'secondDistRate': self.distributForm.secondDistRate
          }
          if (params.distId.length === 0) {
            return self.$message.error('非法参数')
          }
          if (params.courseId.length === 0) {
            return self.$message.error('非法参数')
          }
          if (params.stairDistRate.length === 0) {
            return self.$message.error('请输入一级佣金比例')
          }
          this.$refs.distributForm.validate(valid => {
            if (valid) {
              self.$api.post('/distribut/edit', params, false, r => {
                if (r.status === 0) {
                  this.$router.go(-1)
                  return self.$message.success('保存成功')
                } else {
                  return self.$message.error(r.msg)
                }
              })
            }
          })
        }
      }
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .addVideo_container {
    margin: 15px 0;
  }
  .avatar-uploader-icon-big {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .addVideo_container {
    margin: 15px 0;
  }

  .edit_container {
    max-width: 1200px;
    width: auto;
    height: 500px;
  }
  .upload-demo {
    width: 360px;
  }

  .el-dialog--center .el-dialog__body {
    padding-top: 0px;
  }

  .row-bg-course {
    margin-top: 15px;
    padding-top: 15px;
    border-style: dashed;
    border-width: 1px;
    border-color: #b8c1c5;
    width: 800px;
    line-height: 1.5;
  }

</style>
