<template>
  <div class="addVideo_container" style="padding: 0 15px;">
    <el-form :rules="formRules" ref="catelogForm" :model="catelogForm" label-width="80px" >
      <el-form-item label="课程标题" prop="cateName">
        <el-input style="width: 60%" v-model="catelogForm.cateName" placeholder="请输入课程标题（建议输入14字，最多输入50个字）" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="课程类型">
        <el-radio-group v-model="catelogForm.cateType" @change="radioChangeBtn">
          <el-radio-button label="0">音频</el-radio-button>
          <el-radio-button label="1">视频</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="音频文件" prop="cateFileUrl">
        <el-upload class="upload-demo" :action="uploadUrl" :limit="1" :on-exceed="handleExceed" :on-success="uploadVideoSuccessBtn" :on-remove="handleRemove"  :multiple="isMultiple" :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="显示时间">
        <el-date-picker v-model="catelogForm.showTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="免费试听">
        <el-switch v-model="catelogForm.isFree" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-form-item label="课程标签">
        <el-row>
          <el-button size="small" @click="showChooseTagBtn"><i class="el-icon-plus"></i> 添加标签</el-button>
          <el-dialog title="添加标签" :visible.sync="dialogTableVisible" :center="true">
            <el-table :data="initTagData" ref="multipleTagData" border tooltip-effect="dark" @selection-change="handleSelectionChange">
              <el-table-column type="selection"></el-table-column>
              <el-table-column property="tagName" label="标签名称"></el-table-column>
            </el-table>
            <el-button class="toggleCatelogCla" @click="toggleSelection">确定</el-button>
          </el-dialog>
        </el-row>
        <el-row><el-tag v-for="tag in catelogForm.tagsVoList" :closable="true" :disable-transitions="false" :key="tag.tagId" @close="handleCloseForTag(tag)">{{tag.tagName}}</el-tag></el-row>
      </el-form-item>
      <el-form-item label="PPT文稿">
        <el-upload class="upload-demo" :action="uploadPPTURL" :limit="1" :on-exceed="handleExceed" :on-success="uploadPPTSuccessBtn" :on-remove="handlePPTRemove"  :multiple="isMultiple" :file-list="pptFileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <!-- 使用编辑器 -->
      <el-form-item label="文稿内容">
        <div class="edit_container">
          <quill-editor v-model="catelogForm.draftContent" ref="myQuillEditor" class="editer" :options="editorOption" @ready="onEditorReady($event)">
          </quill-editor>
        </div>
      </el-form-item>
      <el-button class="submitCla" type="primary" @click="submitBtn()">保存</el-button>
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

  export default {
    components: {
      // 使用编辑器
      quillEditor, quillRedefine
    },
    data() {
      return {
        uploadUrl: '', // 拼接路径
        uploadPPTURL: '', // 文稿附件PPT 上传路径
        fileList: [], // 课程文件
        pptFileList: [], // 文稿附件PPT
        // 课时详情
        catelogForm: {
          courseId: '', // 所属课程Id
          cateId: '', // 主键Id
          cateName: '', // 目录标题
          cateType: 0, // 课程类型(0为音频，1为视频)
          draftAttachUrl: '', // 文稿附件url(PPT)
          draftContent: '', // 文稿内容
          duration: 0, // 播放时长(秒)
          isFree: false, // 是否免费试听(0为是，1为否)
          playNum: '', // 播放次数
          showTime: '', // 显示时间
          cateFileUrl: '', // 播放文件路径
          // 课时所属标签
          tagsVoList: [
            // {
            //   tagId: '',
            //   tagName: ''
            // }
          ]
        },
        // 初始化加载的标签页数据
        initTagData: [{
          tagId: '',
          tagName: ''
        }],
        // 校验规则
        formRules: {
          cateName: [{ required: true, trigger: 'blur', message: '课程标题不能为空' }],
          cateFileUrl: [{ required: true, trigger: 'blur', message: '音频文件不能为空' }]
        },
        isMultiple: false,
        dialogTableVisible: false,
        multipleSelection: [],
        isInit: true,
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
      self.uploadUrl = self.WORKPATH + '/common/uploadFile/voice'
      self.uploadPPTURL = self.WORKPATH + '/common/uploadFile/ppt'
      self.editorOption = quillRedefine({
        // 图片上传的设置
        uploadConfig: {
          action: self.WORKPATH + '/common/uploadFile/image', // 必填参数 图片上传地址
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
        placeholder: '请输入课时详情', // 可选参数 富文本框内的提示语
        toolOptions: [ // 自定义工具栏按钮，去掉了上传视频与link功能
          ['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'indent': '-1' }, { 'indent': '+1' }], [{ 'direction': 'rtl' }], [{ 'size': ['small', false, 'large', 'huge'] }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'align': [] }], ['clean'], ['image']
        ]
      })
      self.getRouterDetail()
      if (self.catelogForm.cateId !== '') {
        self.initLoadingData()
      }
      this.initLoadingTagData()
    },
    methods: {
      // 富文本编辑器操作
      onEditorReady(editor) {
        // console.log(editor)
      },
      // 通过路由获取上个页面传递过来的courseId
      getRouterDetail() {
        const self = this
        const params = self.$route.query
        const courseId = params['id']
        const cateId = params['did']
        self.catelogForm.courseId = courseId
        if (cateId !== undefined) {
          self.catelogForm.cateId = cateId
        }
      },
      // 初始化加载数据
      initLoadingData() {
        const self = this
        const params = { 'cateId': self.catelogForm.cateId }
        self.$api.post('/course/getCourseCateLogDetail', params, false, r => {
          if (r.status !== 0) {
            return self.$message.error('详情查询失败')
          }
          const datas = r.data
          datas.isFree = datas.isFree === 1
          datas.showTime = this.getDateTimeByFormat(datas.showTime)
          self.catelogForm = datas
          this.fileList.push({ name: this.getFileName(datas.cateFileUrl), url: datas.cateFileUrl })
          this.pptFileList.push({ name: this.getFileName(datas.draftAttachUrl), url: datas.draftAttachUrl })
          this.radioChangeBtn(datas.cateType)
        })
      },
      // 初始化加载标签页数据
      initLoadingTagData() {
        const self = this
        const params = { 'pageNum': 0, 'pageSize': 0 }
        self.$api.post('/tag/list', params, false, r => {
          if (r.status !== 0) {
            return self.$message.error('标签页数据查询失败')
          }
          const listData = r.data.list
          listData.forEach(val => {
            self.$delete(val, 'sort')
            self.$delete(val, 'cateCount')
          })
          self.initTagData = listData
        })
      },
      // 日期格式转化
      getDateTimeByFormat(time) {
        return new Date(time)
      },
      // 文件类型单选改变事件
      radioChangeBtn(val) {
        if (val === 1) {
          // 视频路径
          this.uploadUrl = this.WORKPATH + '/common/uploadFile/video'
        } else {
          // 音频路径
          this.uploadUrl = this.WORKPATH + '/common/uploadFile/voice'
        }
      },
      // 保存文件
      submitBtn() {
        const self = this
        self.$refs.catelogForm.validate((valid) => {
          if (valid) {
            // 深拷贝
            const params = JSON.parse(JSON.stringify(self.catelogForm))
            if (params.draftAttachUrl === '' && params.draftContent === '') {
              return self.$message.error('请上传文稿附件或输入文稿内容')
            }
            params.isFree = self.catelogForm.isFree ? 1 : 0
            self.$api.post('/course/saveCourseCateLogData', params, true, r => {
              if (r.status === 0) {
                this.$router.go(-1)
                return self.$message.success('保存成功')
              } else {
                return self.$message.success('保存失败')
              }
            })
          }
        })
      },
      // ↓↓↓↓↓上传音频文件↓↓↓↓↓
      // 文件列表移除文件时的钩子
      handleRemove(file, fileList) {
        this.fileList = []
        this.catelogForm.cateFileUrl = ''
      },
      // 文件上传成功时的钩子
      uploadVideoSuccessBtn(res, files, fileLists) {
        // console.log('文件上传成功时的钩子', file)
        if (res.status !== 0) {
          return this.$message.error('文件上传错误')
        }
        const data = res.data
        this.catelogForm.cateFileUrl = data.url
        this.catelogForm.duration = data.duration
        this.fileList.push({ name: this.getFileName(data.url), url: data.url })
      },
      // 文件超出个数限制时的钩子
      handleExceed(files, fileList) {
        this.$message.warning(`只能上传一个文件，如要上传清先删除原先文件`)
      },
      // ↑↑↑↑↑上传音频文件↑↑↑↑↑
      // ↓↓↓↓↓上传PPT文件↓↓↓↓↓
      // 文件上传成功时的钩子
      uploadPPTSuccessBtn(file) {
        // console.log('文件上传成功时的钩子', file)
        if (file.status !== 0) {
          return this.$message.error('文件上传错误')
        }
        const url = file.data.url
        this.catelogForm.draftAttachUrl = url
        this.pptFileList.push({ name: this.getFileName(url), url: url })
      },
      // 文件列表移除文件时的钩子
      handlePPTRemove() {
        this.pptFileList = []
        this.catelogForm.draftAttachUrl = ''
      },
      // ↑↑↑↑↑上传PPT文件↑↑↑↑↑
      // 获取文件名
      getFileName(path) {
        const index = path.indexOf('?')
        path = index > -1 ? path.substring(0, path.indexOf('?')) : path
        return path.substring(path.lastIndexOf('/') + 1)
      },
      // 移除标签
      handleCloseForTag(tag) {
        const self = this
        const tagsVoList = self.catelogForm.tagsVoList
        self.$delete(tagsVoList, tagsVoList.indexOf(tag))
        if (self.$refs.multipleTagData) {
          self.$refs.multipleTagData.clearSelection()
          self.initDefaultChooseTagEvent()
        }
      },
      // 弹出选择标签页面
      showChooseTagBtn() {
        const self = this
        self.dialogTableVisible = true
        // 只需要初始化第一次加载即可
        if (self.isInit) {
          self.isInit = false
          self.initDefaultChooseTagEvent()
        }
      },
      // 确定选择的标签
      toggleSelection() {
        const self = this
        self.catelogForm.tagsVoList = self.multipleSelection
        self.dialogTableVisible = false
      },
      // 勾选时触发
      handleSelectionChange(val) {
        // console.log('handleSelectionChange', val)
        this.multipleSelection = val
      },
      // 初始化默认选中弹框表格的数据
      initDefaultChooseTagEvent() {
        const self = this
        const tagsVoList = self.catelogForm.tagsVoList
        if (tagsVoList.length === 0) {
          return
        }
        let timer = setInterval(() => {
          if (self.$refs.multipleTagData) {
            tagsVoList.forEach((row) => {
              self.$refs.multipleTagData.toggleRowSelection(self.getInitTagDataPlace(row), true)
            })
            window.clearInterval(timer)
            timer = null
          } else {
            console.log('no multipleTagData refs')
          }
        }, 100)
      },
      // 定位数组位置
      getInitTagDataPlace(defaultVal) {
        const self = this
        let result
        const tagData = self.initTagData
        for (let i = 0; i < tagData.length; i++) {
          if (JSON.stringify(defaultVal) === JSON.stringify(tagData[i])) {
            result = self.initTagData[i]
            break
          }
        }
        return result
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

  .edit_container {
    max-width: 1200px;
    width: auto;
    height: 500px;
  }
  .upload-demo {
    width: 360px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .toggleCatelogCla {
    margin-top: 15px;
  }
  /*富文本编辑器样式*/
  .quill-editor {
    height: 450px;
  }
  .ql-container {
    height: 400px;
  }

</style>
