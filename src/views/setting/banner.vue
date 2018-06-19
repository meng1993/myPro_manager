<template>
  <div class="banner_container" style="padding: 0 15px;">
    <!-- 轮播图预览 -->
    <el-carousel :interval="4000" type="card" style="margin: 20px 25% auto 20%; height: 350px">
      <el-carousel-item  v-for="(img, index) in tableData" :key="index">
        <img class="carousel_img"  v-bind:src="img.adImgUrl">
      </el-carousel-item>
    </el-carousel>
    <el-row class="margin_top_bottom_15">
      <el-button @click="cleanMessage()">新增轮播图</el-button>
    </el-row>
    <el-dialog style=""
               title="编辑轮播图"
               :visible.sync="dialogVisible"
               width="30%"
               :before-close="handleClose">
      <el-form  ref="formMessage" v-model="formMessage" label-width="120px">
        <el-form-item  label="投放开始时间">
          <el-date-picker
            v-model="formMessage.adStartDate"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item  label="投放结束时间">
          <el-date-picker
            v-model="formMessage.adEndDate"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item   label="点击链接类型">
          <el-radio  v-model="formMessage.isHomeUrl" label="0">外部地址</el-radio>
          <el-radio  v-model="formMessage.isHomeUrl" label="1">内部地址</el-radio>
        </el-form-item>
        <el-form-item  label="图片点击链接">
          <el-input style="width: 100%" v-model="formMessage.adClickUrl">
          </el-input>
        </el-form-item>
        <el-form-item label="轮播图" >
          <el-upload
            v-if="addOrUpdate == 'add'"
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="isUploadSuccess" :src="formMessage.adImgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-upload v-else="addOrUpdate == 'edit'"
                     class="avatar-uploader"
                     :action="uploadUrl"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
           <img v-if="isUploadSuccess" :src="formMessage.adImgUrl" class="avatar"/>
           <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div>
            <svg @click="handleImg(addOrUpdate)" v-show="formMessage.adImgUrl" style="position: absolute;left: 285px;top: -12px;cursor: pointer;z-index: 9999;" viewBox="0 0 1024 1024" width="32" height="32">
              <path
                d="M512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333zM671.061333 662.848c-19.242667 19.221333-50.410667 19.221333-69.632 0l-81.216-81.216-81.216 81.216c-19.242667 19.221333-50.410667 19.221333-69.632 0-19.221333-19.242667-19.221333-50.410667 0-69.632L450.581333 512l-81.237333-81.216c-19.221333-19.242667-19.221333-50.410667 0-69.632 19.242667-19.221333 50.410667-19.221333 69.632 0l81.216 81.216 81.216-81.216c19.242667-19.221333 50.410667-19.242667 69.632 0 19.221333 19.242667 19.221333 50.410667 0 69.632L589.824 512l81.237333 81.216C690.282667 612.458667 690.304 643.626667 671.061333 662.848z"
                p-id="1944" fill="#FF3030"></path>
            </svg>
          </div>
        </el-form-item>
        <el-form-item>
            <el-button @click="dialogVisible = false, form=''">取 消</el-button>
            <el-button  v-if="addOrUpdate == 'add'" type="primary" @click="addBanner(formMessage)">立即创建</el-button>
            <el-button  v-else="addOrUpdate == 'edit'" type="primary" @click="updateBanner(formMessage)">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--表格-->
    <el-table
      class="banner_margin_bottom"
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        prop="adId"
        type="selection"
        width="55" :hidden="true">
      </el-table-column>
      <el-table-column
        label="排序号"
        align="center"
        width="70px"
      >
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="轮播图片"
      >
        <template slot-scope="scope"><img :src="scope.row.adImgUrl" :width="60"/></template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="clickNum"
        label="点击次数"
      >
      </el-table-column>
      <el-table-column
        align="center"
        prop="isHomeUrl"
        label="点击链接类型"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="投放开始时间"
      >
      <template slot-scope="scope">
        <p>{{scope.row.adStartDate | formatDate }}</p>
      </template>
      </el-table-column>
      <el-table-column
        prop="adEndDate"
        align="center"
        label="投放结束时间"
      >
      <template slot-scope="scope">
        <p>{{scope.row.adEndDate | formatDate }}</p>
      </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text"
                     @click="moveTop(scope.$index, scope.row)">上移</el-button>
          <el-button type="text"
                     @click="moveBottom(scope.$index, scope.row)">下移</el-button>
          <el-button type="text"
                     @click="openDialog(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { formatDate } from '../../utils/index'
  export default {
    data() {
      return {
        tableData: [{
          adId: '',
          clickNum: '',
          cateCount: '',
          adStartDate: '',
          adEndDate: '',
          adClickUrl: '',
          sort: '',
          adImgUrl: '',
          isHomeUrl: ''
        }],
        dialogVisible: false,
        isUploadSuccess: false,
        imgUrl: '',
        addOrUpdate: 'edit',
        formMessage: {
          adId: '',
          adStartDate: '',
          adEndDate: '',
          adClickUrl: '',
          adImgUrl: '',
          isHomeUrl: ''
        },
        // 上传路径
        uploadUrl: '',
        isHome: 0
        // rules: {
        //   adStartDate: [
        //     { required: true, message: '请选择投放开始时间', trigger: 'blur' }
        //   ],
        //   adEndDate: [
        //     { required: true, message: '请选择投放结束时间', trigger: 'blur' }
        //   ],
        //   adClickUrl: [
        //     { required: true, message: '请输入点击图片跳转地址', trigger: 'blur' }
        //   ],
        //   adImgUrl: [
        //     { required: true, message: '请上传图片', trigger: 'blur' }
        //   ],
        //   isHomeUrl: [
        //     { required: true, message: '请选择点击链接类型', trigger: 'blur' }
        //   ]
        // }
      }
    },
    mounted() {
      this.uploadUrl = this.WORKPATH + '/common/uploadFile/image'
    },
    created() {
      this.getInitParmas()
      this.getMessage()
    },
    filters: {
      // 格式化时间戳
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    methods: {
      // 初始化数据
      getInitParmas() {
        this.defaultData = JSON.parse(JSON.stringify(this.formMessage))
      },
      // 清空新增时的数据
      cleanMessage() {
        this.formMessage.adId = ''
        this.formMessage.adImgUrl = ''
        this.formMessage.adClickUrl = ''
        this.formMessage.isHomeUrl = ''
        this.formMessage.adEndDate = ''
        this.formMessage.adStartDate = ''
        this.isUploadSuccess = false
        this.dialogVisible = true
        this.addOrUpdate = 'add'
      },
      // 获取表格数据
      getMessage() {
        this.$api.post('ad/list', { pageNum: 1, pageSize: 20 }, false, r => {
          console.log(JSON.stringify(r))
          this.tableData = r.data.list
        })
      },
      handleSelectionChange(selection) {
        this.selectData = selection
        console.log(selection)
      },
      // 单个删除
      handleDelete(index, row) {
        console.log(index)
        console.log(row)
        this.$confirm('是否确定要删除此课程?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$api.post('ad/delete', { adId: row.adId }, false, r => {
            console.log(JSON.stringify(r))
            this.getMessage()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 编辑标签
      openDialog(index, row) {
        this.dialogVisible = true
        this.addOrUpdate = 'edit'
        const rows = JSON.parse(JSON.stringify(row))
        console.log('row', row)
        console.log('this.formMessage', this.formMessage)
        this.formMessage = rows
        if (rows.isHomeUrl === 0) {
          this.formMessage.isHomeUrl = '0'
        }
        if (rows.isHomeUrl === 1) {
          this.formMessage.isHomeUrl = '1'
        }
        this.isUploadSuccess = true
      },
      // 上传图片成功
      handleAvatarSuccess(res, file) {
        const resp = file.response
        console.log(resp)
        if (resp.status !== 0) {
          return this.$message.error('上传文件失败')
        }
        const data = file.response.data
        this.formMessage.adImgUrl = data.url
        console.log(this.formMessage.adImgUrl)
        this.isUploadSuccess = true
      },
      // 上传限制
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
        return isLt5M
      },
      handleClose(done) {
        done()
      },
      // 添加轮播图
      addBanner(addMessage) {
        console.log(addMessage)
        const self = addMessage
        if (self.adStartDate === '') {
          return this.$message.error('请选择开始时间')
        }
        if (self.adEndDate === '') {
          return this.$message.error('请选择结束时间')
        }
        if (self.isHomeUrl === '') {
          return this.$message.error('请选择点击链接类型')
        }
        if (self.adClickUrl === '') {
          return this.$message.error('请填写图片点击链接')
        }
        if (self.adImgUrl === '') {
          return this.$message.error('请上传图片')
        }
        this.$api.post('ad/add', this.formMessage, true, r => {
          console.log(JSON.stringify(r))
          if (r.status !== 0) {
            this.$message.error('服务器错误')
            return
          }
          this.dialogVisible = false
          this.getMessage()
        })
      },
      // 编辑轮播图
      updateBanner(addMessage) {
        console.log(addMessage)
        const self = addMessage
        if (self.adStartDate === '') {
          return this.$message.error('请选择开始时间')
        }
        if (self.adEndDate === '') {
          return this.$message.error('请选择结束时间')
        }
        if (self.isHomeUrl === '') {
          return this.$message.error('请选择点击链接类型')
        }
        if (self.adClickUrl === '') {
          return this.$message.error('请填写图片点击链接')
        }
        if (self.adImgUrl === '') {
          return this.$message.error('请上传图片')
        }
        this.$api.post('ad/update', this.formMessage, true, r => {
          console.log(JSON.stringify(r))
          if (r.status !== 0) {
            this.$message.error('服务器错误')
            return
          }
          this.dialogVisible = false
          this.$message.success('修改成功')
          this.getMessage()
        })
      },
      // 上移
      moveTop(a, b) {
        console.log(a)
        console.log(b)
        this.$api.post('ad/upRemove', { adId: b.adId }, false, r => {
          console.log(JSON.stringify(r))
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            this.$message.error('上移失败')
            return
          }
          this.$message.success('上移成功')
          this.getMessage()
        })
      },
      // 下移
      moveBottom(a, b) {
        this.$api.post('ad/downRemove', { adId: b.adId }, false, r => {
          console.log(JSON.stringify(r))
          if (r.status !== 0) {
            this.$alert(r.msg, '错误提示', null)
            this.$message.error('下移失败')
            return
          }
          this.$message.success('下移成功')
          this.getMessage()
        })
      },
      // 控制图片清除
      handleImg(type) {
        if (type === 'add') {
          this.formMessage.adImgUrl = ''
          this.isUploadSuccess = false
        } else if (type === 'edit') {
          this.formMessage.adImgUrl = ''
          this.isUploadSuccess = false
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  .margin_top_bottom_15{
    margin: 15px 0;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 20px;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  .carousel_img{
    width: 465px;
    height: 300px;
    max-width: 100%;
    max-height: 100%;
  }
  img{
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
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
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 142px;
    line-height: 142px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 178px;
    display: block;
  }
  .banner_margin_bottom {
    margin-bottom: 50px;
    text-align: center;

  }
</style>
