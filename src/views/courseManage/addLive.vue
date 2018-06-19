<template>
  <div class="addLive_container" style="padding: 0 15px;">
    <el-form :rules="rules" ref="form" :model="form" label-width="80px" >
      <el-form-item prop="mainTitle" label="课程标题">
        <el-input style="width: 60%" v-model="form.mainTitle" placeholder="请输入课程名称"></el-input>
      </el-form-item>
      <el-form-item prop="secondTitle" label="课程简介">
        <el-input type="textarea"
                  :rows="3"
                  style="width: 60%"
                  placeholder="请输入课程简介(最多输入200个字)"
                  v-model="form.secondTitle"></el-input>
      </el-form-item>
      <el-form-item prop="liveType" label="直播形式">
        <el-radio  v-model="form.liveType" label="1">语音直播</el-radio>
        <el-radio  v-model="form.liveType" label="2">视频直播</el-radio>
      </el-form-item>
      <el-form-item prop="liveStartTime" label="开播时间">
        <el-date-picker
          v-model="form.liveStartTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="sellPrice" label="课程售价">
          <el-input style="width: 13%" v-model="form.sellPrice">
            <template slot="append">元</template>
          </el-input>
      </el-form-item>
      <el-form-item prop="isSale" label="是否上架">
        <el-switch v-model="form.isSale"></el-switch>
      </el-form-item>
      <el-form-item label="课程封面">
        <el-row :gutter="1">
          <el-col :span="6">
            <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :limit="1"
            :show-file-list="false"
            :on-success="handleAvatarSuccessBig"
            :before-upload="beforeAvatarUpload">
            <img style=" width: 347px; height: 142px" v-if="isUploadSuccessBig" :src="form.bigCover" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon-big"></i>
            </el-upload>
            <div>
              <svg @click="handleImg('big')" v-show="form.bigCover" style="position: absolute;left: 329px;top: -12px;cursor: pointer;z-index: 9999;" viewBox="0 0 1024 1024" width="32" height="32">
                <path
                  d="M512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333zM671.061333 662.848c-19.242667 19.221333-50.410667 19.221333-69.632 0l-81.216-81.216-81.216 81.216c-19.242667 19.221333-50.410667 19.221333-69.632 0-19.221333-19.242667-19.221333-50.410667 0-69.632L450.581333 512l-81.237333-81.216c-19.221333-19.242667-19.221333-50.410667 0-69.632 19.242667-19.221333 50.410667-19.221333 69.632 0l81.216 81.216 81.216-81.216c19.242667-19.221333 50.410667-19.242667 69.632 0 19.221333 19.242667 19.221333 50.410667 0 69.632L589.824 512l81.237333 81.216C690.282667 612.458667 690.304 643.626667 671.061333 662.848z"
                  p-id="1944" fill="#FF3030"></path>
              </svg>
            </div>
          </el-col>
          <el-col :span="4">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :limit="1"
              :show-file-list="false"
              :on-success="handleAvatarSuccessSmall"
              :before-upload="beforeAvatarUpload">
              <img  style=" width: 82px; height: 107px" v-if="isUploadSuccessSmall" :src="form.smallCover" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
            </el-upload>
            <div>
              <svg @click="handleImg('small')" v-show="form.smallCover" style="position: absolute;left: 468px;top: -12px;cursor: pointer;z-index: 9999;" viewBox="0 0 1024 1024" width="32" height="32">
                <path
                  d="M512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333zM671.061333 662.848c-19.242667 19.221333-50.410667 19.221333-69.632 0l-81.216-81.216-81.216 81.216c-19.242667 19.221333-50.410667 19.221333-69.632 0-19.221333-19.242667-19.221333-50.410667 0-69.632L450.581333 512l-81.237333-81.216c-19.221333-19.242667-19.221333-50.410667 0-69.632 19.242667-19.221333 50.410667-19.221333 69.632 0l81.216 81.216 81.216-81.216c19.242667-19.221333 50.410667-19.242667 69.632 0 19.221333 19.242667 19.221333 50.410667 0 69.632L589.824 512l81.237333 81.216C690.282667 612.458667 690.304 643.626667 671.061333 662.848z"
                  p-id="1944" fill="#FF3030"></path>
              </svg>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item v-if="form.liveType == 1" label="直播课件">
        <el-upload
          class="upload-demo"
          :action="uploadFileUrl"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="handleUploadSuccess"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <!-- 使用编辑器 -->
      <el-form-item prop="courseDesc" label="专栏详情">
        <div class="edit_container">
          <quill-editor v-model="form.courseDesc" ref="myQuillEditor" class="editer" :options="editorOption" @ready="onEditorReady($event)">
          </quill-editor>
        </div>
      </el-form-item>
      <el-button type="primary" @click="onSubmit(form)">立即创建</el-button>

    </el-form>
  </div>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  // 调用编辑器
  import { quillEditor } from 'vue-quill-editor'
  export default {
    data() {
      return {
        form: {
          courseId: '',
          mainTitle: '',
          secondTitle: '',
          liveType: '',
          sellPrice: '',
          smallCover: '',
          bigCover: '',
          liveStartTime: '',
          isSale: '',
          courseDesc: '',
          fileUrl: ''
        },
        rules: {
          mainTitle: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          secondTitle: [
            { required: true, message: '请输入课题副标题', trigger: 'blur' }
          ],
          liveType: [
            { required: true, message: '请选择直播类型', trigger: 'blur' }
          ],
          sellPrice: [
            { required: true, message: '请输入售价', trigger: 'blur' }
          ],
          smallCover: [
            { required: true, message: '请上传小封面', trigger: 'blur' }
          ],
          bigCover: [
            { required: true, message: '请上传大封面', trigger: 'blur' }
          ],
          liveStartTime: [
            { required: true, message: '请选择直播时间', trigger: 'blur' }
          ],
          isSale: [
            { required: true, message: '请选择是否上架', trigger: 'blur' }
          ],
          courseDesc: [
            { required: true, message: '请输入课程描述', trigger: 'blur' }
          ]
        },
        imageUrl: '',
        fileList: [],
        isUploadSuccessSmall: false,
        isUploadSuccessBig: false,
        // 编辑内容
        editorOption: {
        },
        uploadUrl: '',
        uploadFileUrl: ''
      }
    },
    created() {
      this.getParams()
    },
    mounted() {
      this.uploadUrl = this.WORKPATH + '/common/uploadFile/image'
      this.uploadFileUrl = this.WORKPATH + '/common/uploadFile/ppt'
    },
    // 如果你需要得到当前的editor对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的editor对象，实际上这里的$refs对应的是当前组件内所有关联了ref属性的组件元素对象
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
      onEditorReady(editor) {
        console.log(editor)
      },
      // 上传小封面成功
      handleAvatarSuccessSmall(res, file) {
        const resp = file.response
        if (resp.status !== 0) {
          return this.$message.error('上传文件失败')
        }
        const data = file.response.data
        this.form.smallCover = data.url
        this.isUploadSuccessSmall = true
      },
      // 上传大封面成功
      handleAvatarSuccessBig(res, file) {
        const resp = file.response
        if (resp.status !== 0) {
          return this.$message.error('上传文件失败')
        }
        const data = file.response.data
        this.form.bigCover = data.url
        this.isUploadSuccessBig = true
      },
      // 上传文件成功
      handleUploadSuccess(res, file) {
        const resp = file.response
        if (resp.status !== 0) {
          return this.$message.error('上传文件失败')
        }
        console.log(file.response.data)
        const data = file.response.data
        this.form.fileUrl = data.url
        this.fileList.push({ name: this.getFileName(this.form.fileUrl), url: this.form.fileUrl })
        console.log(this.form.fileUrl)
      },
      // ↑↑↑↑↑上传PPT文件↑↑↑↑↑
      // 获取文件名
      getFileName(path) {
        const index = path.indexOf('?')
        path = index > -1 ? path.substring(0, path.indexOf('?')) : path
        return path.substring(path.lastIndexOf('/') + 1)
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
      // 删除文件
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      // 提交
      onSubmit(form) {
        console.log(this.form)
        this.form.sellPrice = this.form.sellPrice * 100
        if (this.form.isSale) {
          this.form.isSale = '1'
        } else {
          this.form.isSale = '0'
        }
        // a.liveStartTime = a.liveStartTime.getTime()
        console.log(this.form)
        console.log(this.form.courseId)
        if (this.form.courseId !== '') {
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$api.post('live/update', this.form, true, r => {
                console.log(JSON.stringify(r))
                this.$router.push({ name: 'liveCourse' })
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        } else {
          // 新增
          this.$refs.form.validate((valid) => {
            if (valid) {
              this.$api.post('live/add', this.form, true, r => {
                console.log(JSON.stringify(r))
                this.$router.push({ name: 'liveCourse' })
              })
            } else {
              console.log('error submit!!')
              return false
            }
          })
        }
      },
      // 获取数据
      getParams() {
        const routerParams = this.$route.params.dataObj
        if (routerParams !== undefined) {
          console.log(routerParams)
          routerParams.sellPrice /= 100
          this.form = routerParams
          if (routerParams.smallCover !== '') {
            this.isUploadSuccessSmall = true
          }
          if (routerParams.bigCover !== '') {
            this.isUploadSuccessBig = true
          }
          this.fileList.push({ name: this.getFileName(this.form.fileUrl), url: this.form.fileUrl })
        }
      },
      // 控制图片清除
      handleImg(type) {
        if (type === 'big') {
          this.form.bigCover = ''
          this.isUploadSuccessBig = false
        } else if (type === 'small') {
          this.form.smallCover = ''
          this.isUploadSuccessSmall = false
        }
      }
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      // '$route': 'getParams'
    },
    components: {
      // 使用编辑器
      quillEditor
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
  .avatar-uploader-icon-big {
    font-size: 28px;
    color: #8c939d;
    width: 347px;
    height: 142px;
    line-height: 142px;
    text-align: center;
  }
  .avatar-uploader-icon-small {
    font-size: 28px;
    color: #8c939d;
    width: 82px;
    height: 107px;
    line-height: 107px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .addLive_container {
    margin: 15px 0;
  }
  /*富文本编辑器样式*/
  .quill-editor {
    height: 450px;
  }
  .ql-container {
    height: 400px;
  }
  .upload-demo {
    width: 360px;
  }
</style>
