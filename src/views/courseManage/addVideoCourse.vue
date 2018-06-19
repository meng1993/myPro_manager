<template>
  <div class="addVideo_container" style="padding: 0 15px;">
    <el-form :rules="formRules" ref="videoForm" :model="videoForm" label-width="80px" >
      <el-form-item label="专栏标题" prop="mainTitle">
        <el-input style="width: 60%" v-model="videoForm.mainTitle" placeholder="请输入专栏标题（建议输入14字，最多输入50个字）" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="专栏简介" prop="secondTitle">
        <el-input type="textarea" :rows="3" style="width: 60%" v-model="videoForm.secondTitle" placeholder="请输入专栏简介（最多输入100个字）" maxlength="100"></el-input>
      </el-form-item>
      <el-form-item label="专栏分类" prop="courseType">
        <el-select v-model="videoForm.courseType" placeholder="选择专栏课程分类">
          <el-option v-for="item in courseType" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开课计划" prop="hourNum">
        <template>
          <el-input-number v-model="videoForm.hourNum" :min="1" label="课程计划开设的课时数"></el-input-number> <span style="color:#b8c1c5">课程计划开设的课时数</span>
        </template>
      </el-form-item>
      <el-form-item label="专栏售价">
        <el-input style="width: 20%" type="number" v-model="videoForm.sellPrice">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否上架">
        <el-switch v-model="videoForm.isSale"></el-switch>
      </el-form-item>
      <el-form-item label="专栏封面">
        <el-row :gutter="20">
          <el-col :span="6" style="position: relative;">
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" accept="image/*" :on-success="handleAvatarSuccessBig" :before-upload="beforeAvatarUpload">
              <img v-if="videoForm.bigCover" :src="videoForm.bigCover" class="avatarBig"/>
              <i v-else class="el-icon-plus avatar-uploader-icon-big"></i>
            </el-upload>
            <div>
              <svg @click="closeImageBtn('big')" v-show="videoForm.bigCover" style="position: absolute;left: 292px;top: -12px;cursor: pointer;z-index: 9999;" viewBox="0 0 1024 1024" width="32" height="32">
                <path
                  d="M512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333zM671.061333 662.848c-19.242667 19.221333-50.410667 19.221333-69.632 0l-81.216-81.216-81.216 81.216c-19.242667 19.221333-50.410667 19.221333-69.632 0-19.221333-19.242667-19.221333-50.410667 0-69.632L450.581333 512l-81.237333-81.216c-19.221333-19.242667-19.221333-50.410667 0-69.632 19.242667-19.221333 50.410667-19.221333 69.632 0l81.216 81.216 81.216-81.216c19.242667-19.221333 50.410667-19.242667 69.632 0 19.221333 19.242667 19.221333 50.410667 0 69.632L589.824 512l81.237333 81.216C690.282667 612.458667 690.304 643.626667 671.061333 662.848z"
                  p-id="1944" fill="#FF3030"></path>
              </svg>
            </div>
          </el-col>
          <el-col :span="4" style="position: relative;">
            <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" accept="image/*" :on-success="handleAvatarSuccessSmall" :before-upload="beforeAvatarUpload">
              <img v-if="videoForm.smallCover" :src="videoForm.smallCover" class="avatarSmall">
              <i v-else class="el-icon-plus avatar-uploader-icon-small"></i>
            </el-upload>
            <div>
              <svg @click="closeImageBtn('small')" v-show="videoForm.smallCover" style="position: absolute;left: 93px;top: -12px;cursor: pointer;z-index: 9999;" viewBox="0 0 1024 1024" width="32" height="32">
                <path
                  d="M512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333zM671.061333 662.848c-19.242667 19.221333-50.410667 19.221333-69.632 0l-81.216-81.216-81.216 81.216c-19.242667 19.221333-50.410667 19.221333-69.632 0-19.221333-19.242667-19.221333-50.410667 0-69.632L450.581333 512l-81.237333-81.216c-19.221333-19.242667-19.221333-50.410667 0-69.632 19.242667-19.221333 50.410667-19.221333 69.632 0l81.216 81.216 81.216-81.216c19.242667-19.221333 50.410667-19.242667 69.632 0 19.221333 19.242667 19.221333 50.410667 0 69.632L589.824 512l81.237333 81.216C690.282667 612.458667 690.304 643.626667 671.061333 662.848z"
                  p-id="1944" fill="#FF3030"></path>
              </svg>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 使用编辑器 -->
      <el-form-item label="专栏详情" prop="courseDesc">
        <div class="edit_container">
          <quill-editor v-model="videoForm.courseDesc" ref="myQuillEditor" class="editer" :options="editorOption" @ready="onEditorReady($event)">
          </quill-editor>
        </div>
      </el-form-item>
      <el-button class="submitCla" type="primary" @click="onSubmit()">保存</el-button>
    </el-form>
  </div>
</template>
<script>
  // 富文本样式
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  // 调用编辑器
  import { quillRedefine } from 'vue-quill-editor-upload'
  import { quillEditor } from 'vue-quill-editor'
  import { accMul } from '../../utils/index'

  export default {
    components: {
      // 使用编辑器
      quillEditor, quillRedefine
    },
    data() {
      const hourNumValidate = (rule, value, callback) => {
        if (value === 0) {
          callback(new Error('请输入开课计划'))
        } else if (value.length > 10) {
          callback(new Error('开课计划已超过限定计划数'))
        } else {
          callback()
        }
      }
      return {
        uploadUrl: '', // 拼接路径
        courseType: [{
          value: 1,
          name: '限免公开'
        }, {
          value: 2,
          name: '专项能力'
        }, {
          value: 3,
          name: '系列进阶'
        }],
        // 表单数据
        videoForm: {
          courseId: '',
          mainTitle: '',
          secondTitle: '',
          courseType: '',
          hourNum: 1,
          sellPrice: 0,
          bigCover: '',
          smallCover: '',
          isSale: false,
          courseDesc: ''
        },
        // 校验规则
        formRules: {
          mainTitle: [{ required: true, trigger: 'blur', message: '请输入专栏标题' }],
          secondTitle: [{ required: true, trigger: 'blur', message: '请输入专栏简介' }],
          courseType: [{ required: true, trigger: 'blur', message: '请选择专栏分类' }],
          hourNum: [{ required: true, trigger: 'blur', validator: hourNumValidate }],
          courseDesc: [{ required: true, trigger: 'blur', message: '请输入专栏详情' }]
        },
        // 必须初始化为对象 init  to Object
        editorOption: {
        }
      }
    },
    // 如果你需要得到当前的editor对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的editor对象，实际上这里的$refs对应的是当前组件内所有关联了ref属性的组件元素对象
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    created() {
      const self = this
      self.uploadUrl = self.WORKPATH + '/common/uploadFile/image'
      self.editorOption = quillRedefine(
        {
          // 图片上传的设置
          uploadConfig: {
            action: self.uploadUrl, // 必填参数 图片上传地址
            // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
            // 你必须把返回的数据中所包含的图片地址 return 回去
            res: (respnse) => {
              // console.log('quillRedefine', respnse)
              if (respnse.status !== 0) {
                return this.$message.error('上传图片失败')
              }
              return respnse.data.url
            },
            name: 'file', // 图片上传参数名
            size: 5120, // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
            accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
          },
          placeholder: '请输入专栏详情', // 可选参数 富文本框内的提示语
          toolOptions: [ // 自定义工具栏按钮，去掉了上传视频与link功能
            ['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'indent': '-1' }, { 'indent': '+1' }], [{ 'direction': 'rtl' }], [{ 'size': ['small', false, 'large', 'huge'] }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'align': [] }], ['clean'], ['image']
          ]
        }
      )
      self.getCourseIdByRouter()
      if (self.videoForm.courseId !== '') {
        self.initLoadData()
      }
    },
    methods: {
      // 富文本编辑器操作
      onEditorReady(editor) {
        console.log('onEditorReady', editor)
      },
      // 通过路由获取上个页面传递过来的courseId
      getCourseIdByRouter() {
        const self = this
        const courseId = self.$route.query.id
        if (courseId !== undefined) {
          self.videoForm.courseId = courseId
        }
      },
      // 初始化加载数据
      initLoadData() {
        const self = this
        const params = { 'courseId': self.videoForm.courseId }
        self.$api.post('/course/getCourseDetail', params, false, r => {
          if (r.status !== 0) {
            return self.$message.error('详情查询失败')
          }
          const datas = r.data
          datas.sellPrice = datas.sellPrice / 100
          datas.isSale = datas.isSale === 1
          // console.log('data', datas)
          self.videoForm = datas
        })
      },
      // 上传大封面成功
      handleAvatarSuccessBig(res, file) {
        const resp = file.response
        if (resp.status !== 0) {
          return this.$message.error('上传文件失败')
        }
        const data = file.response.data
        this.videoForm.bigCover = data.url
      },
      // 上传小封面成功
      handleAvatarSuccessSmall(res, file) {
        const resp = file.response
        if (resp.status !== 0) {
          return this.$message.error('上传文件失败')
        }
        const data = file.response.data
        this.videoForm.smallCover = data.url
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
      // 删除上传的图片
      closeImageBtn(type) {
        if (type === 'big') {
          this.videoForm.bigCover = ''
        } else {
          this.videoForm.smallCover = ''
        }
      },
      // 保存数据
      onSubmit() {
        const self = this
        self.$refs.videoForm.validate((valid) => {
          if (valid) {
            // 深拷贝
            const params = JSON.parse(JSON.stringify(self.videoForm))
            if (params.bigCover === '') {
              return self.$message.error('请上传大封面图片')
            }
            if (params.smallCover === '') {
              return self.$message.error('请上传小封面图片')
            }
            params.sellPrice = accMul(self.videoForm.sellPrice, 100)
            params.isSale = self.videoForm.isSale ? 1 : 0
            // console.log('onSubmit', params)
            self.$api.post('/course/saveCourseData', params, true, r => {
              if (r.status === 0) {
                this.$router.go(-1)
                return self.$message.success('保存成功')
              } else {
                return self.$message.error('保存失败')
              }
            })
          }
        })
      }
    }
  }
</script>


<style>
  .el-icon-circle-close::before{
    width: 25px;
    height: 25px;
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
  .avatar-uploader-icon-big {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 150px;
    line-height: 140px;
    text-align: center;
  }
  .avatar-uploader-icon-small {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatarBig {
    width: 300px;
    height: 150px;
    display: block;
  }
  .avatarSmall {
    width: 100px;
    height: 100px;
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
  /*富文本编辑器样式*/
  .quill-editor {
    height: 450px;
  }
  .ql-container {
      height: 400px;
  }

</style>
